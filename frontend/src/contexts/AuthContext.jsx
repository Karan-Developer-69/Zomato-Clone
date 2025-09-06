import { createContext, useContext, useState, useEffect } from 'react';
import { apiHelpers } from '../utils/axiosConfig';
import { cookieUtils } from '../utils/cookies';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children, serverUrl }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state from cookies
  useEffect(() => {
    // Check if user info exists in cookies for faster initial load
    const savedUserInfo = cookieUtils.getJsonCookie('userInfo');
    if (savedUserInfo) {
      setUser(savedUserInfo);
      setIsAuthenticated(true);
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [serverUrl]);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check if we have a token in cookies first
      const token = cookieUtils.getAuthToken();
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const response = await apiHelpers.get(`${serverUrl}/api/auth/status`);
      
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        // Store user info in cookie for persistence
        cookieUtils.setJsonCookie('userInfo', response.data.user, { expires: 7 });
      } else {
        setUser(null);
        setIsAuthenticated(false);
        cookieUtils.clearAuthToken();
        cookieUtils.deleteCookie('userInfo');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      cookieUtils.clearAuthToken();
      cookieUtils.deleteCookie('userInfo');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password, userType = 'user') => {
    try {
      const endpoint = userType === 'user' 
        ? `${serverUrl}/api/auth/user/login`
        : `${serverUrl}/api/auth/food-partner/login`;
      
      const response = await apiHelpers.post(endpoint, { email, password });
      
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        // Store user info in cookie for persistence
        cookieUtils.setJsonCookie('userInfo', response.data.user, { expires: 7 });
        
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData, userType = 'user') => {
    try {
      const endpoint = userType === 'user' 
        ? `${serverUrl}/api/auth/user/register`
        : `${serverUrl}/api/auth/food-partner/register`;
      
      const response = await apiHelpers.post(endpoint, userData);
      
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        // Store user info in cookie for persistence
        cookieUtils.setJsonCookie('userInfo', response.data.user, { expires: 7 });
        
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      const endpoint = user?.type === 'user' 
        ? `${serverUrl}/api/auth/user/logout`
        : `${serverUrl}/api/auth/food-partner/logout`;
      
      await apiHelpers.get(endpoint);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Clear all authentication data
      setUser(null);
      setIsAuthenticated(false);
      cookieUtils.clearAuthToken();
      cookieUtils.deleteCookie('userInfo');
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
