import React from 'react';
import { Menu, Bell, Search, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6 max-w-full">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu size={20} className="text-gray-600" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-4 py-2 max-w-md">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks, users..."
              className="bg-transparent border-none outline-none text-sm flex-1"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-4 border-l border-gray-200 pl-4">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-lg transition text-gray-600 hover:text-red-600"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
