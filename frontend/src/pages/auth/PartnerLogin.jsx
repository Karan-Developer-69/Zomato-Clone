 
import '../../styles/auth.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

export default function PartnerLogin({SERVER_URL}) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const email = document.getElementById('partner-email').value;
    const password = document.getElementById('partner-password').value;

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = await login(email, password, 'foodPartner');
    
    if (result.success) {
      navigate('/create');
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  }
  return (
    <div className="auth-wrapper">
      <div className="auth-hero">
        <h1>Partner sign in</h1>
        <p>Manage your restaurant, menus and orders.</p>
      </div>

      <div className="auth-card" role="region" aria-labelledby="partner-login">
        <div className="brand">
          <div className="logo">P</div>
          <div>
            <div style={{fontWeight:700}}>Food-Partner</div>
            <div style={{fontSize:13,color:'var(--muted)'}}>Sign in</div>
          </div>
        </div>

        <form className="auth-form" aria-label="Partner login form" onSubmit={handleLogin}>
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
            <label htmlFor="partner-email">Email</label>
            <input 
              id="partner-email" 
              className="input" 
              type="email" 
              placeholder="partner@business.com" 
              required 
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="partner-password">Password</label>
            <input 
              id="partner-password" 
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
            <button type="button" className="btn ghost" disabled={isLoading}>Need help?</button>
          </div>

          <div className="helper" style={{marginTop:8}}>
            New partner? <span className="links"><a href="/food-partner/register">Create partner account</a></span>
          </div>
        </form>
      </div>
    </div>
  );
}