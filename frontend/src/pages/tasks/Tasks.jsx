import React, { useState, useEffect } from 'react';
import {
  Plus,
  CheckSquare,
  Trash2,
  Edit2,
  Filter,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/task.service';
import userService from '../services/user.service';
import { toast } from 'react-toastify';

const TasksPage = () => {
  const { user: currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    status: 'pending',
  });

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await taskService.getAllTasks(1, 100);
      setTasks(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers(1, 100);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      await taskService.createTask(formData);
      toast.success('Task created successfully');
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        status: 'pending',
      });
      setShowCreateModal(false);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskService.deleteTask(taskId);
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;

    // Filter by role
    if (currentUser?.role === 'user') {
      return (
        (task.assignedTo?._id === currentUser._id || task.assignedTo === currentUser._id) &&
        matchesSearch &&
        matchesStatus
      );
    }

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin-slow inline-block">
            <CheckSquare size={48} className="text-blue-600" />
          </div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-600 mt-2">
              Create, assign, and manage tasks for your team.
            </p>
          </div>
          {(currentUser?.role === 'admin' || currentUser?.role === 'super_admin') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Create Task</span>
            </button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Tasks Grid/Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredTasks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                      Title
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                      Assigned To
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                      Priority
                    </th>
                    {(currentUser?.role === 'admin' ||
                      currentUser?.role === 'super_admin') && (
                      <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr
                      key={task._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        {task.title || task.name}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {task.assignedTo?.name || 'Unassigned'}
                      </td>
                      <td className="py-4 px-6">
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
                      <td className="py-4 px-6">
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
                      {(currentUser?.role === 'admin' ||
                        currentUser?.role === 'super_admin') && (
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600">
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckSquare size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No tasks found</p>
            </div>
          )}
        </div>

        {/* Create Task Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Task</h2>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="input-field"
                    placeholder="Task title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="input-field"
                    placeholder="Task description"
                    rows="3"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign To
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) =>
                      setFormData({ ...formData, assignedTo: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="">Select a user</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="input-field"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
