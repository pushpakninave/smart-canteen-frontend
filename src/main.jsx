// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import your main App component
import './index.css';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { CartProvider } from './context/CartContext'; // Import CartProvider
import { NotificationProvider } from './context/NotificationContext'; // Import NotificationProvider
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router> {/* Outermost Router for all routing */}
      <NotificationProvider> {/* NotificationProvider wraps everything that needs notifications */}
        <AuthProvider> {/* AuthProvider wraps everything that needs authentication state */}
          <CartProvider> {/* CartProvider wraps everything that needs cart functionality */}
            <App /> {/* Your main App component, which will contain Routes and consume contexts */}
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </Router>
  </React.StrictMode>,
);
