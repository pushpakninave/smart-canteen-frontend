// src/pages/Auth/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await register(username, email, password);
      console.log('Registration successful:', response.data.message);
      setMessage(response.data.message || 'Registration successful! You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const resMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
      console.error('Registration error:', error.response || error);
    }
  };

  return (
    <div className="auth-container"> {/* Replaced Tailwind classes */}
      <div className="auth-card"> {/* Replaced Tailwind classes */}
        <h2>Register</h2> {/* Removed Tailwind classes */}
        <form onSubmit={handleRegister}>
          <div className="form-group"> {/* Replaced Tailwind classes */}
            <label htmlFor="username">Username</label> {/* Removed Tailwind classes */}
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group"> {/* Replaced Tailwind classes */}
            <label htmlFor="email">Email</label> {/* Removed Tailwind classes */}
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group"> {/* Replaced Tailwind classes */}
            <label htmlFor="password">Password</label> {/* Removed Tailwind classes */}
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button register"> {/* Replaced Tailwind classes, added 'register' class */}
            Sign Up
          </button>
          {message && (
            <div className="error-message"> {/* Replaced Tailwind classes */}
              {message}
            </div>
          )}
          <p>
            Already have an account? <Link to="/login" className="auth-link">Login here</Link> {/* Replaced Tailwind classes */}
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;