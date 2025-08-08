// src/pages/ManageUsers.jsx

import React, { useState, useEffect } from 'react';
import UserService from '../api/user'; // Assuming you have a UserService
import AuthService from '../api/auth'; // Import AuthService for registration
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const { isAuthenticated, currentUser } = useAuth();
  const { addNotification } = useNotifications();

  // State for adding new user
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('STUDENT'); // Default new user role

  const isAdmin = currentUser?.role === 'ROLE_ADMIN';

  useEffect(() => {
    fetchUsers();
  }, [isAuthenticated, isAdmin]);

  const fetchUsers = async () => {
    if (!isAuthenticated || !isAdmin) {
      setLoading(false);
      setError('Access Denied. You do not have permission to manage users.');
      return;
    }
    setLoading(true);
    setError(null);
    setMessage('');
    try {
      const response = await UserService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again later.');
      if (err.response) {
        if (err.response.status === 403) {
          setError('Access Denied. You do not have permission to view users.');
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

  const handleRoleChange = async (userId, newRoleName) => {
    setMessage('');
    try {
      // Ensure the role name sent to backend matches ERole enum (e.g., ROLE_STUDENT)
      const formattedRole = newRoleName.startsWith('ROLE_') ? newRoleName : `ROLE_${newRoleName.toUpperCase()}`;
      
      await UserService.updateUserRole(userId, formattedRole);
      addNotification(`User ID ${userId} role updated to ${newRoleName}.`);
      setMessage(`User ID ${userId} role updated to ${newRoleName}!`);
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error updating user role:', err);
      const errorMessage =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      setMessage(`Failed to update user role: ${errorMessage}`);
      addNotification(`Failed to update user role for ID ${userId}.`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm(`Are you sure you want to delete User ID ${userId}? This action cannot be undone.`)) {
      return;
    }
    setMessage('');
    try {
      await UserService.deleteUser(userId);
      addNotification(`User ID ${userId} deleted successfully.`);
      setMessage(`User ID ${userId} deleted successfully!`);
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error deleting user:', err);
      const errorMessage =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      setMessage(`Failed to delete user: ${errorMessage}`);
      addNotification(`Failed to delete user ID ${userId}.`);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // AuthService.register expects role without 'ROLE_' prefix
      const roleForAuthService = newRole.replace('ROLE_', '').toLowerCase();
      await AuthService.register(newUsername, newEmail, newPassword, roleForAuthService);
      addNotification(`New user "${newUsername}" added successfully.`);
      setMessage(`New user "${newUsername}" added successfully!`);
      setShowAddUserForm(false); // Hide form after successful addition
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      setNewRole('STUDENT'); // Reset role
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error('Error adding new user:', err);
      const errorMessage =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      setMessage(`Failed to add user: ${errorMessage}`);
      addNotification(`Failed to add new user "${newUsername}".`);
    }
  };


  if (loading) {
    return <div className="loading-message">Loading users...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Manage Users</h2>

      {message && <div className={`info-message ${error ? 'error' : ''}`}>{message}</div>}

      {isAdmin && (
        <button
          onClick={() => setShowAddUserForm(!showAddUserForm)}
          className="add-food-button mb-6" // Reusing add-food-button style
        >
          {showAddUserForm ? 'Cancel Add User' : 'Add New User'}
        </button>
      )}

      {showAddUserForm && (
        <div className="food-form-card mb-6"> {/* Reusing food-form-card style */}
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">Add New User</h3>
          <form onSubmit={handleAddUser}>
            <div className="form-group">
              <label htmlFor="newUsername">Username:</label>
              <input
                type="text"
                id="newUsername"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newEmail">Email:</label>
              <input
                type="email"
                id="newEmail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Password:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newRole">Role:</label>
              <select
                id="newRole"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full"
              >
                <option value="STUDENT">Student</option>
                <option value="CANTEEN_MANAGER">Canteen Manager</option>
                <option value="ADMIN">Admin</option>
                <option value="NGO">NGO</option> {/* <<< NEW: Added NGO option */}
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-button">Create User</button>
              <button type="button" onClick={() => setShowAddUserForm(false)} className="cancel-button">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {users.length === 0 ? (
        <p className="no-items-message">No users found.</p>
      ) : (
        <div className="users-list">
          <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {isAdmin ? (
                      <select
                        value={user.role.replace('ROLE_', '')} // Display without ROLE_ prefix
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="STUDENT">Student</option>
                        <option value="CANTEEN_MANAGER">Canteen Manager</option>
                        <option value="ADMIN">Admin</option>
                        <option value="NGO">NGO</option> {/* <<< NEW: Added NGO option */}
                      </select>
                    ) : (
                      user.role.replace('ROLE_', '')
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Delete
                      </button>
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

export default ManageUsers;