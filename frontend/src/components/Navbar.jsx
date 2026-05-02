import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Briefcase, CheckSquare, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:text-indigo-200 transition-colors">
              <CheckSquare className="w-6 h-6" />
              TaskFlow Manager
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center gap-1 hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            
            {user.role === 'Admin' && (
              <>
                <Link to="/admin" className="flex items-center gap-1 hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                  Admin Panel
                </Link>
                <Link to="/projects" className="flex items-center gap-1 hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <Briefcase className="w-4 h-4" />
                  Projects
                </Link>
              </>
            )}
            
            <Link to="/tasks" className="flex items-center gap-1 hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <CheckSquare className="w-4 h-4" />
              Tasks
            </Link>
            
            <div className="border-l border-indigo-400 h-6 mx-2"></div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium bg-indigo-700 px-2 py-1 rounded-full">{user.role}</span>
              <span className="text-sm">{user.name}</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors ml-4"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
