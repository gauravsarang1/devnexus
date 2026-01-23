
import axios, {AxiosError} from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';
import { toast } from 'sonner';

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
  (response) => {
    const { success, error } = response.data || {};

    // Backend-level failure (200 but success=false)
    if (success === false) {
      toast.error(error?.message || 'Something went wrong');
      return Promise.reject(error);
    }

    return response;
  },
  (error: AxiosError<any>) => {
    // Network / server / auth errors
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      'Network error';

    toast.error(message);

    // Optional: global auth handling
    if (error.response?.status === 401) {
        store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);

export default apiClient;
