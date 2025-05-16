import React from 'react';
import { Notification } from '../../types';
import { 
  Info, AlertCircle, CheckCircle, AlertTriangle, 
  CheckCheck 
} from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'info':
        return <Info className="h-5 w-5 text-primary-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-primary-500" />;
    }
  };
  
  const getContainerClass = () => {
    if (notification.read) {
      return 'bg-gray-50 border-gray-300';
    }
    
    switch (notification.type) {
      case 'info':
        return 'bg-primary-50 border-primary-300';
      case 'warning':
        return 'bg-amber-50 border-amber-300';
      case 'success':
        return 'bg-green-50 border-green-300';
      case 'error':
        return 'bg-red-50 border-red-300';
      default:
        return 'bg-primary-50 border-primary-300';
    }
  };
  
  return (
    <div className={`p-4 mb-3 rounded-lg shadow-sm border-l-4 flex ${getContainerClass()}`}>
      <div className="mr-3 flex-shrink-0 mt-1">
        {getIcon()}
      </div>
      
      <div className="flex-1">
        <p className={`text-gray-800 ${notification.read ? 'font-normal' : 'font-medium'}`}>
          {notification.message}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {notification.createdAt}
        </p>
      </div>
      
      {!notification.read && (
        <button 
          onClick={() => onMarkAsRead(notification.id)}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Mark as read"
        >
          <CheckCheck className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default NotificationItem;