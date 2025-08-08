// src/api/food.js

import axios from 'axios';
import AuthService from './auth'; // To get the auth header

const API_URL = 'http://localhost:8080/api/food/';

class FoodService {
  /**
   * Fetches all food items from the backend.
   * Accessible by Canteen Manager or Admin.
   * @returns {Promise<AxiosResponse<Array>>} A promise that resolves with the list of food items.
   */
  getAllFoodItems() {
    console.log("FoodService: Calling /api/food/all with headers:", AuthService.getAuthHeader());
    return axios.get(API_URL + 'all', { headers: AuthService.getAuthHeader() });
  }

  /**
   * Fetches only available food items from the backend.
   * Accessible by Student, Canteen Manager, or Admin.
   * @returns {Promise<AxiosResponse<Array>>} A promise that resolves with the list of available food items.
   */
  getAvailableFoodItems() {
    console.log("FoodService: Calling /api/food/available with headers:", AuthService.getAuthHeader());
    return axios.get(API_URL + 'available', { headers: AuthService.getAuthHeader() });
  }

  /**
   * Adds a new food item.
   * Accessible by Canteen Manager.
   * @param {Object} foodItemData - The data for the new food item.
   * @returns {Promise<AxiosResponse<Object>>} A promise that resolves with the created food item.
   */
  addFoodItem(foodItemData) {
    return axios.post(API_URL + 'add', foodItemData, { headers: AuthService.getAuthHeader() });
  }

  /**
   * Updates an existing food item.
   * Accessible by Canteen Manager.
   * @param {number} id - The ID of the food item to update.
   * @param {Object} foodItemData - The updated data for the food item.
   * @returns {Promise<AxiosResponse<Object>>} A promise that resolves with the updated food item.
   */
  updateFoodItem(id, foodItemData) {
    return axios.put(API_URL + id, foodItemData, { headers: AuthService.getAuthHeader() });
  }

  /**
   * Deletes a food item.
   * Accessible by Canteen Manager.
   * @param {number} id - The ID of the food item to delete.
   * @returns {Promise<AxiosResponse<void>>} A promise that resolves on successful deletion.
   */
  deleteFoodItem(id) {
    return axios.delete(API_URL + id, { headers: AuthService.getAuthHeader() });
  }

  /**
   * Toggles the availability of a food item.
   * Accessible by Canteen Manager.
   * @param {number} id - The ID of the food item to toggle.
   * @param {boolean} isAvailable - The new availability status.
   * @returns {Promise<AxiosResponse<Object>>} A promise that resolves with the updated food item.
   */
  toggleFoodAvailability(id, isAvailable) {
    return axios.put(API_URL + id + '/toggle-availability', isAvailable, {
      headers: {
        'Content-Type': 'application/json',
        ...AuthService.getAuthHeader()
      }
    });
  }

  /**
   * Marks a food item as donated to an NGO.
   * Accessible by Canteen Manager.
   * @param {number} id - The ID of the food item to donate.
   * @returns {Promise<AxiosResponse<Object>>} A promise that resolves with the updated food item.
   */
  donateFoodItem(id) {
    console.log(`FoodService: Calling /api/food/${id}/donate`);
    return axios.put(API_URL + id + '/donate', {}, { headers: AuthService.getAuthHeader() });
  }

  /**
   * Fetches all food items that have been marked as donated.
   * Accessible by NGO role.
   * @returns {Promise<AxiosResponse<Array>>} A promise that resolves with the list of donated food items.
   */
  getDonatedFoodItems() {
    console.log("FoodService: Calling /api/food/donated with headers:", AuthService.getAuthHeader());
    return axios.get(API_URL + 'donated', { headers: AuthService.getAuthHeader() });
  }

  /**
   * Marks a donated food item as received by the NGO.
   * Accessible by NGO role.
   * @param {number} id - The ID of the food item to mark as received.
   * @returns {Promise<AxiosResponse<Object>>} A promise that resolves with the updated food item.
   */
  markDonatedItemAsReceived(id) { // <<< NEW METHOD for NGO reception
    console.log(`FoodService: Calling /api/food/${id}/mark-received`);
    return axios.put(API_URL + id + '/mark-received', {}, { headers: AuthService.getAuthHeader() }); // Empty body for PUT
  }
}

export default new FoodService();