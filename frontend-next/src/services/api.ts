import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const isAuthRoute = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
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
  register: (data: { email: string; password: string; firstName: string; role: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getEmployees: () => api.get('/auth/employees'),
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
    }
  }
};

// Task API
export const taskAPI = {
  createTask: (data: { title: string; description: string; date: string; category: string; assignTo: number }) =>
    api.post('/tasks', data),
  getAllTasks: () => api.get('/tasks/all'),
  getTasksByEmployee: () => api.get('/tasks/by-employee'),
  deleteTask: (taskId: number) => api.delete(`/tasks/${taskId}`),
  getMyTasks: () => api.get('/tasks/my-tasks'),
  getMyTaskCounts: () => api.get('/tasks/my-task-counts'),
  acceptTask: (taskId: number) => api.put(`/tasks/${taskId}/accept`),
  completeTask: (taskId: number) => api.put(`/tasks/${taskId}/complete`),
  failTask: (taskId: number) => api.put(`/tasks/${taskId}/fail`),
};

// Invitation API
export const invitationAPI = {
  sendInvitation: (employeeId: number) => api.post('/invitations/send', { employeeId }),
  respondToInvitation: (id: number, status: string) => api.put(`/invitations/respond/${id}`, { status }),
  getMyInvitations: () => api.get('/invitations/my-invitations'),
  getTeamMembers: () => api.get('/invitations/team'),
  getAvailableEmployees: () => api.get('/invitations/available-employees'),
  getPendingInvitations: () => api.get('/invitations/pending'),
};

export default api;
