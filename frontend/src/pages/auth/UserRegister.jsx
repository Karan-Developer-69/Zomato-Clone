 
import '../../styles/auth.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

export default function UserRegister({SERVER_URL}){
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const fullName = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;

    if (!fullName || !email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = await register({ fullName, email, password }, 'user');
    
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
        <h1>Create your account</h1>
        <p>Join as a food lover and start saving favourite places.</p>
      </div>

      <div className="auth-card" role="region" aria-labelledby="user-register">
        <div className="brand">
          <div className="logo">U</div>
          <div>
            <div style={{fontWeight:700}}>User</div>
            <div style={{fontSize:13,color:'var(--muted)'}}>Register</div>
          </div>
        </div>

        <form className="auth-form" aria-label="User register form" onSubmit={handleRegister}>
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
            <label htmlFor="user-name">Full name</label>
            <input 
              id="user-name" 
              className="input" 
              type="text" 
              placeholder="Your name" 
              required 
              disabled={isLoading}
            />
          </div>

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
              placeholder="Choose a password" 
              required 
              disabled={isLoading}
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
            <button type="button" className="btn ghost" disabled={isLoading}>Sign in</button>
          </div>
        </form>

      </div>
    </div>
  );
}