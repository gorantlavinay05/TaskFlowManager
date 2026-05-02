import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, ListTodo } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${"http://localhost:5005/api"}/tasks`);
        setTasks(res.data);
      } catch (err) {
        setError('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5005/api/tasks/${taskId}`, { status: newStatus });
      const res = await axios.get(`http://localhost:5005/api/tasks`);
      setTasks(res.data);
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'On Going' || t.status === 'In Review').length;
  const todoTasks = tasks.filter(t => t.status === 'To Do').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <ListTodo className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Tasks</p>
            <p className="text-3xl font-bold text-slate-900">{totalTasks}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Completed</p>
            <p className="text-3xl font-bold text-slate-900">{completedTasks}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-amber-50 rounded-lg">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <p className="text-3xl font-bold text-slate-900">{inProgressTasks + todoTasks}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-12 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {tasks.slice(0, 5).map(task => (
            <div key={task._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-lg gap-4">
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-lg">{task.title}</p>
                {task.description && <p className="text-sm text-slate-600 mt-1 mb-2 line-clamp-2">{task.description}</p>}
                <div className="flex flex-wrap gap-3 text-xs text-slate-500 font-medium">
                  <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
                    👤 {task.assignedTo?.name || 'Unassigned'}
                  </span>
                  <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
                    📁 {task.project?.title || 'No Project'}
                  </span>
                  {task.dueDate && (
                    <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-sm text-indigo-600">
                      ⏱️ Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <select
                className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none
                ${task.status === 'Done' ? 'bg-green-100 text-green-800' : 
                  task.status === 'In Review' ? 'bg-purple-100 text-purple-800' :
                  task.status === 'On Going' ? 'bg-amber-100 text-amber-800' : 
                  'bg-slate-200 text-slate-800'}`}
                value={task.status}
                onChange={(e) => updateStatus(task._id, e.target.value)}
              >
                <option value="To Do" className="bg-white text-slate-800">To Do</option>
                <option value="On Going" className="bg-white text-slate-800">On Going</option>
                <option value="In Review" className="bg-white text-slate-800">In Review</option>
                <option value="Done" className="bg-white text-slate-800">Done</option>
              </select>
            </div>
          ))}
          {tasks.length === 0 && <p className="text-slate-500 text-center py-4">No tasks found.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
