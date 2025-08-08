// src/api/payment.js

import axios from 'axios';
import AuthService from './auth'; // To get the authorization header

// Base URL for your Spring Boot backend payment endpoints
const API_URL = 'http://localhost:8080/api/payments/'; // Matches your PaymentController @RequestMapping

class PaymentService {
  /**
   * Processes a new payment for an order.
   * @param {Object} paymentRequest - The DTO containing orderId, amount, and paymentMethod.
   * @returns {Promise<Object>} A promise that resolves with the created PaymentResponse DTO.
   */
  async processPayment(paymentRequest) { // <<< CRITICAL: This method must be here
    const response = await axios.post(
      API_URL + 'process', // Corresponds to @PostMapping("/process") in PaymentController
      paymentRequest,
      { headers: AuthService.getAuthHeader() }
    );
    return response;
  }

  /**
   * Fetches all payments for the currently authenticated student from the backend.
   * @returns {Promise<Array>} A promise that resolves with an array of payment objects.
   */
  async getMyPayments() {
    const response = await axios.get(
      API_URL + 'my', // Corresponds to @GetMapping("/my") in PaymentController
      { headers: AuthService.getAuthHeader() }
    );
    return response;
  }

  /**
   * Fetches a specific payment by ID for the currently authenticated student.
   * @param {number} paymentId - The ID of the payment to fetch.
   * @returns {Promise<Object>} A promise that resolves with the specific payment object.
   */
  async getMyPaymentById(paymentId) {
    const response = await axios.get(
      API_URL + 'my/' + paymentId, // Corresponds to @GetMapping("/my/{paymentId}")
      { headers: AuthService.getAuthHeader() }
    );
    return response;
  }

  /**
   * Fetches all payments (for Canteen Manager/Admin).
   * @returns {Promise<Array>} A promise that resolves with an array of all payment objects.
   */
  async getAllPayments() {
    const response = await axios.get(
      API_URL + 'all', // Corresponds to @GetMapping("/all") in PaymentController
      { headers: AuthService.getAuthHeader() }
    );
    return response;
  }

  /**
   * Updates the status of a payment (for Canteen Manager).
   * @param {number} paymentId - The ID of the payment to update.
   * @param {string} newStatus - The new status (e.g., "COMPLETED", "REFUNDED").
   * @returns {Promise<Object>} A promise that resolves with the updated payment object.
   */
  async updatePaymentStatus(paymentId, newStatus) {
    const response = await axios.put(
      API_URL + paymentId + '/status', // Corresponds to @PutMapping("/{paymentId}/status")
      {}, // No request body needed for status update via query param
      {
        params: { newStatus: newStatus }, // Send status as query parameter
        headers: AuthService.getAuthHeader()
      }
    );
    return response;
  }
}

export default new PaymentService();
