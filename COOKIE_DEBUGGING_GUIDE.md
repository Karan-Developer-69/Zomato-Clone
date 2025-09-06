# Cookie Debugging Guide

## Issue: Cookies Not Saving

### Root Cause
The main issue was that we were trying to access httpOnly cookies from the frontend JavaScript, which is not possible for security reasons. The authentication token is set by the backend as an httpOnly cookie, which means it cannot be read by JavaScript.

### Solution Implemented

1. **Separated Cookie Types:**
   - **httpOnly cookies**: Authentication tokens (set by backend, not accessible by frontend)
   - **Regular cookies**: User info and other data (accessible by frontend)

2. **Updated Authentication Flow:**
   - Backend sets httpOnly token cookie automatically
   - Frontend stores user info in regular cookies for persistence
   - All API calls include credentials to send httpOnly cookies

3. **Fixed Cookie Management:**
   - Removed attempts to read httpOnly cookies from frontend
   - Updated cookie utilities to handle different cookie types properly
   - Added proper error handling for cookie operations

## Testing the Fix

### 1. Cookie Test Component
A test component has been added to verify cookie functionality:

```jsx
// Located at: frontend/src/components/CookieTest.jsx
// Temporarily added to Home page for testing
```

**How to test:**
1. Open the application
2. Look for the "Cookie Test Component" on the home page
3. Enter a test value and click "Save Cookie"
4. Refresh the page - the value should persist
5. Check "All Cookies" section to see all stored cookies

### 2. Authentication Testing
1. **Register/Login**: Should work and set both httpOnly token and user info cookie
2. **Page Refresh**: User should stay logged in
3. **Logout**: Should clear user info cookie (token cleared by backend)

### 3. Browser Developer Tools
1. Open Developer Tools (F12)
2. Go to Application/Storage tab
3. Check Cookies section
4. You should see:
   - `token` (httpOnly) - set by backend
   - `userInfo` (regular) - set by frontend

## Debugging Steps

### 1. Check Console for Errors
```javascript
// Open browser console and look for:
// - Cookie-related errors
// - Authentication errors
// - Network request failures
```

### 2. Verify Cookie Settings
```javascript
// In browser console:
console.log('All cookies:', document.cookie);
console.log('User info:', cookieUtils.getJsonCookie('userInfo'));
```

### 3. Check Network Requests
1. Open Network tab in Developer Tools
2. Make a login request
3. Check if cookies are being set in response headers
4. Verify subsequent requests include cookies

### 4. Test Cookie Persistence
1. Login to the application
2. Close browser completely
3. Reopen browser and navigate to the app
4. User should still be logged in

## Common Issues and Solutions

### Issue 1: Cookies Not Persisting After Page Refresh
**Solution:** Check if cookies are being set with proper options:
```javascript
cookieUtils.setJsonCookie('userInfo', userData, { 
  expires: 7,
  path: '/',
  sameSite: 'lax'
});
```

### Issue 2: Authentication Fails After Page Refresh
**Solution:** Ensure the backend `/api/auth/status` endpoint is working and returns proper user data.

### Issue 3: CORS Issues
**Solution:** Verify backend CORS configuration includes credentials:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
  secure: process.env.NODE_ENV === 'production'
}));
```

### Issue 4: Cookies Not Sent with Requests
**Solution:** Ensure axios is configured with credentials:
```javascript
axios.defaults.withCredentials = true;
// or
config.withCredentials = true;
```

## Cookie Types Explained

### 1. HttpOnly Cookies (Backend Set)
- **Purpose**: Store authentication tokens securely
- **Access**: Only accessible by server, not JavaScript
- **Security**: Prevents XSS attacks from stealing tokens
- **Example**: `token` cookie

### 2. Regular Cookies (Frontend Set)
- **Purpose**: Store user preferences and non-sensitive data
- **Access**: Accessible by JavaScript
- **Security**: Less secure, don't store sensitive data
- **Example**: `userInfo` cookie

## Best Practices

1. **Use httpOnly for sensitive data** (tokens, session IDs)
2. **Use regular cookies for UI preferences** (theme, language)
3. **Always set proper cookie options** (expires, path, sameSite)
4. **Handle cookie errors gracefully**
5. **Test on different browsers and devices**

## Verification Checklist

- [ ] Cookie test component works
- [ ] User can register/login
- [ ] User stays logged in after page refresh
- [ ] User can logout successfully
- [ ] No console errors related to cookies
- [ ] Network requests include proper cookies
- [ ] CORS configuration is correct
- [ ] Backend sets httpOnly cookies properly

## Remove Test Component

Once testing is complete, remove the CookieTest component:

1. Remove import from Home.jsx
2. Remove `<CookieTest />` from JSX
3. Delete the CookieTest.jsx file

The cookie functionality should now work properly with the corrected implementation.
