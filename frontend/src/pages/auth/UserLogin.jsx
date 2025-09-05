 
import '../../styles/auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserLogin({SERVER_URL}){
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/user/login`, {
        email: document.getElementById('user-email').value,
        password: document.getElementById('user-password').value
      },{withCredentials:true});
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      // Show error message to user
    }
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

        <form className="auth-form" aria-label="User login form">
          <div>
            <label htmlFor="user-email">Email</label>
            <input id="user-email" className="input" type="email" placeholder="you@domain.com" />
          </div>

          <div>
            <label htmlFor="user-password">Password</label>
            <input id="user-password" className="input" type="password" placeholder="••••••••" />
          </div>

          <div className="actions">
            <button type="button" className="btn" onClick={handleLogin}>Sign in</button>
            <button type="button" className="btn ghost">Forgot?</button>
          </div>

          <div className="helper" style={{marginTop:8}}>
            New here? <span className="links"><a href="/user/register">Create an account</a></span>
          </div>
        </form>
      </div>
    </div>
  );
}