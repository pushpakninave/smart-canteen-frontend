// src/pages/ProfilePage.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth to get current user info
import { format } from 'date-fns'; // For date formatting (npm install date-fns if not already)

function ProfilePage() {
  const { currentUser } = useAuth(); // Get the current user from AuthContext

  if (!currentUser) {
    // This case should ideally be handled by PrivateRoute, but good for fallback
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Available</h2>
        <p className="text-lg text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">User Profile</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-semibold">Username:</span>
            <span className="text-gray-800">{currentUser.username}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-semibold">Email:</span>
            <span className="text-gray-800">{currentUser.email}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-semibold">Role:</span>
            <span className="text-gray-800">{currentUser.role.replace('ROLE_', '')}</span>
          </div>
          {/* Assuming createdAt and updatedAt are available in currentUser object from backend */}
          {currentUser.createdAt && (
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-semibold">Member Since:</span>
              <span className="text-gray-800">{format(new Date(currentUser.createdAt), 'PPP')}</span>
            </div>
          )}
          {currentUser.updatedAt && (
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-semibold">Last Updated:</span>
              <span className="text-gray-800">{format(new Date(currentUser.updatedAt), 'PPP p')}</span>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => alert('Edit Profile functionality coming soon!')} // Placeholder for future edit
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;