import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');

        if (storedUser && storedAccessToken) {
          setUser(JSON.parse(storedUser));
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);

          // Setup axios interceptor
          setupAxiosInterceptors(storedAccessToken, storedRefreshToken);
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const setupAxiosInterceptors = (token, refreshTok) => {
    // Request interceptor
    axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const response = await axios.post(
              `${API_BASE_URL}/auth/refresh`,
              { refreshToken: refreshTok }
            );

            const newAccessToken = response.data.data.accessToken;
            const newRefreshToken = response.data.data.refreshToken;

            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);
            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            clearAuth();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
      });

      const { user: userData, accessToken: token, refreshToken: refToken } = response.data.data;

      setUser(userData);
      setAccessToken(token);
      setRefreshToken(refToken);

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refToken);

      setupAxiosInterceptors(token, refToken);

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { user: userData, accessToken: token, refreshToken: refToken } = response.data.data;

      setUser(userData);
      setAccessToken(token);
      setRefreshToken(refToken);

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refToken);

      setupAxiosInterceptors(token, refToken);

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = () => {
    clearAuth();
  };

  const clearAuth = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Clear axios interceptors
    axios.interceptors.request.handlers = [];
    axios.interceptors.response.handlers = [];
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    isAuthenticated: !!user && !!accessToken,
    register,
    login,
    logout,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
