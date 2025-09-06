# JS-Cookie Integration for Zomato-S Frontend

This document outlines the integration of the `js-cookie` package for proper cookie management in the frontend application.

## Installation

The `js-cookie` package has been installed in the frontend:

```bash
npm install js-cookie
```

## Implementation

### 1. Cookie Utilities (`frontend/src/utils/cookies.js`)

Enhanced cookie utility functions using js-cookie:

```javascript
import Cookies from 'js-cookie';

export const cookieUtils = {
  // Basic cookie operations
  setCookie: (name, value, options = {}) => { ... },
  getCookie: (name) => { ... },
  deleteCookie: (name, options = {}) => { ... },
  hasCookie: (name) => { ... },
  
  // Authentication-specific methods
  setAuthToken: (token, options = {}) => { ... },
  getAuthToken: () => { ... },
  clearAuthToken: () => { ... },
  
  // JSON cookie operations
  setJsonCookie: (name, value, options = {}) => { ... },
  getJsonCookie: (name) => { ... },
  
  // Utility methods
  getAllCookies: () => { ... },
  clearAllCookies: () => { ... }
};
```

### 2. Axios Configuration (`frontend/src/utils/axiosConfig.js`)

Centralized axios configuration with automatic cookie handling:

- **Request Interceptor**: Ensures cookies are sent with every request
- **Response Interceptor**: Handles authentication errors and cookie management
- **Error Handling**: Automatic logout on 401 errors
- **Helper Functions**: Simplified API calls with proper cookie handling

### 3. Authentication Context Updates

The `AuthContext` has been updated to use js-cookie:

- **Cookie Persistence**: User info stored in cookies for faster initial load
- **Automatic Cleanup**: Cookies cleared on logout and authentication errors
- **Token Management**: Secure token storage and retrieval
- **Error Handling**: Improved error handling with automatic state cleanup

## Key Features

### 1. Secure Cookie Configuration

```javascript
const defaultOptions = {
  expires: 7, // 7 days
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production'
};
```

### 2. Authentication Flow

1. **Login/Register**: Token and user info stored in cookies
2. **Page Refresh**: User info loaded from cookies for instant authentication
3. **API Calls**: Cookies automatically sent with requests
4. **Logout**: All authentication cookies cleared
5. **Error Handling**: Automatic cleanup on authentication errors

### 3. Cookie Types

- **`token`**: JWT authentication token (httpOnly, set by backend)
- **`userInfo`**: User profile information (client-side, for faster loading)

### 4. Mobile-Friendly Features

- **Touch Interactions**: Enhanced touch targets for mobile devices
- **Responsive Design**: Mobile-first navigation with hamburger menu
- **Gesture Support**: Improved swipe and tap interactions for reels

## Usage Examples

### Setting a Cookie

```javascript
import { cookieUtils } from '../utils/cookies';

// Basic cookie
cookieUtils.setCookie('theme', 'dark', { expires: 30 });

// Authentication token
cookieUtils.setAuthToken('jwt-token-here');

// JSON data
cookieUtils.setJsonCookie('userPreferences', { theme: 'dark', language: 'en' });
```

### Getting a Cookie

```javascript
// Basic cookie
const theme = cookieUtils.getCookie('theme');

// Authentication token
const token = cookieUtils.getAuthToken();

// JSON data
const preferences = cookieUtils.getJsonCookie('userPreferences');
```

### API Calls with Automatic Cookie Handling

```javascript
import { apiHelpers } from '../utils/axiosConfig';

// GET request
const response = await apiHelpers.get('/api/data');

// POST request
const response = await apiHelpers.post('/api/data', { key: 'value' });
```

## Security Considerations

1. **HttpOnly Cookies**: Authentication tokens are set as httpOnly by the backend
2. **Secure Flag**: Cookies marked as secure in production
3. **SameSite Protection**: CSRF protection with SameSite attribute
4. **Automatic Cleanup**: Cookies cleared on logout and errors
5. **Error Handling**: Automatic logout on authentication failures

## Mobile Improvements

### 1. Enhanced Reels UI

- **Better Touch Targets**: Minimum 44px touch targets for mobile
- **Improved Spacing**: Better spacing for mobile devices
- **Visual Feedback**: Enhanced hover and active states
- **Responsive Design**: Optimized for various screen sizes

### 2. Mobile Navigation

- **Hamburger Menu**: Collapsible navigation for mobile
- **Touch-Friendly**: Large touch targets and smooth animations
- **User Profile**: Mobile-optimized user information display
- **Responsive Layout**: Adapts to different screen sizes

### 3. Gesture Support

- **Swipe Navigation**: Smooth scrolling between reels
- **Tap Interactions**: Enhanced tap feedback for actions
- **Touch Optimization**: Better touch handling for mobile devices

## Error Handling

The integration includes comprehensive error handling:

1. **Network Errors**: Graceful handling of network failures
2. **Authentication Errors**: Automatic logout on 401 responses
3. **Server Errors**: Proper error messages and fallbacks
4. **Cookie Errors**: Safe fallbacks when cookies are unavailable

## Benefits

1. **Better Performance**: Faster initial load with cookie persistence
2. **Improved UX**: Seamless authentication experience
3. **Mobile Optimization**: Enhanced mobile user experience
4. **Security**: Proper cookie security and error handling
5. **Maintainability**: Centralized cookie management
6. **Reliability**: Robust error handling and fallbacks

## Testing

To test the cookie integration:

1. **Login/Register**: Verify cookies are set correctly
2. **Page Refresh**: Ensure user stays logged in
3. **Logout**: Verify all cookies are cleared
4. **Error Scenarios**: Test 401 error handling
5. **Mobile**: Test on various mobile devices and screen sizes

## Troubleshooting

### Common Issues

1. **Cookies Not Set**: Check CORS configuration and credentials
2. **Authentication Fails**: Verify token format and expiration
3. **Mobile Issues**: Test touch interactions and responsive design
4. **Error Handling**: Check console for error messages

### Debug Tools

```javascript
// Check all cookies
console.log(cookieUtils.getAllCookies());

// Check specific cookie
console.log(cookieUtils.getAuthToken());

// Clear all cookies (for testing)
cookieUtils.clearAllCookies();
```

This integration provides a robust, secure, and mobile-friendly cookie management system for the Zomato-S application.
