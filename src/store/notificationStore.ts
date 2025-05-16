import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification } from '../types';
import { notifications as initialNotifications } from '../data/mockData';

interface NotificationState {
  notifications: Notification[];
  
  fetchNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
  
  getNotificationsByUserId: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      
      fetchNotifications: () => {
        // In a real app, this would be an API call
        set({ notifications: initialNotifications });
      },
      
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString().split('T')[0],
        };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));
      },
      
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },
      
      markAllAsRead: (userId) => {
        set((state) => ({
          notifications: state.notifications.map(n => 
            n.userId === userId ? { ...n, read: true } : n
          ),
        }));
      },
      
      getNotificationsByUserId: (userId) => {
        return get().notifications.filter(n => n.userId === userId);
      },
      
      getUnreadCount: (userId) => {
        return get().notifications.filter(n => n.userId === userId && !n.read).length;
      },
    }),
    {
      name: 'notification-storage',
    }
  )
);