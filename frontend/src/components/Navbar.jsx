import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b px-4 py-3 shadow-sm sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Link to="/" className="font-bold text-xl text-primary-600">
        Task Manager Pro
      </Link>
      {user && (
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Link to="/" className="text-sm text-gray-600 hover:text-primary-600">
            Dashboard
          </Link>
          <Link to="/projects" className="text-sm text-gray-600 hover:text-primary-600">
            Projects
          </Link>
          {user.role === 'admin' && (
            <Link to="/admin" className="text-sm text-gray-600 hover:text-primary-600">
              Admin
            </Link>
          )}
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-[.3rem]" />
          <span className="text-sm font-medium">{user.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md"
          >
            Logout
          </button>
        </div>
      )}
      </div>
    </nav>
  );
};

export default Navbar;
