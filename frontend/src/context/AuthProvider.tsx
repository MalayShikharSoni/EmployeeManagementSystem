// frontend/src/context/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { authAPI } from "../services/api";
import type { UserData, AuthResult } from "../types";

export interface AuthContextType {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string, firstName: string, role: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Memoize checkAuth so it doesn't change on every render
  const checkAuth = useCallback(async () => {
    console.log('[AUTH] Starting auth check...');
    console.log('[AUTH] Current timestamp:', new Date().toISOString());

    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    console.log('[AUTH] Tokens in localStorage:', {
      hasAccessToken: !!token,
      hasRefreshToken: !!refreshToken,
      accessTokenPreview: token ? token.substring(0, 30) + '...' : 'null'
    });

    if (!token) {
      console.log('[AUTH] No access token found - setting unauthenticated');
      setIsLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      console.log('[AUTH] Calling GET /api/auth/me...');
      const response = await authAPI.getMe();
      const user = response.data.data;

      console.log('[AUTH] Success! User:', {
        id: user.id,
        email: user.email,
        role: user.role
      });

      setUserData({
        role: user.role,
        data: user
      });
      setIsAuthenticated(true);
      console.log('[AUTH] State updated - user is authenticated');
    } catch (error: unknown) {
      console.error('[AUTH] Auth check failed!');
      const err = error as { constructor?: { name?: string }; message?: string; response?: { status?: number; data?: unknown } };
      console.error('[AUTH] Error type:', err.constructor?.name);
      console.error('[AUTH] Error message:', err.message);
      console.error('[AUTH] Response status:', err.response?.status);
      console.error('[AUTH] Response data:', err.response?.data);
      console.error('[AUTH] Full error:', error);

      // Only clear on 401 (invalid token)
      if (err.response?.status === 401) {
        console.log('[AUTH] 401 error - token invalid, clearing localStorage');
        localStorage.clear();
        setUserData(null);
        setIsAuthenticated(false);
      } else {
        console.log('[AUTH] Non-401 error - keeping tokens but setting unauthenticated');
        // Don't clear tokens, but mark as unauthenticated so UI shows login
        setUserData(null);
        setIsAuthenticated(false);
      }
    } finally {
      console.log('[AUTH] Auth check complete, setting isLoading = false');
      setIsLoading(false);
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Memoize login
  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
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
      const err = error as { response?: { data?: { error?: string } } };
      return {
        success: false,
        error: err.response?.data?.error || 'Login failed. Please try again.'
      };
    }
  }, []);

  // Memoize register
  const register = useCallback(async (email: string, password: string, firstName: string, role: string): Promise<AuthResult> => {
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
      const err = error as { response?: { data?: { error?: string } } };
      return {
        success: false,
        error: err.response?.data?.error || 'Registration failed. Please try again.'
      };
    }
  }, []);

  // Memoize logout
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

  // Memoize the entire context value
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
