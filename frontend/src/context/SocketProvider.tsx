// frontend/src/context/SocketProvider.tsx
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Socket } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './AuthProvider';
import { connectSocket, disconnectSocket } from '../services/socket';

export interface SocketContextType {
  socket: Socket | null;
  refreshTrigger: number;
}

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, userData } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  
  // Used to trigger re-fetches in dashboard components
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const incrementRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // connectSocket reads the token fresh from localStorage (callback-form
        // auth), so it always uses the current/rotated token on every connect.
        const newSocket = connectSocket();
        setSocket(newSocket);

        // --- Setup event listeners for notifications ---

        newSocket.on('task:assigned', (task) => {
          toast.info(`New task assigned: ${task.title}`);
          incrementRefresh();
        });

        newSocket.on('task:statusChanged', ({ taskId, status }) => {
          toast.success(`Task status changed to ${status}`);
          incrementRefresh();
        });

        newSocket.on('invitation:received', () => {
          toast.info('New team invitation received!');
          incrementRefresh();
        });

        newSocket.on('invitation:responded', ({ status }) => {
          toast.success(`Invitation was ${status}`);
          incrementRefresh();
        });

        // Also refresh data when a generic notification arrives
        newSocket.on('notification:new', () => {
          incrementRefresh();
        });

        // Clean up listeners on unmount or socket change
        return () => {
          newSocket.off('task:assigned');
          newSocket.off('task:statusChanged');
          newSocket.off('invitation:received');
          newSocket.off('invitation:responded');
          newSocket.off('notification:new');
        };
      }
    } else {
      // User is logged out, disconnect
      disconnectSocket();
      setSocket(null);
    }
  }, [isAuthenticated, incrementRefresh]);

  const value = useMemo(() => ({
    socket,
    refreshTrigger
  }), [socket, refreshTrigger]);

  return (
    <SocketContext.Provider value={value}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
