import axios from 'axios';

// Backend API URL Endpoint (Direct Backend Connection)
const getBackendAPIURL = (): string => {
  try {
    return (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
  } catch {
    return 'http://localhost:5000/api';
  }
};

export const api = axios.create({
  baseURL: getBackendAPIURL(),
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
      config.headers = config.headers || {};
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
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      const publicPaths = ['/login', '/register', '/employee-register'];
      const currentPath = window.location.pathname;
      if (!publicPaths.some((p) => currentPath.startsWith(p))) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
