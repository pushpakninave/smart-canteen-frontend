// src/pages/FoodItems.jsx

import React, { useState, useEffect } from 'react';
import FoodService from '../api/food';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useCart } from '../context/CartContext';

function FoodItems() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingFoodItem, setEditingFoodItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const { addNotification } = useNotifications();
  const { addToCart } = useCart();

  const isManager = currentUser && currentUser.role === 'ROLE_CANTEEN_MANAGER';
  const isStudent = currentUser && currentUser.role === 'ROLE_STUDENT';

  useEffect(() => {
    console.log("FoodItems: Component mounted/updated.");
    console.log("FoodItems: Current User:", currentUser);
    console.log("FoodItems: Is Authenticated:", isAuthenticated);
    console.log("FoodItems: Auth Loading:", authLoading);
    console.log("FoodItems: Is Manager:", isManager);
    console.log("FoodItems: Is Student:", isStudent);

    if (!authLoading && isAuthenticated) {
      console.log("FoodItems: Authenticated, fetching food items...");
      fetchFoodItems();
    } else if (!authLoading && !isAuthenticated) {
      console.log("FoodItems: Not authenticated, cannot fetch food items.");
      setError("Please log in to view food items.");
      setLoading(false);
    } else {
      console.log("FoodItems: Auth still loading...");
    }
  }, [isAuthenticated, authLoading, currentUser, isManager, isStudent]);

  const fetchFoodItems = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (isManager) {
        console.log("FoodItems: Fetching ALL food items for manager.");
        response = await FoodService.getAllFoodItems();
      } else if (isStudent) {
        console.log("FoodItems: Fetching AVAILABLE food items for student.");
        response = await FoodService.getAvailableFoodItems();
      } else {
        console.log("FoodItems: User role not recognized for fetching food items. Displaying no items.");
        setFoodItems([]);
        setLoading(false);
        return;
      }
      console.log("FoodItems: Fetched data:", response.data);
      setFoodItems(response.data);
    } catch (err) {
      console.error('FoodItems: Failed to fetch food items:', err);
      setError('Failed to load food items. Please try again later.');
      if (err.response) {
        console.error('FoodItems: Backend response error:', err.response);
        if (err.response.status === 403) {
          setError('Access Denied. You do not have permission to view these items.');
        } else if (err.response.data && err.response.data.message) {
          setError(`Error: ${err.response.data.message}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (foodItem) => {
    setEditingFoodItem(foodItem);
    setIsAddingNew(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) {
      return;
    }
    try {
      await FoodService.deleteFoodItem(id);
      addNotification(`Food item with ID ${id} deleted successfully.`);
      fetchFoodItems();
    } catch (err) {
      console.error('Error deleting food item:', err);
      setError('Failed to delete food item. ' + (err.response?.data?.message || err.message));
      addNotification(`Failed to delete food item with ID ${id}.`);
    }
  };

  const handleToggleAvailability = async (id, currentAvailability) => {
    try {
      await FoodService.toggleFoodAvailability(id, !currentAvailability);
      addNotification(`Food item availability for ID ${id} toggled successfully.`);
      fetchFoodItems();
    } catch (err) {
      console.error('Error toggling availability:', err);
      setError('Failed to toggle food item availability. ' + (err.response?.data?.message || err.message));
      addNotification(`Failed to toggle availability for ID ${id}.`);
    }
  };

  const handleSave = async (foodItemData) => {
    try {
      if (editingFoodItem) {
        await FoodService.updateFoodItem(editingFoodItem.id, foodItemData);
        addNotification(`Food item "${foodItemData.name}" updated successfully.`);
      } else {
        await FoodService.addFoodItem(foodItemData);
        addNotification(`Food item "${foodItemData.name}" added successfully.`);
      }
      setEditingFoodItem(null);
      setIsAddingNew(false);
      fetchFoodItems();
    } catch (err) {
      console.error('Error saving food item:', err);
      setError('Failed to save food item. ' + (err.response?.data?.message || err.message));
      addNotification(`Failed to save food item "${foodItemData.name}".`);
    }
  };

  const handleDonateToNgo = async (id, name) => {
    if (!window.confirm(`Are you sure you want to mark "${name}" as donated to NGO? This will make it unavailable.`)) {
      return;
    }
    try {
      await FoodService.donateFoodItem(id);
      addNotification(`Food item "${name}" (ID: ${id}) marked as donated to NGO.`);
      fetchFoodItems();
    } catch (err) {
      console.error('Error donating food item:', err);
      setError('Failed to mark food item as donated. ' + (err.response?.data?.message || err.message));
      addNotification(`Failed to donate food item "${name}".`);
    }
  };

  const handleAddToCart = (item) => {
    console.log("FoodItems: 'Add to Cart' button clicked for item:", item);
    addToCart(item);
    addNotification(`${item.name} added to cart!`);
  };

  const handleCancelEdit = () => {
    setEditingFoodItem(null);
    setIsAddingNew(false);
  };

  if (authLoading) {
    return <div className="loading-message">Authenticating user...</div>;
  }

  if (loading) {
    return <div className="loading-message">Loading food items...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!isAuthenticated || !currentUser) {
    return <div className="error-message">Access Denied. Please log in.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {isManager ? 'Manage Food Items' : 'Available Food Items'}
      </h2>

      {isManager && (
        <button
          onClick={() => setIsAddingNew(true)}
          className="add-food-button"
        >
          Add New Food Item
        </button>
      )}

      {(isAddingNew || editingFoodItem) && (
        <FoodItemForm
          foodItem={editingFoodItem}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      )}

      {foodItems.length === 0 ? (
        <p className="no-items-message">No food items found.</p>
      ) : (
        <div className="food-items-grid">
          {foodItems.map((item) => {
            console.log(`FoodItems: Item '${item.name}' (ID: ${item.id}) - availableToday: ${item.availableToday}, donatedAt: ${item.donatedAt}`);
            return (
              <div key={item.id} className="food-item-card">
                <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                <p className="text-gray-700">Price: ₹{item.price.toFixed(2)}</p>
                <p className="text-gray-700">Description: {item.description}</p>
                {isManager && (
                  <>
                    <p className="text-gray-700">
                      Availability:{' '}
                      <span className={`availability-status ${item.availableToday ? 'available' : 'not-available'}`}>
                        {item.availableToday ? 'Available' : 'Not Available'}
                      </span>
                    </p>
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
                  </>
                )}
                <div className="mt-4 flex space-x-2">
                  {isManager && (
                    <>
                      {/* Show Edit and Delete always for managers */}
                      <button
                        onClick={() => handleEdit(item)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>

                      {/* Toggle Availability button: Only show if NOT already donated */}
                      {!item.donatedAt && (
                        <button
                          onClick={() => handleToggleAvailability(item.id, item.availableToday)}
                          className="toggle-button"
                        >
                          {item.availableToday ? 'Mark Unavailable' : 'Mark Available'}
                        </button>
                      )}

                      {!item.donatedAt && ( // <<< MODIFIED: Condition to show Donate button
                        <button
                          onClick={() => handleDonateToNgo(item.id, item.name)}
                          className="donate-button bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                        >
                          Donate to NGO
                        </button>
                      )}
                    </>
                  )}
                  {!isManager && item.availableToday && (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="order-button"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FoodItems;


// FoodItemForm Component (can be in a separate file like FoodItemForm.jsx)
function FoodItemForm({ foodItem, onSave, onCancel }) {
  const [name, setName] = useState(foodItem ? foodItem.name : '');
  const [description, setDescription] = useState(foodItem ? foodItem.description : '');
  const [price, setPrice] = useState(foodItem ? foodItem.price.toString() : '');
  const [availableToday, setAvailableToday] = useState(foodItem ? foodItem.availableToday : true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: foodItem ? foodItem.id : null,
      name,
      description,
      price: parseFloat(price),
      availableToday: availableToday,
    });
  };

  return (
    <div className="food-form-card">
      <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
        {foodItem ? 'Edit Food Item' : 'Add New Food Item'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            required
          />
        </div>
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="availableToday"
            checked={availableToday}
            onChange={(e) => setAvailableToday(e.target.checked)}
          />
          <label htmlFor="availableToday">Available Today</label>
        </div>
        <div className="form-actions">
          <button type="submit" className="save-button">
            Save
          </button>
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}