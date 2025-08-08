// src/pages/NotificationsPage.jsx

import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns'; // For relative time

function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, clearAllNotifications } = useNotifications();

  // Sort notifications by timestamp, newest first
  const sortedNotifications = [...notifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Notifications</h2>

        <div className="flex justify-end mb-4 space-x-2">
          {notifications.length > 0 && (
            <>
              <button
                onClick={markAllAsRead}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md text-sm"
              >
                Mark All as Read
              </button>
              <button
                onClick={clearAllNotifications}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md text-sm"
              >
                Clear All
              </button>
            </>
          )}
        </div>

        {sortedNotifications.length === 0 ? (
          <p className="no-items-message">You have no notifications yet.</p>
        ) : (
          <div className="space-y-4">
            {sortedNotifications.map(notif => (
              <div
                key={notif.id}
                className={`p-4 rounded-lg border ${notif.read ? 'bg-gray-100 border-gray-200' : 'bg-blue-50 border-blue-200 font-semibold'} flex justify-between items-center`}
              >
                <div>
                  <p className={`${notif.read ? 'text-gray-700' : 'text-blue-800'}`}>{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                  </p>
                </div>
                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-xs ml-4"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
