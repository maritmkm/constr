import axios from 'axios';
import { toast } from 'sonner';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to attach bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      const isPublicPath = ['/login', '/register', '/employee-register'].includes(window.location.pathname);
      if (!isPublicPath) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
