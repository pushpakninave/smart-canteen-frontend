// src/pages/OrderPaymentPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderService from '../api/order';
import PaymentService from '../api/payment';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

function OrderPaymentPage() {
  const { orderId } = useParams(); // Get orderId from URL parameter
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // Default payment method

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!isAuthenticated || !currentUser) {
        setError('Please log in to view order details.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Fetch the specific order details for the current user
        const response = await OrderService.getMyOrderById(orderId);
        setOrder(response.data);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        setError('Failed to load order details. Please ensure the order exists and belongs to you.');
        if (err.response && err.response.data && err.response.data.message) {
          setError(`Error: ${err.response.data.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      setError('No Order ID provided.');
      setLoading(false);
    }
  }, [orderId, isAuthenticated, currentUser]);

  const handleProcessPayment = async () => {
    setPaymentMessage('');
    if (!order) {
      setPaymentMessage('Error: No order details to process payment.');
      return;
    }

    try {
      // Confirm with user
      if (!window.confirm(`Confirm payment of ₹${order.totalPrice.toFixed(2)} for Order ID ${order.id} via ${paymentMethod}?`)) {
        return; // User cancelled
      }

      const paymentRequest = {
        orderId: order.id,
        amount: order.totalPrice, // Use the exact total price from the fetched order
        paymentMethod: paymentMethod,
      };

      const response = await PaymentService.processPayment(paymentRequest);
      setPaymentMessage(`Payment successful for Order ID ${response.data.orderId}! Status: ${response.data.status}`);
      // Optionally, navigate to a success page or my orders page
      navigate('/my-payments', { state: { paymentSuccess: true, orderId: order.id } });
    } catch (err) {
      console.error('Payment failed:', err);
      const errorMessage =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      setPaymentMessage(`Payment failed: ${errorMessage}`);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading order details for payment...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!order) {
    return <div className="no-items-message">Order not found or could not be loaded.</div>;
  }

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Complete Your Payment</h2>

        {paymentMessage && (
          <div className={`info-message ${paymentMessage.includes('failed') ? 'error' : ''}`}>
            {paymentMessage}
          </div>
        )}

        <div className="order-details-summary space-y-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-700">Order Summary (ID: {order.id})</h3>
          <p><strong>User:</strong> {order.username}</p>
          <p><strong>Total Amount:</strong> ₹{order.totalPrice.toFixed(2)}</p>
          <p><strong>Order Status:</strong> <span className={`order-status status-${order.status.toLowerCase()}`}>{order.status.replace(/_/g, ' ')}</span></p>
          <p><strong>Order Date:</strong> {order.orderDate ? format(new Date(order.orderDate), 'PPP p') : 'N/A'}</p>

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
        </div>

        <div className="payment-form">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Payment Information</h3>
          <div className="form-group mb-4">
            <label htmlFor="paymentMethod" className="block text-gray-700 font-bold mb-2">Select Payment Method:</label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
              {/* Add more payment methods as needed */}
            </select>
          </div>

          <button
            onClick={handleProcessPayment}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Pay Now: ₹{order.totalPrice.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderPaymentPage;