// Cookie testing utility functions
import { cookieUtils } from './cookies';

export const testCookieFunctionality = () => {
  console.log('🍪 Testing Cookie Functionality...');
  
  // Test 1: Basic cookie operations
  console.log('\n1. Testing basic cookie operations:');
  
  // Set a test cookie
  cookieUtils.setCookie('testBasic', 'Hello World', { expires: 1 });
  const retrieved = cookieUtils.getCookie('testBasic');
  console.log('Set cookie:', 'testBasic=Hello World');
  console.log('Retrieved cookie:', retrieved);
  console.log('✅ Basic cookie test:', retrieved === 'Hello World' ? 'PASSED' : 'FAILED');
  
  // Test 2: JSON cookie operations
  console.log('\n2. Testing JSON cookie operations:');
  
  const testData = { name: 'John', age: 30, preferences: { theme: 'dark' } };
  cookieUtils.setJsonCookie('testJson', testData, { expires: 1 });
  const retrievedJson = cookieUtils.getJsonCookie('testJson');
  console.log('Set JSON cookie:', testData);
  console.log('Retrieved JSON cookie:', retrievedJson);
  console.log('✅ JSON cookie test:', JSON.stringify(retrievedJson) === JSON.stringify(testData) ? 'PASSED' : 'FAILED');
  
  // Test 3: Cookie existence check
  console.log('\n3. Testing cookie existence:');
  
  const exists = cookieUtils.hasCookie('testBasic');
  const notExists = cookieUtils.hasCookie('nonExistentCookie');
  console.log('testBasic exists:', exists);
  console.log('nonExistentCookie exists:', notExists);
  console.log('✅ Existence test:', exists && !notExists ? 'PASSED' : 'FAILED');
  
  // Test 4: Get all cookies
  console.log('\n4. Testing get all cookies:');
  
  const allCookies = cookieUtils.getAllCookies();
  console.log('All cookies:', allCookies);
  console.log('✅ All cookies test:', Object.keys(allCookies).length > 0 ? 'PASSED' : 'FAILED');
  
  // Test 5: Cookie deletion
  console.log('\n5. Testing cookie deletion:');
  
  cookieUtils.deleteCookie('testBasic');
  const afterDelete = cookieUtils.getCookie('testBasic');
  console.log('After deletion:', afterDelete);
  console.log('✅ Deletion test:', afterDelete === undefined ? 'PASSED' : 'FAILED');
  
  // Test 6: User info cookie (simulating auth)
  console.log('\n6. Testing user info cookie (auth simulation):');
  
  const userInfo = {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
    type: 'user'
  };
  
  cookieUtils.setJsonCookie('userInfo', userInfo, { 
    expires: 7,
    path: '/',
    sameSite: 'lax'
  });
  
  const retrievedUserInfo = cookieUtils.getJsonCookie('userInfo');
  console.log('Set user info:', userInfo);
  console.log('Retrieved user info:', retrievedUserInfo);
  console.log('✅ User info test:', JSON.stringify(retrievedUserInfo) === JSON.stringify(userInfo) ? 'PASSED' : 'FAILED');
  
  // Cleanup
  console.log('\n7. Cleaning up test cookies...');
  cookieUtils.deleteCookie('testJson');
  cookieUtils.deleteCookie('userInfo');
  
  console.log('\n🍪 Cookie functionality test completed!');
  console.log('If all tests passed, cookies are working correctly.');
  
  return {
    basicCookie: retrieved === 'Hello World',
    jsonCookie: JSON.stringify(retrievedJson) === JSON.stringify(testData),
    existence: exists && !notExists,
    allCookies: Object.keys(allCookies).length > 0,
    deletion: afterDelete === undefined,
    userInfo: JSON.stringify(retrievedUserInfo) === JSON.stringify(userInfo)
  };
};

// Auto-run test when imported (for debugging)
if (typeof window !== 'undefined') {
  // Only run in browser environment
  setTimeout(() => {
    console.log('🔍 Running automatic cookie test...');
    testCookieFunctionality();
  }, 1000);
}
