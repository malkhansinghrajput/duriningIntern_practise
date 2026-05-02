import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  CheckSquare,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', roles: ['user', 'admin', 'super_admin'] },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks', roles: ['user', 'admin', 'super_admin'] },
    { icon: Users, label: 'Users', path: '/users', roles: ['admin', 'super_admin'] },
    { icon: Shield, label: 'Permissions', path: '/permissions', roles: ['super_admin'] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['user', 'admin', 'super_admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(user?.role)
  );

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 lg:relative lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <CheckSquare size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold">Task Manager</h1>
                <p className="text-xs text-gray-400">v1.0.0</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
