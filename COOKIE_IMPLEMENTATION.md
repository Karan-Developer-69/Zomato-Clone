# Cookie-Based Authentication Implementation

This document outlines the cookie-based authentication system implemented for the Zomato-S project.

## Backend Implementation

### Enhanced Cookie Configuration
- **Security Settings**: Cookies are configured with `httpOnly: true`, `secure` flag based on environment, and `sameSite: 'lax'`
- **Expiration**: Cookies expire after 7 days (`maxAge: 7 * 24 * 60 * 60 * 1000`)
- **CORS Configuration**: Updated to support credentials and flexible origins for development

### New Endpoints
- `GET /api/auth/status` - Check authentication status and return user information

### Updated Controllers
- Enhanced all authentication controllers with proper cookie security settings
- Added `checkAuthStatus` function to verify authentication state
- Improved logout functions with proper cookie clearing

## Frontend Implementation

### Authentication Context
- **AuthProvider**: Centralized authentication state management
- **useAuth Hook**: Custom hook for accessing authentication functions
- **Automatic Auth Check**: Checks authentication status on app load

### Key Features
- **Cookie-based Authentication**: Uses HTTP-only cookies for secure token storage
- **Protected Routes**: Route protection based on user type (user/food partner)
- **Error Handling**: Comprehensive error handling with user feedback
- **Loading States**: Loading indicators during authentication operations

### Components Added
- `AuthContext.jsx` - Authentication context and provider
- `ProtectedRoute.jsx` - Route protection component
- `Navigation.jsx` - Navigation with authentication status
- `useAuth.js` - Custom authentication hooks
- `cookies.js` - Cookie utility functions

### Updated Components
- All authentication forms (UserLogin, UserRegister, PartnerLogin, PartnerRegister)
- Home component with navigation
- AppRoutes with protected route configuration

## Security Features

1. **HTTP-Only Cookies**: Prevents XSS attacks by making cookies inaccessible to JavaScript
2. **Secure Flag**: Ensures cookies are only sent over HTTPS in production
3. **SameSite Protection**: Prevents CSRF attacks
4. **Automatic Expiration**: Cookies expire after 7 days for security
5. **Proper CORS**: Configured to allow credentials while maintaining security

## Usage

### For Users
1. Register/Login through the user authentication forms
2. Access protected routes like `/saved`
3. Automatic authentication state management
4. Secure logout functionality

### For Food Partners
1. Register/Login through the partner authentication forms
2. Access protected routes like `/create` and `/food-partner/:id`
3. Same authentication benefits as users

### For Developers
1. Use `useAuth()` hook to access authentication state
2. Use `ProtectedRoute` component to protect routes
3. Authentication state is automatically managed across the app

## Environment Variables

Make sure to set the following environment variables:

**Backend (.env)**:
```
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**:
```
VITE_SERVER_URL=http://localhost:3000
```

## Benefits

1. **Security**: HTTP-only cookies provide better security than localStorage
2. **Automatic Management**: No need to manually handle token storage/retrieval
3. **Type Safety**: Proper TypeScript-like patterns with user type checking
4. **User Experience**: Seamless authentication flow with proper error handling
5. **Scalability**: Easy to extend with additional authentication features
