// src/api/auth.js

import axios from 'axios';

// Base URL for your Spring Boot backend authentication endpoints
const API_URL = 'http://localhost:8080/api/auth/';
const FOOD_API_URL = 'http://localhost:8080/api/food/'; // Added for food API

class AuthService {
  /**
   * Handles user login.
   * @param {string} username - The user's username.
   * @param {string} password - The user's password.
   * @returns {Promise<Object>} A promise that resolves with user data (token, roles, etc.) on success.
   */
  async login(username, password) {
    const response = await axios.post(API_URL + 'login', {
      username,
      password,
    });

    // If login is successful and token is received, store it in local storage
    if (response.data.token) {
      const userData = { ...response.data };
      // <<< CRITICAL FIX: Ensure role has 'ROLE_' prefix before storing >>>
      // The backend sends 'NGO', 'STUDENT', 'CANTEEN_MANAGER', 'ADMIN'
      // The frontend expects 'ROLE_NGO', 'ROLE_STUDENT', etc.
      if (userData.role && !userData.role.startsWith('ROLE_')) {
        userData.role = `ROLE_${userData.role.toUpperCase()}`;
      }
      localStorage.setItem('user', JSON.stringify(userData));
      console.log("AuthService: Data stored in localStorage (with ROLE_ prefix):", userData); // Diagnostic log
    } else {
      console.log("AuthService: Login response did not contain a token:", response.data);
    }
    console.log("AuthService: Returning response.data:", response.data);
    return response.data;
  }

  /**
   * Handles user logout.
   * Removes user data from local storage.
   */
  logout() {
    localStorage.removeItem('user');
  }

  /**
   * Handles user registration.
   * @param {string} username - The desired username.
   * @param {string} email - The user's email.
   * @param {string} password - The desired password.
   * @param {string} role - The role to assign (e.g., "student", "manager", "admin").
   * @returns {Promise<Object>} A promise that resolves with a success message on success.
   */
  register(username, email, password, role) {
    return axios.post(API_URL + 'register', {
      username,
      email,
      password,
      role, // Pass the role from the frontend
    });
  }

  /**
   * Retrieves the current user data from local storage.
   * @returns {Object | null} The user object if found, otherwise null.
   */
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Gets the authorization header for authenticated requests.
   * @returns {Object} An object with the Authorization header, or an empty object if no token.
   */
  getAuthHeader() {
    const user = this.getCurrentUser();
    if (user && user.token) {
      return { Authorization: 'Bearer ' + user.token };
    } else {
      return {};
    }
  }

  /**
   * Fetches available food items.
   * @returns {Promise<Array>} A promise that resolves with an array of food items.
   */
  getAvailableFoodItems() {
    return axios.get(FOOD_API_URL + 'available', { headers: this.getAuthHeader() });
  }
}

export default new AuthService();