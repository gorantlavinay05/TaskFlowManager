import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Users, Briefcase, ListTodo, Calendar, Plus } from 'lucide-react';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Task assignment state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const fetchData = async () => {
    try {
      const [usersRes, projectsRes, tasksRes] = await Promise.all([
        api.get(`/api/users`),
        api.get(`/api/projects`),
        api.get(`/api/tasks`)
      ]);
      setUsers(usersRes.data);
      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
      
      // Only set initial values if they haven't been set yet
      setProjectId(prev => prev || (projectsRes.data.length > 0 ? projectsRes.data[0]._id : ''));
      setAssigneeId(prev => prev || (usersRes.data.length > 0 ? usersRes.data[0]._id : ''));
      
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !projectId || !assigneeId) return;
    try {
      await api.post(`/api/tasks`, {
        title,
        description,
        project: projectId,
        assignedTo: assigneeId,
        dueDate,
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      fetchData();
    } catch (err) {
      setError('Failed to assign task');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Admin Panel...</div>;

  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-indigo-600" />
          Master Admin Panel
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg"><Users className="text-blue-600 w-6 h-6"/></div>
          <div><p className="text-sm text-slate-500">Total Users</p><p className="text-2xl font-bold text-slate-900">{users.length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-lg"><Briefcase className="text-purple-600 w-6 h-6"/></div>
          <div><p className="text-sm text-slate-500">Total Projects</p><p className="text-2xl font-bold text-slate-900">{projects.length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-lg"><ListTodo className="text-indigo-600 w-6 h-6"/></div>
          <div><p className="text-sm text-slate-500">Total Tasks</p><p className="text-2xl font-bold text-slate-900">{tasks.length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-lg"><Calendar className="text-red-600 w-6 h-6"/></div>
          <div><p className="text-sm text-slate-500">Overdue Tasks</p><p className="text-2xl font-bold text-red-600">{overdueTasks.length}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Task Assignment Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Assign New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Task Title</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Assign To</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={assigneeId} onChange={e => setAssigneeId(e.target.value)} required>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Project</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={projectId} onChange={e => setProjectId(e.target.value)} required>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Due Date</label>
                <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                <textarea className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" rows="3" value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              <button type="submit" className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                <Plus className="w-4 h-4" /> Delegate Task
              </button>
            </form>
          </div>
        </div>

        {/* Global Task Tracker */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">All System Tasks</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Task</th>
                    <th className="px-4 py-3">Assignee</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Deadline</th>
                    <th className="px-4 py-3">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tasks.map(task => {
                    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';
                    return (
                      <tr key={task._id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900">{task.title}</p>
                          {task.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{task.assignedTo?.name || 'Unassigned'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            task.status === 'Done' ? 'bg-green-100 text-green-800' : 
                            task.status === 'In Review' ? 'bg-purple-100 text-purple-800' :
                            task.status === 'On Going' ? 'bg-amber-100 text-amber-800' : 
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className={`px-4 py-3 ${isOverdue ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs italic">
                          {new Date(task.updatedAt).toLocaleString()}
                        </td>
                      </tr>
                    )
                  })}
                  {tasks.length === 0 && <tr><td colSpan="5" className="text-center py-4 text-slate-500">No tasks found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Registered Users</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map(u => (
                <div key={u._id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-900">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${u.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'}`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
