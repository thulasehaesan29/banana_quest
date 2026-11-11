/**
 * Interoperability Client Service
 * 
 * Manages communication between React Single Page Application
 * and the Express Game Server over RESTful HTTP/JSON.
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Check if token exists in localStorage for fallback Authorization header
  const token = localStorage.getItem('banana_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Enables cookie-based authentication
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const authApi = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  demoLogin: () =>
    request('/auth/demo-login', {
      method: 'POST',
    }),

  getMe: () => request('/auth/me'),

  updateProfile: (updates) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  logout: () =>
    request('/auth/logout', {
      method: 'POST',
    }),
};

export const gameApi = {
  startGame: (difficulty) =>
    request('/game/start', {
      method: 'POST',
      body: JSON.stringify({ difficulty }),
    }),

  submitAnswer: (sessionId, answer, timeRemaining) =>
    request('/game/submit', {
      method: 'POST',
      body: JSON.stringify({ sessionId, answer, timeRemaining }),
    }),

  getAiHint: (sessionId) =>
    request('/game/hint', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    }),

  useTimeFreeze: (sessionId) =>
    request('/game/powerup/freeze', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    }),
};

export const leaderboardApi = {
  getLeaderboard: (period = 'all-time') =>
    request(`/leaderboard?period=${period}`),
};
