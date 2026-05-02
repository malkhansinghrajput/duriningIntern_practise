import apiClient from './api';

const authService = {
  register: (name, email, password) => {
    return apiClient.post('/auth/register', { name, email, password });
  },

  login: (email, password) => {
    return apiClient.post('/auth/login', { email, password });
  },

  refresh: (refreshToken) => {
    return apiClient.post('/auth/refresh', { refreshToken });
  },

  logout: () => {
    return apiClient.post('/auth/logout');
  },

  getProfile: () => {
    return apiClient.get('/auth/profile');
  },
};

export default authService;
