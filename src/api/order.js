// src/api/order.js

import axios from 'axios';
import AuthService from './auth'; // To get the authorization header

// Base URL for your Spring Boot backend order endpoints
const API_URL = 'http://localhost:8080/api/orders/';

class OrderService {
  // We'll modify methods to accept an optional addNotification callback
  // This is a common pattern when a service needs to interact with a context
  // but cannot directly use a hook.

  /**
   * Places a new order.
   * @param {Array<Object>} orderItems - An array of objects like { foodItemId: number, quantity: number }.
   * @param {function} addNotificationCallback - Callback to add a notification.
   * @returns {Promise<Object>} A promise that resolves with the created order details.
   */
  async placeOrder(orderItems, addNotificationCallback) {
    const response = await axios.post(
      API_URL + 'place', // Corresponds to @PostMapping("/place") in OrderController
      { items: orderItems }, // Backend expects an object with an 'items' array
      { headers: AuthService.getAuthHeader() } // Include JWT token
    );

    if (response.data && addNotificationCallback) {
      const orderId = response.data.id;
      const status = response.data.status.replace(/_/g, ' ');
      addNotificationCallback(`Your order (ID: ${orderId}) has been placed and is ${status}.`);
    }
    return response;
  }

  /**
   * Fetches all orders for the currently authenticated student.
   * @returns {Promise<Array>} A promise that resolves with an array of order objects.
   */
  async getMyOrders() {
    return axios.get(
      API_URL + 'my', // Corresponds to @GetMapping("/my") in OrderController
      { headers: AuthService.getAuthHeader() } // Include JWT token
    );
  }

  /**
   * Fetches a specific order by ID for the currently authenticated student.
   * @param {number} orderId - The ID of the order to fetch.
   * @returns {Promise<Object>} A promise that resolves with the specific order object.
   */
  async getMyOrderById(orderId) {
    return axios.get(
      API_URL + 'my/' + orderId, // Corresponds to @GetMapping("/my/{orderId}")
      { headers: AuthService.getAuthHeader() } // Include JWT token
    );
  }

  /**
   * Cancels a specific order for the currently authenticated student.
   * @param {number} orderId - The ID of the order to cancel.
   * @param {function} addNotificationCallback - Callback to add a notification.
   * @returns {Promise<void>} A promise that resolves on successful cancellation.
   */
  async cancelMyOrder(orderId, addNotificationCallback) {
    const response = await axios.put(
      API_URL + 'my/cancel/' + orderId, // Corresponds to @PutMapping("/my/cancel/{orderId}")
      {}, // PUT request for cancellation might not need a body, but send empty object if required
      { headers: AuthService.getAuthHeader() } // Include JWT token
    );
    if (addNotificationCallback) {
      addNotificationCallback(`Order (ID: ${orderId}) has been cancelled.`);
    }
    return response;
  }

  // --- Manager/Admin specific order functions ---

  /**
   * Fetches all orders (for Canteen Manager/Admin).
   * @returns {Promise<Array>} A promise that resolves with an array of all order objects.
   */
  async getAllOrders() {
    return axios.get(
      API_URL + 'all', // Corresponds to @GetMapping("/all") in OrderController
      { headers: AuthService.getAuthHeader() } // Include JWT token
    );
  }

  /**
   * Fetches a specific order by ID (for Canteen Manager/Admin).
   * @param {number} orderId - The ID of the order to retrieve.
   * @returns {Promise<Object>} A promise that resolves with the specific order object.
   */
  async getOrderById(orderId) {
    return axios.get(
      API_URL + 'details/' + orderId, // Corresponds to @GetMapping("/details/{orderId}")
      { headers: AuthService.getAuthHeader() }
    );
  }

  /**
   * Updates the status of an order (for Canteen Manager).
   * @param {number} orderId - The ID of the order to update.
   * @param {string} newStatus - The new status (e.g., "PREPARING", "READY_FOR_PICKUP").
   * @param {function} addNotificationCallback - Callback to add a notification.
   * @returns {Promise<Object>} A promise that resolves with the updated order object.
   */
  async updateOrderStatus(orderId, newStatus, addNotificationCallback) {
    const response = await axios.put(
      API_URL + orderId + '/status', // Corresponds to @PutMapping("/{orderId}/status")
      {}, // No request body needed for status update via query param
      {
        params: { newStatus: newStatus }, // Send status as query parameter
        headers: AuthService.getAuthHeader()
      }
    );
    if (response.data && addNotificationCallback) {
      addNotificationCallback(`Order (ID: ${orderId}) status updated to ${response.data.status.replace(/_/g, ' ')}.`);
    }
    return response;
  }

  /**
   * Cancels an order by manager.
   * @param {number} orderId - The ID of the order to cancel.
   * @param {function} addNotificationCallback - Callback to add a notification.
   * @returns {Promise<void>} A promise that resolves on successful cancellation.
   */
  async cancelOrderByManager(orderId, addNotificationCallback) {
    const response = await axios.put(
      API_URL + 'cancel/' + orderId, // Corresponds to @PutMapping("/cancel/{orderId}")
      {},
      { headers: AuthService.getAuthHeader() }
    );
    if (addNotificationCallback) {
      addNotificationCallback(`Order (ID: ${orderId}) has been cancelled by manager.`);
    }
    return response;
  }
}

export default new OrderService();
