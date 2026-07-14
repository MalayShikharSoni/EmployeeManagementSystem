// frontend/src/services/tokenRefresh.ts
// Shared access-token refresh, used by BOTH the REST client (api.ts 401
// interceptor) and the Socket.io client (on 'auth:expired'). Kept in one place
// so there is a single implementation and, critically, a single in-flight guard.
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Single-flight guard: refresh tokens ROTATE on every use (the old one is
// revoked server-side). If two callers (e.g. a REST 401 and a socket
// 'auth:expired') both refreshed with the same token, the second would present
// a just-rotated (revoked) token and trip server-side reuse detection, forcing a
// full logout. Sharing this guard app-wide guarantees at most one refresh at a
// time regardless of which subsystem triggers it.
let refreshPromise: Promise<string> | null = null;

const performTokenRefresh = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });

  // The endpoint returns a NEW access token AND a NEW (rotated) refresh token.
  // Persist both so the next refresh uses the rotated token.
  const { accessToken, refreshToken: newRefreshToken } = response.data.data;
  localStorage.setItem('accessToken', accessToken);
  if (newRefreshToken) {
    localStorage.setItem('refreshToken', newRefreshToken);
  }
  return accessToken;
};

// Returns the in-flight refresh if one is already running; otherwise starts a
// new one and clears the shared promise when it settles.
export const refreshAccessToken = (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = performTokenRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};
