// src/pages/CartPage.jsx

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import OrderService from '../api/order'; // Ensure OrderService is imported
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { useNotifications } from '../context/NotificationContext'; // Import useNotifications hook

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, calculateTotal } = useCart();
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigate hook
  const { addNotification } = useNotifications(); // Get addNotification from NotificationContext

  const handlePlaceOrder = async () => {
    setMessage('');
    if (cartItems.length === 0) {
      setMessage('Your cart is empty. Please add items before placing an order.');
      return;
    }

    const orderItems = cartItems.map(item => ({
      foodItemId: item.id,
      quantity: item.quantity
    }));

    try {
      // Pass addNotification to the service call
      const response = await OrderService.placeOrder(orderItems, addNotification);
      const newOrderId = response.data.id; // Get the ID of the newly placed order
      setMessage(`Order placed successfully! Order ID: ${newOrderId}. Redirecting to payment...`);
      clearCart(); // Clear the cart after placing the order

      // Redirect to OrderPaymentPage with the new order ID
      setTimeout(() => {
        navigate(`/order-payment/${newOrderId}`); // Navigate to the payment page
      }, 1500); // Give user a moment to see the success message
    } catch (error) {
      console.error('Failed to place order:', error);
      const errorMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage(`Failed to place order: ${errorMessage}`);
    }
  };

  const total = calculateTotal(); // Call calculateTotal here

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Cart</h2>

      {message && (
        <div className={`info-message ${message.includes('failed') || message.includes('empty') ? 'error' : ''}`}>
          {message}
        </div>
      )}

      {cartItems.length === 0 ? (
        <p className="no-items-message">Your cart is empty.</p>
      ) : (
        <div className="cart-items-list">
          {cartItems.map(item => (
            <div key={item.id} className="food-item-card flex items-center justify-between p-4 mb-4">
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                <p className="text-gray-700">Price: ₹{item.price.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <label htmlFor={`quantity-${item.id}`} className="mr-2 text-gray-700">Quantity:</label>
                  <input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-16 p-1 border rounded text-center"
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="total-section bg-white rounded-lg shadow-lg p-6 mt-6 text-right">
            <h3 className="text-2xl font-bold text-gray-800">Total: ₹{total.toFixed(2)}</h3>
            <button
              onClick={handlePlaceOrder}
              className="order-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mt-4"
            >
              Place Order & Pay
            </button>
            <button
              onClick={clearCart}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg mt-4 ml-4"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
