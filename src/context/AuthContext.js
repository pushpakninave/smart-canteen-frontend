// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      console.log("AuthContext: User found in localStorage:", user);
    } else {
      console.log("AuthContext: No user found in localStorage.");
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const userData = await AuthService.login(username, password);
      setCurrentUser(userData);
      setIsAuthenticated(true);
      console.log("AuthContext: Login successful, currentUser set:", userData);
      return userData;
    } catch (error) {
      setCurrentUser(null);
      setIsAuthenticated(false);
      console.error("AuthContext: Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await AuthService.register(username, email, password);
      console.log("AuthContext: Registration successful:", response);
      return response;
    } catch (error) {
      console.error("AuthContext: Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    console.log("AuthContext: User logged out.");
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register, // ✅ Add this line
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
