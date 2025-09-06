import { useState, useEffect } from 'react';
import { cookieUtils } from '../utils/cookies';

const CookieTest = () => {
  const [testValue, setTestValue] = useState('');
  const [savedValue, setSavedValue] = useState('');
  const [allCookies, setAllCookies] = useState({});

  useEffect(() => {
    // Load saved value on component mount
    const saved = cookieUtils.getJsonCookie('testCookie');
    if (saved) {
      setSavedValue(saved);
    }
    
    // Load all cookies
    setAllCookies(cookieUtils.getAllCookies());
  }, []);

  const handleSave = () => {
    if (testValue.trim()) {
      cookieUtils.setJsonCookie('testCookie', testValue, { 
        expires: 7,
        path: '/',
        sameSite: 'lax'
      });
      setSavedValue(testValue);
      setAllCookies(cookieUtils.getAllCookies());
      alert('Cookie saved successfully!');
    }
  };

  const handleClear = () => {
    cookieUtils.deleteCookie('testCookie', { path: '/', sameSite: 'lax' });
    setSavedValue('');
    setAllCookies(cookieUtils.getAllCookies());
    alert('Cookie cleared!');
  };

  const handleClearAll = () => {
    cookieUtils.clearAllCookies();
    setSavedValue('');
    setAllCookies({});
    alert('All cookies cleared!');
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      margin: '20px',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>Cookie Test Component</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="testInput">Test Value:</label>
        <input
          id="testInput"
          type="text"
          value={testValue}
          onChange={(e) => setTestValue(e.target.value)}
          placeholder="Enter test value"
          style={{ marginLeft: '10px', padding: '5px' }}
        />
        <button onClick={handleSave} style={{ marginLeft: '10px', padding: '5px 10px' }}>
          Save Cookie
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Saved Value:</strong> {savedValue || 'None'}
        <button onClick={handleClear} style={{ marginLeft: '10px', padding: '5px 10px' }}>
          Clear Cookie
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>All Cookies:</strong>
        <pre style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '12px',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          {JSON.stringify(allCookies, null, 2)}
        </pre>
      </div>

      <button onClick={handleClearAll} style={{ padding: '5px 10px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px' }}>
        Clear All Cookies
      </button>
    </div>
  );
};

export default CookieTest;
