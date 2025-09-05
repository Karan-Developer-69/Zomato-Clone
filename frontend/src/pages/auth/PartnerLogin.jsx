 
import '../../styles/auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PartnerLogin({SERVER_URL}) {

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/food-partner/login`, {
        email: document.getElementById('partner-email').value,
        password: document.getElementById('partner-password').value
      }, { withCredentials: true });

      navigate('/create-food');
    } catch (error) {
      console.error('Login failed:', error);
      // Show error message to user
    }
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

        <form className="auth-form" aria-label="Partner login form">
          <div>
            <label htmlFor="partner-email">Email</label>
            <input id="partner-email" className="input" type="email" placeholder="partner@business.com" />
          </div>

          <div>
            <label htmlFor="partner-password">Password</label>
            <input id="partner-password" className="input" type="password" placeholder="••••••••" />
          </div>

          <div className="actions">
            <button type="button" className="btn" onClick={handleLogin}>Sign in</button>
            <button type="button" className="btn ghost">Need help?</button>
          </div>

          <div className="helper" style={{marginTop:8}}>
            New partner? <span className="links"><a href="/food-partner/register">Create partner account</a></span>
          </div>
        </form>
      </div>
    </div>
  );
}