// src/pages/MyOrders.jsx

import React, { useEffect, useState } from 'react';
import OrderService from '../api/order'; // Import OrderService
import { useAuth } from '../context/AuthContext'; // To ensure user is authenticated
import { format } from 'date-fns'; // For date formatting (ensure you've run npm install date-fns)

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth(); // Check if user is authenticated

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        setError('Please log in to view your orders.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await OrderService.getMyOrders(); // <<< CRITICAL: Call to backend
        setOrders(response.data);
      } catch (err) {
        console.error('Failed to fetch my orders:', err);
        setError('Failed to load your orders. Please try again later.');
        if (err.response && err.response.status === 403) {
          setError('Access Denied. You do not have permission to view your orders.');
        } else if (err.response && err.response.data && err.response.data.message) {
          setError(`Error: ${err.response.data.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [isAuthenticated]); // Re-fetch if authentication status changes

  if (loading) {
    return <div className="loading-message">Loading your orders...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="my-orders-container">
      <h2 className="my-orders-title">My Orders</h2>
      {orders.length === 0 ? (
        <p className="no-items-message">You have not placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <h3>Order ID: {order.id}</h3>
              {/* Removed orderDate from Order entity, so removing from display */}
              {/* <p>Order Date: {format(new Date(order.orderDate), 'PPP p')}</p> */}
              <p>Total Price: ₹{order.totalPrice.toFixed(2)}</p>
              <p>Status: <span className={`order-status status-${order.status.toLowerCase()}`}>{order.status.replace(/_/g, ' ')}</span></p>

              <div className="order-items-detail">
                <h4>Items:</h4>
                <ul>
                  {order.orderItems.map(item => (
                    <li key={item.id}>
                      {item.foodItemName} (x{item.quantity}) - ₹{item.subtotal.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Add a button to cancel order if status allows (e.g., PENDING) */}
              {order.status === 'PENDING' && (
                <button
                  className="cancel-order-button"
                  onClick={() => { /* Implement cancel logic here */ }}
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;