import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken
        });

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getEmployees: () => api.get('/auth/employees'), 
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
    }
  }
};

// Task API 
export const taskAPI = {
  // Admin endpoints
  createTask: (data) => api.post('/tasks', data),
  getAllTasks: () => api.get('/tasks/all'),
  getTasksByEmployee: () => api.get('/tasks/by-employee'),
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),

  // Employee endpoints
  getMyTasks: () => api.get('/tasks/my-tasks'),
  getMyTaskCounts: () => api.get('/tasks/my-task-counts'),
  acceptTask: (taskId) => api.put(`/tasks/${taskId}/accept`),
  completeTask: (taskId) => api.put(`/tasks/${taskId}/complete`),
  failTask: (taskId) => api.put(`/tasks/${taskId}/fail`),
};



export default api;