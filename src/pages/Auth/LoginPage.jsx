// src/pages/Auth/LoginPage.jsx

import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth(); // Get isAuthenticated from context

  // Effect to navigate when isAuthenticated becomes true
  useEffect(() => {
    if (isAuthenticated) {
      // Small delay to ensure all context updates and App.jsx re-renders
      // before navigating, preventing potential race conditions.
      setTimeout(() => {
        navigate('/home'); // Navigate to /home. PrivateRoute in App.jsx will then handle role-based redirection.
      }, 100);
    }
  }, [isAuthenticated, navigate]); // Depend on isAuthenticated and navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // We no longer need to capture the return value directly here,
      // as the useEffect will handle navigation based on isAuthenticated.
      await login(username, password);

      // The console logs below will now correctly show the user object
      // since AuthContext's login function is explicitly returning it.
      // console.log('LoginPage: User object received after await:', user); // This log will now show the user object
      // console.log('Login successful:', user); // This log will now show the user object

      setMessage('Login attempt successful. Checking authentication status...');

    } catch (error) {
      const resMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
      console.error('Login error:', error.response || error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-fuchsia-600 p-8 sm:p-12 lg:p-16">
      <div className="bg-white p-12 sm:p-16 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-700 ease-in-out hover:scale-105 hover:shadow-3xl border border-gray-100">
        <h2 className="text-5xl font-extrabold text-center text-gray-900 mb-12 tracking-tight">Welcome Back!</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-8">
            <label className="block text-gray-700 text-lg font-semibold mb-4" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="shadow-sm appearance-none border border-gray-300 rounded-xl w-full py-4 px-6 text-xl text-gray-800 leading-tight focus:outline-none focus:ring-3 focus:ring-indigo-400 focus:border-transparent transition duration-300 ease-in-out"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-10">
            <label className="block text-gray-700 text-lg font-semibold mb-4" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow-sm appearance-none border border-gray-300 rounded-xl w-full py-4 px-6 text-xl text-gray-800 mb-3 leading-tight focus:outline-none focus:ring-3 focus:ring-indigo-400 focus:border-transparent transition duration-300 ease-in-out"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 px-8 rounded-xl focus:outline-none focus:shadow-outline transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-xl tracking-wide"
            >
              Sign In
            </button>
          </div>
          {message && (
            <div className="mt-10 text-lg font-medium text-center text-red-700 bg-red-100 border border-red-300 rounded-xl py-4 px-6">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
