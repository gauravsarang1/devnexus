
import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

// Base URL points to the backend server
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for sending/receiving HttpOnly cookies
});

// Request Interceptor: Attach JWT token from memory
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token; // Memory only
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear Redux state on authentication failure
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default apiClient;
