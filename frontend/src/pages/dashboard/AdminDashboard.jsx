import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  CheckSquare,
  ArrowUpRight,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/user.service';
import taskService from '../services/task.service';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch users data
        const usersRes = await userService.getAllUsers(1, 100);
        const usersData = usersRes.data.data || [];
        
        // Fetch tasks data
        const tasksRes = await taskService.getAllTasks(1, 100);
        const tasksData = tasksRes.data.data || [];

        // Calculate statistics
        const completedCount = tasksData.filter(t => t.status === 'completed').length;
        const pendingCount = tasksData.filter(t => t.status === 'pending' || t.status === 'todo').length;

        setStats({
          totalUsers: usersData.length,
          totalTasks: tasksData.length,
          completedTasks: completedCount,
          pendingTasks: pendingCount,
        });

        // Get recent items
        setRecentTasks(tasksData.slice(0, 5));
        setRecentUsers(usersData.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, title, value, trend, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-green-600 text-sm">
              <ArrowUpRight size={16} className="mr-1" />
              {trend} from last month
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin-slow inline-block">
            <BarChart3 size={48} className="text-blue-600" />
          </div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening in your organization today.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats.totalUsers}
            color="bg-blue-600"
          />
          <StatCard
            icon={CheckSquare}
            title="Total Tasks"
            value={stats.totalTasks}
            color="bg-green-600"
          />
          <StatCard
            icon={TrendingUp}
            title="Completed Tasks"
            value={stats.completedTasks}
            color="bg-purple-600"
          />
          <StatCard
            icon={Clock}
            title="Pending Tasks"
            value={stats.pendingTasks}
            color="bg-orange-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Recent Tasks</h2>
                <a href="/tasks" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </a>
              </div>

              {recentTasks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">
                          Task Title
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">
                          Assigned To
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">
                          Priority
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTasks.map((task) => (
                        <tr
                          key={task._id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                          <td className="py-3 px-4 text-gray-900 font-medium">
                            {task.title || task.name}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {task.assignedTo?.name || 'Unassigned'}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                task.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : task.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {task.status?.replace('_', ' ') || 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                task.priority === 'high'
                                  ? 'bg-red-100 text-red-700'
                                  : task.priority === 'medium'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {task.priority || 'Medium'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckSquare size={40} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No tasks yet. Create one to get started!</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Recent Users</h2>
                <a href="/users" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </a>
              </div>

              {recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users size={40} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No users yet</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Completion Rate</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Tasks Completed</span>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.totalTasks > 0
                        ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          stats.totalTasks > 0
                            ? (stats.completedTasks / stats.totalTasks) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
