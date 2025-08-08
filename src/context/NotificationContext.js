  // src/context/NotificationContext.js

  import React, { createContext, useState, useContext, useEffect } from 'react';

  const NotificationContext = createContext();

  export const useNotifications = () => {
    return useContext(NotificationContext);
  };

  export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState(() => {
      try {
        const localNotifications = localStorage.getItem('notifications');
        return localNotifications ? JSON.parse(localNotifications) : [];
      } catch (error) {
        console.error("Failed to parse notifications from localStorage:", error);
        return [];
      }
    });

    // Effect to save notifications to localStorage whenever they change
    useEffect(() => {
      try {
        localStorage.setItem('notifications', JSON.stringify(notifications));
      } catch (error) {
        console.error("Failed to save notifications to localStorage:", error);
      }
    }, [notifications]);

    // Add a new notification
    const addNotification = (message) => {
      const newNotification = {
        id: Date.now(), // Simple unique ID
        message: message,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications(prevNotifications => [newNotification, ...prevNotifications]); // Add to top
    };

    // Mark a notification as read
    const markAsRead = (id) => {
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    };

    // Mark all notifications as read
    const markAllAsRead = () => {
      setNotifications(prevNotifications =>
        prevNotifications.map(notif => ({ ...notif, read: true }))
      );
    };

    // Clear all notifications
    const clearAllNotifications = () => {
      setNotifications([]);
    };

    // Get unread notification count
    const unreadCount = notifications.filter(notif => !notif.read).length;

    const contextValue = {
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAllNotifications,
      unreadCount,
    };

    return (
      <NotificationContext.Provider value={contextValue}>
        {children}
      </NotificationContext.Provider>
    );
  };
