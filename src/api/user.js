// src/api/user.js

import axios from 'axios';
import AuthService from './auth'; // To get the authorization header

// Base URL for your Spring Boot backend user management endpoints
const API_URL = 'http://localhost:8080/api/users/';

class UserService {
  /**
   * Fetches all users (for Admin).
   * @returns {Promise<Array>} A promise that resolves with an array of user objects.
   */
  async getAllUsers() {
    const response = await axios.get(
      API_URL + 'all', // Corresponds to @GetMapping("/all") in UserController
      { headers: AuthService.getAuthHeader() }
    );
    return response; // axios returns the response object, data is in response.data
  }

  /**
   * Fetches a specific user by ID (for Admin).
   * @param {number} userId - The ID of the user to fetch.
   * @returns {Promise<Object>} A promise that resolves with the specific user object.
   */
  async getUserById(userId) {
    const response = await axios.get(
      API_URL + userId, // Corresponds to @GetMapping("/{userId}") in UserController
      { headers: AuthService.getAuthHeader() }
    );
    return response;
  }

  /**
   * Updates a user's role (for Admin).
   * @param {number} userId - The ID of the user to update.
   * @param {string} newRole - The new role name (e.g., "STUDENT", "CANTEEN_MANAGER", "ADMIN").
   * @returns {Promise<Object>} A promise that resolves with the updated user object.
   */
  async updateUserRole(userId, newRole) {
    const response = await axios.put(
      API_URL + userId + '/role', // Corresponds to @PutMapping("/{userId}/role")
      {}, // PUT request body might be empty
      {
        params: { newRole: newRole }, // Send newRole as a query parameter
        headers: AuthService.getAuthHeader()
      }
    );
    return response;
  }

  /**
   * Deletes a user (for Admin).
   * @param {number} userId - The ID of the user to delete.
   * @returns {Promise<void>} A promise that resolves on successful deletion.
   */
  async deleteUser(userId) {
    const response = await axios.delete(
      API_URL + userId, // Corresponds to @DeleteMapping("/{userId}")
      { headers: AuthService.getAuthHeader() }
    );
    return response;
  }
}

export default new UserService();