import axios from 'axios';
import { cookieUtils } from './cookies';

// Create axios instance with default configuration
const apiClient = axios.create({
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to ensure cookies are sent
apiClient.interceptors.request.use(
  (config) => {
    // Ensure credentials are always sent
    config.withCredentials = true;
    
    // Add any additional headers if needed
    const token = cookieUtils.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and cookie management
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth data
          cookieUtils.clearAuthToken();
          cookieUtils.deleteCookie('userInfo');
          // Redirect to login if not already there
          if (window.location.pathname !== '/user/login' && window.location.pathname !== '/food-partner/login') {
            window.location.href = '/user/login';
          }
          break;
          
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden:', data.message);
          break;
          
        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;
          
        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;
          
        default:
          console.error('Request failed:', data.message);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
    } else {
      // Other error
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper functions for common API calls
export const apiHelpers = {
  // GET request
  get: (url, config = {}) => {
    return apiClient.get(url, { ...config, withCredentials: true });
  },

  // POST request
  post: (url, data = {}, config = {}) => {
    return apiClient.post(url, data, { ...config, withCredentials: true });
  },

  // PUT request
  put: (url, data = {}, config = {}) => {
    return apiClient.put(url, data, { ...config, withCredentials: true });
  },

  // DELETE request
  delete: (url, config = {}) => {
    return apiClient.delete(url, { ...config, withCredentials: true });
  },

  // PATCH request
  patch: (url, data = {}, config = {}) => {
    return apiClient.patch(url, data, { ...config, withCredentials: true });
  },
};

export default apiClient;
