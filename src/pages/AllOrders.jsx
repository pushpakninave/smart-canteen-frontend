// src/pages/AllOrders.jsx

import React, { useEffect, useState } from 'react';
import OrderService from '../api/order';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { useNotifications } from '../context/NotificationContext'; // <<< NEW: Import useNotifications

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const { isAuthenticated, currentUser } = useAuth();
  const { addNotification } = useNotifications(); // <<< NEW: Get addNotification from context

  const isManagerOrAdmin = currentUser?.role === 'ROLE_CANTEEN_MANAGER' || currentUser?.role === 'ROLE_ADMIN';

  useEffect(() => {
    const fetchAllOrders = async () => {
      if (!isAuthenticated || !isManagerOrAdmin) {
        setLoading(false);
        setError('Access Denied. You do not have permission to view all orders.');
        return;
      }
      setLoading(true);
      setError(null);
      setMessage('');
      try {
        const response = await OrderService.getAllOrders();
        setOrders(response.data);
      } catch (err) {
        console.error('Failed to fetch all orders:', err);
        setError('Failed to load all orders. Please try again later.');
        if (err.response) {
          if (err.response.status === 403) {
            setError('Access Denied. You do not have permission to view all orders.');
          } else if (err.response.data && err.response.data.message) {
            setError(`Error: ${err.response.data.message}`);
          }
        } else {
          setError(`Network Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, [isAuthenticated, isManagerOrAdmin]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setMessage('');
    try {
      if (!window.confirm(`Are you sure you want to change status of Order ID ${orderId} to ${newStatus.replace(/_/g, ' ')}?`)) {
        return;
      }

      // Pass addNotification to the service call
      const response = await OrderService.updateOrderStatus(orderId, newStatus, addNotification);
      setMessage(`Order ID ${orderId} status updated to ${newStatus.replace(/_/g, ' ')}!`);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: response.data.status } : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      const errorMessage =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      setMessage(`Failed to update order status: ${errorMessage}`);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading all orders...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="all-orders-container">
      <h2 className="all-orders-title">All Orders</h2>
      {message && <div className={`info-message ${error ? 'error' : ''}`}>{message}</div>}

      {orders.length === 0 ? (
        <p className="no-items-message">No orders found.</p>
      ) : (
        <div className="orders-list">
          <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.username} (ID: {order.userId})</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className={`order-status status-${order.status.toLowerCase()}`}>{order.status.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <ul className="list-disc list-inside">
                      {order.orderItems.map(item => (
                        <li key={item.id}>
                          {item.foodItemName} (x{item.quantity})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {isManagerOrAdmin && (
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PREPARING">Preparing</option>
                        <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                        <option value="PICKED_UP">Picked Up</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AllOrders;
