import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { APIResponse, User, Task, TaskCounts, GroupedEmployeeTasks, Employee, Invitation, PendingInvitation, TeamMember } from '../types';

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
  (config: InternalAxiosRequestConfig) => {
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

    // Don't intercept 401s from login/register — those are expected (wrong credentials)
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
  register: (data: { email: string; password: string; firstName: string; role: string }): Promise<AxiosResponse<APIResponse<{ user: User; accessToken: string; refreshToken: string }>>> =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }): Promise<AxiosResponse<APIResponse<{ user: User; accessToken: string; refreshToken: string }>>> =>
    api.post('/auth/login', data),
  getMe: (): Promise<AxiosResponse<APIResponse<User>>> =>
    api.get('/auth/me'),
  getEmployees: (): Promise<AxiosResponse<APIResponse<Employee[]>>> =>
    api.get('/auth/employees'),
  logout: async (): Promise<void> => {
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
  // Admin endpoints
  createTask: (data: { title: string; description: string; category: string; dueDate: string; priority?: string; assignedTo: number }): Promise<AxiosResponse<APIResponse<Task>>> =>
    api.post('/tasks', data),
  getAllTasks: (): Promise<AxiosResponse<APIResponse<Task[]>>> =>
    api.get('/tasks/all'),
  getTasksByEmployee: (): Promise<AxiosResponse<APIResponse<GroupedEmployeeTasks[]>>> =>
    api.get('/tasks/by-employee'),
  deleteTask: (taskId: number | string): Promise<AxiosResponse<APIResponse<Task>>> =>
    api.delete(`/tasks/${taskId}`),

  // Employee endpoints
  getMyTasks: (): Promise<AxiosResponse<APIResponse<Task[]>>> =>
    api.get('/tasks/my-tasks'),
  getMyTaskCounts: (): Promise<AxiosResponse<APIResponse<TaskCounts>>> =>
    api.get('/tasks/my-task-counts'),
  acceptTask: (taskId: number | string): Promise<AxiosResponse<APIResponse<Task>>> =>
    api.put(`/tasks/${taskId}/accept`),
  completeTask: (taskId: number | string): Promise<AxiosResponse<APIResponse<Task>>> =>
    api.put(`/tasks/${taskId}/complete`),
  failTask: (taskId: number | string): Promise<AxiosResponse<APIResponse<Task>>> =>
    api.put(`/tasks/${taskId}/fail`),
};

// Invitation API
export const invitationAPI = {
  sendInvitation: (employeeId: number): Promise<AxiosResponse<APIResponse<Invitation>>> =>
    api.post('/invitations/send', { employeeId }),
  respondToInvitation: (id: number, status: string): Promise<AxiosResponse<APIResponse<Invitation>>> =>
    api.put(`/invitations/respond/${id}`, { status }),
  getMyInvitations: (): Promise<AxiosResponse<APIResponse<Invitation[]>>> =>
    api.get('/invitations/my-invitations'),
  getTeamMembers: (): Promise<AxiosResponse<APIResponse<TeamMember[]>>> =>
    api.get('/invitations/team'),
  getAvailableEmployees: (): Promise<AxiosResponse<APIResponse<Employee[]>>> =>
    api.get('/invitations/available-employees'),
  getPendingInvitations: (): Promise<AxiosResponse<APIResponse<PendingInvitation[]>>> =>
    api.get('/invitations/pending'),
};



export default api;
