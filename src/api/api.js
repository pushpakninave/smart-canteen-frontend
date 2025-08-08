// src/api/api.js

import axios from 'axios';
import AuthService from './auth'; // Import your AuthService to get the token

// Base URL for your Spring Boot backend's *authenticated* API endpoints
// This should be the root of your API, e.g., 'http://localhost:8080/api/'
const API_BASE_URL = 'http://localhost:8080/api/';

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add JWT token to headers before each request
api.interceptors.request.use(
  (config) => {
    const user = AuthService.getCurrentUser(); // Get current user from local storage
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle token expiration or invalid tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 Unauthorized and it's not the login request itself
    // and we haven't already retried this request
    if (error.response.status === 401 && originalRequest.url !== API_BASE_URL + 'auth/login') {
      // You might want to implement token refresh logic here if your backend supports it
      // For now, we'll just log out the user if the token is invalid/expired
      console.warn('Unauthorized request. Logging out user.');
      AuthService.logout();
      // Optionally, redirect to login page
      window.location.href = '/login'; // Force reload and redirect
    }
    return Promise.reject(error);
  }
);

export default api; // <--- THIS LINE IS CRUCIAL FOR THE DEFAULT EXPORT