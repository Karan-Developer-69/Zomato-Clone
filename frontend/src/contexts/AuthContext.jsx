import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

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
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  // Configure axios defaults for credentials
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [serverUrl]);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${serverUrl}/api/auth/status`,{token: cookies.token});
      
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password, userType = 'user') => {
    try {
      const endpoint = userType === 'user' 
        ? `${serverUrl}/api/auth/user/login`
        : `${serverUrl}/api/auth/food-partner/login`;
      
      const response = await axios.post(endpoint, { email, password });
      
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setCookie('token', response.data.token);
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
      
      const response = await axios.post(endpoint, userData);
      
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setCookie('token', response.data.token);
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
      // const endpoint = user?.type === 'user' 
      //   ? `${serverUrl}/api/auth/user/logout`
      //   : `${serverUrl}/api/auth/food-partner/logout`;
      
      // await axios.get(endpoint);
      removeCookie('token');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
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
