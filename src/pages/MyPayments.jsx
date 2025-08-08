// src/pages/MyPayments.jsx

import React, { useEffect, useState } from 'react';
import PaymentService from '../api/payment'; // Import the new PaymentService
import { useAuth } from '../context/AuthContext'; // To ensure user is authenticated
import { format } from 'date-fns'; // For date formatting (ensure you've run npm install date-fns)

function MyPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth(); // Check if user is authenticated

  useEffect(() => {
    const fetchMyPayments = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        setError('Please log in to view your payments.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await PaymentService.getMyPayments(); // Fetch payments
        setPayments(response.data);
      } catch (err) {
        console.error('Failed to fetch my payments:', err);
        setError('Failed to load your payments. Please try again later.');
        if (err.response && err.response.status === 403) {
          setError('Access Denied. You do not have permission to view your payments.');
        } else if (err.response && err.response.data && err.response.data.message) {
          setError(`Error: ${err.response.data.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyPayments();
  }, [isAuthenticated]); // Re-fetch if authentication status changes

  if (loading) {
    return <div className="loading-message">Loading your payments...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="my-payments-container">
      <h2 className="my-payments-title">My Payments</h2>
      {payments.length === 0 ? (
        <p className="no-items-message">You have no payment history.</p>
      ) : (
        <div className="payments-list">
          {payments.map(payment => (
            <div key={payment.id} className="payment-card">
              <h3>Payment ID: {payment.id}</h3>
              <p>Order ID: {payment.orderId}</p>
              <p>Amount: ₹{payment.amount.toFixed(2)}</p>
              <p>Payment Date: {format(new Date(payment.paymentDate), 'PPP p')}</p>
              <p>Status: <span className={`payment-status status-${payment.status.toLowerCase()}`}>{payment.status}</span></p>
              <p>Method: {payment.method}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPayments;  