 
import '../../styles/auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserRegister({SERVER_URL}){

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/user/register`, {
        fullName: document.getElementById('user-name').value,
        email: document.getElementById('user-email').value,
        password: document.getElementById('user-password').value
      },{withCredentials:true});
      // Redirect or show success message
      navigate('/')
    } catch (error) {
      console.error('Registration failed:', error);
      // Show error message to user
    }
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

        <form className="auth-form" aria-label="User register form">
          <div>
            <label htmlFor="user-name">Full name</label>
            <input id="user-name" className="input" type="text" placeholder="Your name" />
          </div>

          <div>
            <label htmlFor="user-email">Email</label>
            <input id="user-email" className="input" type="email" placeholder="you@domain.com" />
          </div>

          <div>
            <label htmlFor="user-password">Password</label>
            <input id="user-password" className="input" type="password" placeholder="Choose a password" />
          </div>

          <div className="actions">
            <button type="button" className="btn" onClick={handleRegister}>Create account</button>
            <button type="button" className="btn ghost">Sign in</button>
          </div>
        </form>

      </div>
    </div>
  );
}