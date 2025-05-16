import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';

import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import NotificationItem from '../components/notifications/NotificationItem';

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { 
    notifications, fetchNotifications, 
    getNotificationsByUserId, markAsRead, markAllAsRead 
  } = useNotificationStore();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchNotifications();
  }, [isAuthenticated, navigate, fetchNotifications]);
  
  const userNotifications = user ? getNotificationsByUserId(user.id) : [];
  const unreadCount = userNotifications.filter(n => !n.read).length;
  
  const handleMarkAllAsRead = () => {
    if (user) {
      markAllAsRead(user.id);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-800">
          Notifications
        </h1>
        
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="flex items-center space-x-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-md hover:bg-primary-100 transition-colors"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>
      
      {userNotifications.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {userNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))}
        </motion.div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <Bell className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-heading font-medium text-gray-700 mb-2">
            No Notifications
          </h2>
          <p className="text-gray-500">
            You don't have any notifications at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;