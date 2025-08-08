// src/pages/DonatedFoodItems.jsx

import React, { useState, useEffect } from 'react';
import FoodService from '../api/food';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

function DonatedFoodItems() {
  const [donatedItems, setDonatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const { addNotification } = useNotifications();

  const isNgo = currentUser && currentUser.role === 'ROLE_NGO';

  useEffect(() => {
    if (!authLoading && isAuthenticated && isNgo) {
      console.log("DonatedFoodItems: Authenticated as NGO, fetching donated food items...");
      fetchDonatedItems();
    } else if (!authLoading && (!isAuthenticated || !isNgo)) {
      console.log("DonatedFoodItems: Not authenticated as NGO or incorrect role.");
      setError("Access Denied. You must be logged in as an NGO to view donated food items.");
      setLoading(false);
    } else {
      console.log("DonatedFoodItems: Auth still loading...");
    }
  }, [isAuthenticated, authLoading, isNgo, currentUser]);

  const fetchDonatedItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await FoodService.getDonatedFoodItems();
      setDonatedItems(response.data);
      console.log("DonatedFoodItems: Fetched donated data:", response.data);
    } catch (err) {
      console.error('DonatedFoodItems: Failed to fetch donated food items:', err);
      setError('Failed to load donated food items. Please try again later.');
      if (err.response) {
        if (err.response.status === 403) {
          setError('Access Denied. You do not have permission to view these items.');
        } else if (err.response.data && err.response.data.message) {
          setError(`Error: ${err.response.data.message}`);
        }
      }
      addNotification('Failed to load donated food items.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles marking a donated food item as received by the NGO.
   * @param {number} id - The ID of the food item to mark as received.
   * @param {string} name - The name of the food item for notifications.
   */
  const handleMarkAsReceived = async (id, name) => { // <<< NEW FUNCTION
    if (!window.confirm(`Are you sure you want to mark "${name}" as received?`)) {
      return;
    }
    try {
      await FoodService.markDonatedItemAsReceived(id);
      addNotification(`Food item "${name}" (ID: ${id}) marked as received.`);
      fetchDonatedItems(); // Refresh the list to show updated status
    } catch (err) {
      console.error('Error marking item as received:', err);
      setError('Failed to mark item as received. ' + (err.response?.data?.message || err.message));
      addNotification(`Failed to mark "${name}" as received.`);
    }
  };

  if (authLoading) {
    return <div className="loading-message">Authenticating user...</div>;
  }

  if (loading) {
    return <div className="loading-message">Loading donated food items...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!isAuthenticated || !isNgo) {
    return <div className="error-message">Access Denied. You must be logged in as an NGO to view this page.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Donated Food Items for NGOs</h2>

      {donatedItems.length === 0 ? (
        <p className="no-items-message">No food items have been donated yet.</p>
      ) : (
        <div className="food-items-grid">
          {donatedItems.map((item) => (
            <div key={item.id} className="food-item-card">
              <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
              <p className="text-gray-700">Description: {item.description}</p>
              <p className="text-gray-700">Price: ₹{item.price.toFixed(2)}</p>
              {item.donatedAt && (
                <p className="text-gray-700 text-sm">
                  Donated At: {new Date(item.donatedAt).toLocaleString()}
                </p>
              )}
              {item.receivedByNgoAt && ( // <<< NEW: Display receivedByNgoAt timestamp if available
                <p className="text-gray-700 text-sm">
                  Received by NGO At: {new Date(item.receivedByNgoAt).toLocaleString()}
                </p>
              )}
              <div className="mt-4">
                {/* Show "Mark as Received" button only if not already received */}
                {!item.receivedByNgoAt ? ( // <<< CONDITIONAL RENDERING
                  <button
                    onClick={() => handleMarkAsReceived(item.id, item.name)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Mark as Received (NGO Action)
                  </button>
                ) : (
                  <span className="text-green-600 font-semibold">Item Received!</span> // <<< Display status once received
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DonatedFoodItems;