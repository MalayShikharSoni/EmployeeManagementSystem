// frontend/src/services/socket.ts
import { io, Socket } from 'socket.io-client';
import { refreshAccessToken } from './tokenRefresh';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    // Callback form: the token is read FRESH from localStorage on every
    // connection AND every reconnection attempt, so a rotated/refreshed token
    // is always used (a static value would capture a stale token once).
    auth: (cb) => cb({ token: localStorage.getItem('accessToken') }),
    // Auto reconnect is true by default, but we can be explicit
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000
  });

  socket.on('connect', () => {
    console.log('[SOCKET] Connected with ID:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[SOCKET] Disconnected. Reason:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('[SOCKET] Connection error:', error.message);
  });

  // The server force-disconnects a socket when its access token expires, after
  // emitting this event. Refresh the token BEFORE reconnecting so the reconnect
  // handshake uses a fresh token instead of retrying with the expired one.
  socket.on('auth:expired', async () => {
    console.warn('[SOCKET] Access token expired; refreshing before reconnect...');
    try {
      await refreshAccessToken();
      // A server-initiated disconnect ("io server disconnect") does NOT
      // auto-reconnect, so reconnect manually — the auth callback above will
      // read the freshly refreshed token.
      socket?.connect();
    } catch {
      // Refresh token also invalid/expired — same failure path as a failed REST
      // refresh: clear the session and send the user to login. Do not loop.
      localStorage.clear();
      window.location.href = '/login';
    }
  });

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => {
  return socket;
};
