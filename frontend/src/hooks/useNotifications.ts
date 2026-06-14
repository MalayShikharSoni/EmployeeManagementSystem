// frontend/src/hooks/useNotifications.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationAPI } from '../services/api';
import type { AppNotification } from '../types';
import { useSocket } from '../context/SocketProvider';

export const useNotifications = (isAuthenticated: boolean) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // We need to keep a ref to the current notifications to safely prepend new ones
  // without creating stale closures in the socket listener.
  const notificationsRef = useRef<AppNotification[]>([]);
  
  const { socket, refreshTrigger } = useSocket();

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const [notifsRes, countRes] = await Promise.all([
        notificationAPI.getNotifications(),
        notificationAPI.getUnreadCount()
      ]);
      
      const newNotifs = notifsRes.data.data;
      setNotifications(newNotifs);
      notificationsRef.current = newNotifs;
      setUnreadCount(countRes.data.data.count);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Initial fetch and fetch on explicit refresh triggers (e.g. reconnects)
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications, refreshTrigger]);

  // Set up socket listener specifically for the generic notification event
  useEffect(() => {
    if (!socket || !isAuthenticated) return;

    const handleNewNotification = (notification: AppNotification) => {
      // Prepend to list
      const updatedNotifs = [notification, ...notificationsRef.current];
      setNotifications(updatedNotifs);
      notificationsRef.current = updatedNotifs;
      
      // Increment unread count
      setUnreadCount(prev => prev + 1);
    };

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket, isAuthenticated]);

  const markAsRead = async (id: number) => {
    // Optimistic update
    const prevNotifs = [...notificationsRef.current];
    const updatedNotifs = prevNotifs.map(n => 
      n.id === id && !n.is_read ? { ...n, is_read: true } : n
    );
    
    // Only proceed if something actually changed
    if (prevNotifs.find(n => n.id === id)?.is_read) return;
    
    setNotifications(updatedNotifs);
    notificationsRef.current = updatedNotifs;
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      await notificationAPI.markAsRead(id);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      // Revert on failure
      setNotifications(prevNotifs);
      notificationsRef.current = prevNotifs;
      setUnreadCount(prev => prev + 1);
    }
  };

  const markAllAsRead = async () => {
    // Optimistic update
    const prevNotifs = [...notificationsRef.current];
    const prevCount = unreadCount;
    
    if (prevCount === 0) return;
    
    const updatedNotifs = prevNotifs.map(n => ({ ...n, is_read: true }));
    setNotifications(updatedNotifs);
    notificationsRef.current = updatedNotifs;
    setUnreadCount(0);

    try {
      await notificationAPI.markAllAsRead();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      // Revert on failure
      setNotifications(prevNotifs);
      notificationsRef.current = prevNotifs;
      setUnreadCount(prevCount);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  };
};
