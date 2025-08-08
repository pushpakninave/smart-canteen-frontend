// src/App.jsx

import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import Home from './pages/Home';
import FoodItems from './pages/FoodItems';
import MyOrders from './pages/MyOrders';
import MyPayments from './pages/MyPayments';
import AllPayments from './pages/AllPayments';
import CartPage from './pages/CartPage';
import AllOrders from './pages/AllOrders';
import ManageUsers from './pages/ManageUsers';
import ProfilePage from './pages/ProfilePage';
import NgoContactPage from './pages/NgoContactPage';
import NotificationsPage from './pages/NotificationsPage';
import DonatedFoodItems from './pages/DonatedFoodItems';
import OrderPaymentPage from './pages/OrderPaymentPage';

import AuthService from './api/auth';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { useNotifications } from './context/NotificationContext';

import PrivateRoute from './components/PrivateRoute';

function App() {
  const { isAuthenticated, currentUser, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { cartItemCount } = useCart();
  const { unreadCount } = useNotifications();

  // NEW DIAGNOSTIC LOGS
  useEffect(() => {
    if (!authLoading) {
      console.log("App.jsx: Auth loading complete.");
      console.log("App.jsx: isAuthenticated:", isAuthenticated);
      console.log("App.jsx: currentUser:", currentUser);
      if (currentUser) {
        console.log("App.jsx: currentUser.role:", currentUser.role);
      } else {
        console.log("App.jsx: currentUser is null.");
      }
    }
  }, [authLoading, isAuthenticated, currentUser]);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading application...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <ul className="left-links">
          <li><Link to="/home">Smart Canteen</Link></li>
          {isAuthenticated && currentUser && (
            <>
              {currentUser.role === 'ROLE_STUDENT' && (
                <>
                  <li><Link to="/food-items">Food Items</Link></li>
                  <li><Link to="/my-orders">My Orders</Link></li>
                  <li><Link to="/my-payments">My Payments</Link></li>
                  <li><Link to="/cart" className="relative">
                    Cart {cartItemCount > 0 && (
                      <span className="cart-badge">{cartItemCount}</span>
                    )}
                  </Link></li>
                </>
              )}
              {currentUser.role === 'ROLE_CANTEEN_MANAGER' && (
                <>
                  <li><Link to="/food-items">Manage Food Items</Link></li>
                  <li><Link to="/all-orders">All Orders</Link></li>
                  <li><Link to="/all-payments">All Payments</Link></li>
                </>
              )}
              {currentUser.role === 'ROLE_ADMIN' && (
                <>
                  <li><Link to="/manage-users">Manage Users</Link></li>
                </>
              )}
              {currentUser.role === 'ROLE_NGO' && (
                <>
                  <li><Link to="/donated-food-items">Donated Food</Link></li>
                  <li><Link to="/profile">Profile</Link></li>
                  <li><Link to="/notifications" className="relative">
                    Notifications {unreadCount > 0 && (
                      <span className="cart-badge">{unreadCount}</span>
                    )}
                  </Link></li>
                </>
              )}
              {/* Common links for Student, Manager, Admin (excluding NGO for Contact NGO) */}
              {['ROLE_STUDENT', 'ROLE_CANTEEN_MANAGER', 'ROLE_ADMIN'].includes(currentUser.role) && (
                <>
                  {/* Profile and Notifications are now handled explicitly per role for clarity */}
                  {currentUser.role !== 'ROLE_NGO' && <li><Link to="/profile">Profile</Link></li>}
                  {currentUser.role !== 'ROLE_NGO' && <li><Link to="/ngo-contact">Contact NGO</Link></li>}
                  {currentUser.role !== 'ROLE_NGO' && <li><Link to="/notifications" className="relative">
                    Notifications {unreadCount > 0 && (
                      <span className="cart-badge">{unreadCount}</span>
                    )}
                  </Link></li>}
                </>
              )}
            </>
          )}
        </ul>

        <ul className="right-links">
          {!isAuthenticated ? (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          ) : (
            <>
              <span className="welcome-message">Welcome, {currentUser.username} ({currentUser.role.replace('ROLE_', '')})</span>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          )}
        </ul>
      </nav>

      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/food-items" element={<PrivateRoute allowedRoles={['ROLE_STUDENT', 'ROLE_CANTEEN_MANAGER']}><FoodItems /></PrivateRoute>} />

          {/* STUDENT, MANAGER, ADMIN, NGO Routes */}
          <Route path="/my-orders" element={<PrivateRoute allowedRoles={['ROLE_STUDENT']}><MyOrders /></PrivateRoute>} />
          <Route path="/my-payments" element={<PrivateRoute allowedRoles={['ROLE_STUDENT']}><MyPayments /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute allowedRoles={['ROLE_STUDENT', 'ROLE_CANTEEN_MANAGER', 'ROLE_ADMIN', 'ROLE_NGO']}><ProfilePage /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute allowedRoles={['ROLE_STUDENT']}><CartPage /></PrivateRoute>} />
          <Route path="/ngo-contact" element={<PrivateRoute allowedRoles={['ROLE_STUDENT', 'ROLE_CANTEEN_MANAGER', 'ROLE_ADMIN']}><NgoContactPage /></PrivateRoute>} />
          <Route path="/order-payment/:orderId" element={<PrivateRoute allowedRoles={['ROLE_STUDENT']}><OrderPaymentPage /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute allowedRoles={['ROLE_STUDENT', 'ROLE_CANTEEN_MANAGER', 'ROLE_ADMIN', 'ROLE_NGO']}><NotificationsPage /></PrivateRoute>} />

          {/* CANTEEN_MANAGER Routes */}
          <Route path="/all-orders" element={<PrivateRoute allowedRoles={['ROLE_CANTEEN_MANAGER']}><AllOrders /></PrivateRoute>} />
          <Route path="/all-payments" element={<PrivateRoute allowedRoles={['ROLE_CANTEEN_MANAGER', 'ROLE_ADMIN']}><AllPayments /></PrivateRoute>} />

          {/* ADMIN Routes */}
          <Route path="/manage-users" element={<PrivateRoute allowedRoles={['ROLE_ADMIN']}><ManageUsers /></PrivateRoute>} />

          {/* NGO Routes */}
          <Route path="/donated-food-items" element={<PrivateRoute allowedRoles={['ROLE_NGO']}><DonatedFoodItems /></PrivateRoute>} />

          {/* Catch-all for undefined routes */}
          <Route path="*" element={<div className="error-message">404 - Page Not Found</div>} />
        </Routes>
      </main>

      {/* Optional Footer */}
      <footer className="footer">
        Smart Canteen App &copy; 2025
      </footer>
    </div>
  );
}

export default App;