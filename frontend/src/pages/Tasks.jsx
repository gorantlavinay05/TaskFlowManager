import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, CheckSquare } from 'lucide-react';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${"http://localhost:5005/api"}/tasks`);
      setTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, [user.role]);

  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`${"http://localhost:5005/api"}/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading tasks...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <CheckSquare className="w-8 h-8 text-indigo-600" />
          Tasks Board
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {['To Do', 'On Going', 'In Review', 'Done'].map(status => (
          <div key={status} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-4 flex justify-between items-center">
              {status}
              <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">
                {tasks.filter(t => t.status === status).length}
              </span>
            </h3>
            <div className="space-y-4">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task._id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                  <h4 className="font-semibold text-slate-900 mb-1">{task.title}</h4>
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">{task.description}</p>
                  <div className="flex justify-between items-center text-xs text-slate-500 mb-4">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                      {task.project?.title || 'Unknown Project'}
                    </span>
                    {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                  
                  <div className="border-t border-slate-100 pt-3 flex gap-2">
                    <select
                      className="w-full text-xs border border-slate-200 rounded p-1 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={task.status}
                      onChange={(e) => updateStatus(task._id, e.target.value)}
                    >
                      <option value="To Do">To Do</option>
                      <option value="On Going">On Going</option>
                      <option value="In Review">In Review</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
