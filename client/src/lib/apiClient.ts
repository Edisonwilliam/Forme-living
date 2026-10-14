/**
 * FORME Living — Axios API Client
 * Central axios instance with request/response interceptors.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send httpOnly cookie on every request
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach Bearer token from localStorage if present ──
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('forme_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: unwrap data, handle 401 redirects ────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('forme_token');
      // Emit custom event so AuthContext can react
      window.dispatchEvent(new CustomEvent('forme:unauthorized'));
    }
    return Promise.reject(error);
  }
);
