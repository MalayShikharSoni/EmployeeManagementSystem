'use client';

import React, { createContext, useEffect, useState, useMemo, useCallback, ReactNode } from "react";
import { authAPI } from "@/services/api";

interface User {
  id: number;
  email: string;
  first_name: string;
  role: 'admin' | 'employee';
  created_at?: string;
}

interface UserData {
  role: 'admin' | 'employee';
  data: User;
}

interface AuthContextType {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (email: string, password: string, firstName: string, role: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setIsLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await authAPI.getMe();
      const user = response.data.data;

      setUserData({
        role: user.role,
        data: user
      });
      setIsAuthenticated(true);
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        localStorage.clear();
        setUserData(null);
        setIsAuthenticated(false);
      } else {
        setUserData(null);
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user, accessToken, refreshToken } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      setUserData({
        role: user.role,
        data: user
      });
      setIsAuthenticated(true);

      return { success: true, user };
    } catch (error: unknown) {
      console.error('Login failed:', error);
      const axiosError = error as { response?: { data?: { error?: string } } };
      return {
        success: false,
        error: axiosError.response?.data?.error || 'Login failed. Please try again.'
      };
    }
  }, []);

  const register = useCallback(async (email: string, password: string, firstName: string, role: string) => {
    try {
      const response = await authAPI.register({ email, password, firstName, role });
      const { user, accessToken, refreshToken } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      setUserData({
        role: user.role,
        data: user
      });
      setIsAuthenticated(true);

      return { success: true, user };
    } catch (error: unknown) {
      console.error('Registration failed:', error);
      const axiosError = error as { response?: { data?: { error?: string } } };
      return {
        success: false,
        error: axiosError.response?.data?.error || 'Registration failed. Please try again.'
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUserData(null);
      setIsAuthenticated(false);
      localStorage.clear();
    }
  }, []);

  const value = useMemo(() => ({
    userData,
    setUserData,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth
  }), [userData, isLoading, isAuthenticated, login, register, logout, checkAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
