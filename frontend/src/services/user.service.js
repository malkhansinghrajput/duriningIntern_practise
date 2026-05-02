import apiClient from './api';

const userService = {
  getAllUsers: (page = 1, limit = 10, search = '') => {
    return apiClient.get('/users', {
      params: { page, limit, search },
    });
  },

  getUserById: (id) => {
    return apiClient.get(`/users/${id}`);
  },

  deleteUser: (id) => {
    return apiClient.delete(`/users/${id}`);
  },

  promoteUser: (id, newRole) => {
    return apiClient.patch(`/users/${id}`, { role: newRole });
  },

  updateUser: (id, data) => {
    return apiClient.patch(`/users/${id}`, data);
  },

  getCurrentUser: () => {
    return apiClient.get('/users/me');
  },

  assignRole: (userId, role) => {
    return apiClient.patch(`/users/${userId}`, { role });
  },
};

export default userService;
