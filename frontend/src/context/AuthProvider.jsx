// frontend/src/context/AuthProvider.jsx
import React, { createContext, useEffect, useState } from "react";
import { authAPI } from "../services/api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      setIsLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      // Verify token with backend
      const response = await authAPI.getMe();
      const user = response.data.data;
      
      setUserData({
        role: user.role,
        data: user
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      // Token is invalid, clear everything
      localStorage.clear();
      setUserData(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user, accessToken, refreshToken } = response.data.data;

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Update state
      setUserData({
        role: user.role,
        data: user
      });
      setIsAuthenticated(true);

      return { success: true, user };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please try again.'
      };
    }
  };

  const register = async (email, password, firstName) => {
    try {
      const response = await authAPI.register({ email, password, firstName });
      const { user, accessToken, refreshToken } = response.data.data;

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Update state
      setUserData({
        role: user.role,
        data: user
      });
      setIsAuthenticated(true);

      return { success: true, user };
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed. Please try again.'
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state
      setUserData(null);
      setIsAuthenticated(false);
      localStorage.clear();
    }
  };

  const value = {
    userData,
    setUserData,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
