// src/config/api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    GOOGLE_LOGIN: `${API_BASE_URL}/api/auth/google-login`,
  },
  ASTROLOGY: {
    CALCULATE: `${API_BASE_URL}/api/astrology/calculate`,
  },
  ADMIN: {
    ALL_DATA: `${API_BASE_URL}/api/admin/all-data`,
    STATS: `${API_BASE_URL}/api/admin/stats`,
  },
};

export default API_BASE_URL; 