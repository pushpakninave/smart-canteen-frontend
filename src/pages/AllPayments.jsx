import React, { useState, useEffect } from 'react';
import PaymentService from '../api/payment';
import { useAuth } from '../context/AuthContext';

function AllPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentUser } = useAuth();
  const isManagerOrAdmin = currentUser?.role === 'ROLE_CANTEEN_MANAGER' || currentUser?.role === 'ROLE_ADMIN';

  const fetchAllPayments = async () => {
    if (!isManagerOrAdmin) {
      setError('Access Denied. Only Canteen Managers or Admins can view all payments.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await PaymentService.getAllPayments();
      setPayments(response.data);
    } catch (err) {
      console.error('Failed to fetch all payments:', err);
      setError('Failed to load all payments. Please try again.');
      if (err.response && err.response.status === 403) {
        setError('Access Denied. You do not have permission to view this content.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAllPayments();
    }
  }, [currentUser]);

  if (loading) {
    return <div className="loading-message">Loading all payments...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="all-payments-container">
      <h2 className="all-payments-title">All Payments</h2>

      {payments.length === 0 ? (
        <p className="no-items-message">No payments found.</p>
      ) : (
        <div className="payments-grid">
          {payments.map((payment) => (
            <div key={payment.id} className="payment-card">
              <h3>Payment ID: {payment.id}</h3>
              <p>Order ID: {payment.order ? payment.order.id : 'N/A'}</p>
              <p>Student: {payment.order && payment.order.user ? payment.order.user.username : 'N/A'}</p>
              <p>Amount: ₹{payment.amount ? payment.amount.toFixed(2) : '0.00'}</p>
              <p>Payment Date: {new Date(payment.paymentDate).toLocaleString()}</p>
              <p>Status: <span className={`payment-status ${payment.status.toLowerCase()}`}>{payment.status}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllPayments;