const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Project = require('../models/Project');

// @route   POST /api/projects
// @desc    Create a project
// @access  Private/Admin
router.post('/', auth, role(['Admin']), async (req, res) => {
  try {
    const { title } = req.body;
    const newProject = new Project({
      title,
      createdBy: req.user.id,
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/projects
// @desc    Get all projects
// @access  Private/Admin
router.get('/', auth, role(['Admin']), async (req, res) => {
  try {
    const projects = await Project.find().populate('createdBy', 'name');
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
