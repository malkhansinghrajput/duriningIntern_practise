import apiClient from './api';

const taskService = {
  getAllTasks: (page = 1, limit = 10, status = '', assignedTo = '') => {
    return apiClient.get('/tasks', {
      params: { page, limit, status, assignedTo },
    });
  },

  getTaskById: (id) => {
    return apiClient.get(`/tasks/${id}`);
  },

  createTask: (taskData) => {
    return apiClient.post('/tasks', taskData);
  },

  updateTask: (id, updateData) => {
    return apiClient.put(`/tasks/${id}`, updateData);
  },

  deleteTask: (id) => {
    return apiClient.delete(`/tasks/${id}`);
  },

  updateTaskStatus: (id, status) => {
    return apiClient.patch(`/tasks/${id}`, { status });
  },

  assignTask: (id, userId) => {
    return apiClient.patch(`/tasks/${id}`, { assignedTo: userId });
  },

  getMyTasks: (page = 1, limit = 10) => {
    return apiClient.get('/tasks/my-tasks', {
      params: { page, limit },
    });
  },
};

export default taskService;
