import Cookies from 'js-cookie';

// Cookie utility functions for frontend using js-cookie
export const cookieUtils = {
  // Set a cookie with proper configuration
  setCookie: (name, value, options = {}) => {
    const defaultOptions = {
      expires: 7, // 7 days
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    };
    
    return Cookies.set(name, value, { ...defaultOptions, ...options });
  },

  // Get a cookie value
  getCookie: (name) => {
    return Cookies.get(name);
  },

  // Delete a cookie
  deleteCookie: (name, options = {}) => {
    const defaultOptions = {
      path: '/',
      sameSite: 'lax'
    };
    
    return Cookies.remove(name, { ...defaultOptions, ...options });
  },

  // Check if a cookie exists
  hasCookie: (name) => {
    return Cookies.get(name) !== undefined;
  },

  // Get all cookies as an object
  getAllCookies: () => {
    return Cookies.get();
  },

  // Note: Authentication token is set as httpOnly by backend
  // These methods are kept for compatibility but won't work with httpOnly cookies
  setAuthToken: (token, options = {}) => {
    console.warn('setAuthToken: Token should be set by backend as httpOnly cookie');
    return cookieUtils.setCookie('token', token, {
      expires: 7, // 7 days
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      ...options
    });
  },

  // Get authentication token (won't work with httpOnly cookies)
  getAuthToken: () => {
    console.warn('getAuthToken: Cannot access httpOnly cookies from frontend');
    return cookieUtils.getCookie('token');
  },

  // Clear authentication token (won't work with httpOnly cookies)
  clearAuthToken: () => {
    console.warn('clearAuthToken: Token should be cleared by backend');
    return cookieUtils.deleteCookie('token');
  },

  // Clear all cookies (useful for logout)
  clearAllCookies: () => {
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach(cookieName => {
      Cookies.remove(cookieName, { path: '/' });
    });
  },

  // Set cookie with JSON value
  setJsonCookie: (name, value, options = {}) => {
    return cookieUtils.setCookie(name, JSON.stringify(value), options);
  },

  // Get cookie as JSON
  getJsonCookie: (name) => {
    const value = cookieUtils.getCookie(name);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error('Error parsing JSON cookie:', e);
        return null;
      }
    }
    return null;
  }
};
