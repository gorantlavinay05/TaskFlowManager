const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Task = require('../models/Task');

// @route   POST /api/tasks
// @desc    Create a task
// @access  Private/Admin
router.post('/', auth, role(['Admin']), async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, project } = req.body;
    const newTask = new Task({
      title,
      description,
      assignedTo,
      dueDate,
      project,
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/tasks
// @desc    Get tasks
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Admin') {
      tasks = await Task.find().populate('assignedTo', 'name email').populate('project', 'title');
    } else {
      tasks = await Task.find({ assignedTo: req.user.id }).populate('assignedTo', 'name email').populate('project', 'title');
    }
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task status (Members) or full task (Admin)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Members can only update their assigned tasks
    if (req.user.role === 'Member' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    if (req.user.role === 'Member') {
      // Member can only update status
      task.status = req.body.status || task.status;
    } else {
      // Admin can update anything
      task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      return res.json(task);
    }

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private/Admin
router.delete('/:id', auth, role(['Admin']), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
