import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/task.service';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [myTasks, setMyTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        setIsLoading(true);
        const response = await taskService.getAllTasks(1, 100);
        const tasks = response.data.data || [];

        // Filter tasks assigned to current user
        const userTasks = tasks.filter(t => t.assignedTo?._id === user?._id || t.assignedTo === user?._id);

        setMyTasks(userTasks.slice(0, 5));

        // Calculate stats
        const completed = userTasks.filter(t => t.status === 'completed').length;
        const pending = userTasks.filter(t => t.status !== 'completed').length;

        setStats({
          total: userTasks.length,
          completed,
          pending,
          overdue: 0,
        });
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyTasks();
  }, [user]);

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      toast.success('Task updated successfully');
      // Refresh tasks
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin-slow inline-block">
            <CheckSquare size={48} className="text-blue-600" />
          </div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here are your tasks and progress for today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">My Tasks</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <CheckSquare size={32} className="text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.completed}</p>
              </div>
              <TrendingUp size={32} className="text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.pending}</p>
              </div>
              <Clock size={32} className="text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Overdue</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.overdue}</p>
              </div>
              <AlertCircle size={32} className="text-red-600" />
            </div>
          </div>
        </div>

        {/* My Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">My Tasks</h2>

          {myTasks.length > 0 ? (
            <div className="space-y-3">
              {myTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {task.title || task.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {task.description}
                    </p>
                  </div>
                  <select
                    value={task.status || 'pending'}
                    onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                    className={`px-3 py-1 rounded text-xs font-medium border-0 focus:ring-2 ${
                      task.status === 'completed'
                        ? 'bg-green-100 text-green-700 focus:ring-green-200'
                        : 'bg-yellow-100 text-yellow-700 focus:ring-yellow-200'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckSquare size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                No tasks assigned to you yet
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Your assigned tasks will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
