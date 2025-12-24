import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './constants';
import { useAuthStore } from './../store/auth.store';
// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - add token to headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Log untuk debugging
    console.log('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message
    });

    // PENTING: Jangan redirect pada endpoint forgot/reset password
    // Biarkan komponen yang handle error-nya
    const isForgotPasswordEndpoint = 
      error.config?.url?.includes('/forgot') || 
      error.config?.url?.includes('/reset') ||
      error.config?.url?.includes('/otp');

    if (isForgotPasswordEndpoint) {
      console.log('Error pada forgot/reset password flow - tidak akan redirect');
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized HANYA untuk endpoint lain
    if (error.response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().logout();
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        console.log('401 Unauthorized - redirecting to login');
        window.location.href = '/login';
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);
export default apiClient;
