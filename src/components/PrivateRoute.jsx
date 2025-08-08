// src/components/PrivateRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, currentUser, loading } = useAuth();

  if (loading) {
    // Still checking authentication status, render a loading indicator
    return <div className="loading-message">Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    // Not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && currentUser) {
    // Check if the user's role is among the allowed roles
    if (!allowedRoles.includes(currentUser.role)) {
      // Role not allowed, redirect to home or an unauthorized page
      return <Navigate to="/home" replace />; // Or a specific /unauthorized page
    }
  }

  // If authenticated and role is allowed (or no specific roles required), render children
  return children;
};

export default PrivateRoute;