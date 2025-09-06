 
import '../../styles/auth.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

export default function UserLogin({SERVER_URL}){
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = await login(email, password, 'user');
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-hero">
        <h1>Welcome back</h1>
        <p>Sign in to your account to discover great food near you.</p>
      </div>

      <div className="auth-card" role="region" aria-labelledby="user-login">
        <div className="brand">
          <div className="logo">U</div>
          <div>
            <div style={{fontWeight:700}}>User</div>
            <div style={{fontSize:13,color:'var(--muted)'}}>Sign in</div>
          </div>
        </div>

        <form className="auth-form" aria-label="User login form" onSubmit={handleLogin}>
          {error && (
            <div style={{ 
              color: 'red', 
              marginBottom: '16px', 
              padding: '8px', 
              backgroundColor: '#ffe6e6', 
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="user-email">Email</label>
            <input 
              id="user-email" 
              className="input" 
              type="email" 
              placeholder="you@domain.com" 
              required 
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="user-password">Password</label>
            <input 
              id="user-password" 
              className="input" 
              type="password" 
              placeholder="••••••••" 
              required 
              disabled={isLoading}
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
            <button type="button" className="btn ghost" disabled={isLoading}>Forgot?</button>
          </div>

          <div className="helper" style={{marginTop:8}}>
            New here? <span className="links"><a href="/user/register">Create an account</a></span>
          </div>
        </form>
      </div>
    </div>
  );
}