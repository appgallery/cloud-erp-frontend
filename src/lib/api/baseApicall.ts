import axios from 'axios';
import { env } from '@/config/env';

export const apiClient = axios.create({
  baseURL: env.API_URL || 'http://localhost:3000/v1', // fallback for dev
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

// Request interceptor to attach auth token
apiClient.interceptors.request.use(
  (config) => {
    // Attempt to get token from localStorage (managed by Zustand or manually)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors (like 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., clear store, redirect to login)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);