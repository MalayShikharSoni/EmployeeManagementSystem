import React, { useEffect, useRef } from 'react';
import { AppNotification } from '../../types';
import styles from './NotificationPanel.module.css';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  unreadCount: number;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
}

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

const getIconForType = (type: string) => {
  switch (type) {
    case 'task_assigned':
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case 'task_completed':
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case 'invitation_received':
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
  }
};

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside the panel (handled by backdrop click)
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scroll on body when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <div 
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`} 
        onClick={onClose}
      />
      
      <div className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`} ref={panelRef}>
        <div className={styles.header}>
          <h2 className={styles.title}>Notifications</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close panel">
            &times;
          </button>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.markAllButton} 
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0 || notifications.length === 0}
          >
            Mark all as read
          </button>
        </div>

        <div className={styles.list}>
          {notifications.length === 0 ? (
            <div className={styles.emptyState}>
              No notifications yet
            </div>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`${styles.notificationCard} ${!notif.is_read ? styles.unreadCard : ''}`}
                onClick={() => {
                  if (!notif.is_read) onMarkAsRead(notif.id);
                }}
              >
                <div className={styles.iconWrap}>
                  {getIconForType(notif.type)}
                </div>
                <div className={styles.content}>
                  <h3 className={styles.notifTitle}>{notif.title}</h3>
                  <p className={styles.notifMessage}>{notif.message}</p>
                  <span className={styles.time}>{formatRelativeTime(notif.created_at)}</span>
                </div>
                {!notif.is_read && <div className={styles.unreadDot} />}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
