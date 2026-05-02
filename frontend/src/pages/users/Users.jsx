import React, { useState, useEffect } from 'react';
import { Users, Trash2, Crown, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/user.service';
import { toast } from 'react-toastify';

const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getAllUsers(1, 100);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await userService.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handlePromoteUser = async (userId, currentRole) => {
    const newRole = currentRole === 'user' ? 'admin' : 'super_admin';

    try {
      await userService.assignRole(userId, newRole);
      toast.success(`User promoted to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to promote user');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin-slow inline-block">
            <Users size={48} className="text-blue-600" />
          </div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage users, roles, and permissions in your organization.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredUsers.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                    Name
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                    Email
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                    Role
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {currentUser?.role === 'super_admin' &&
                          user._id !== currentUser._id && (
                            <>
                              <button
                                onClick={() =>
                                  handlePromoteUser(user._id, user.role)
                                }
                                className="p-2 hover:bg-orange-50 rounded-lg transition text-orange-600"
                                title="Promote"
                              >
                                <Crown size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No users found</p>
            </div>
          )}
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium">Total Users</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium">Admins</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium">Regular Users</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {users.filter(u => u.role === 'user').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
