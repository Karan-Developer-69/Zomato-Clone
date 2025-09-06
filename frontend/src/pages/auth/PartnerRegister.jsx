import React, { useState } from 'react';
import '../../styles/auth.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function PartnerRegister({SERVER_URL}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const name = document.getElementById('partner-business').value;
    const contactName = document.getElementById('partner-contact-name').value;
    const phone = document.getElementById('partner-phone').value;
    const address = document.getElementById('partner-address').value;
    const email = document.getElementById('partner-email').value;
    const password = document.getElementById('partner-password').value;

    if (!name || !contactName || !phone || !address || !email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = await register({ name, contactName, phone, address, email, password }, 'foodPartner');
    
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
        <h1>Partner onboarding</h1>
        <p>Register your restaurant to start receiving orders.</p>
      </div>

      <div className="auth-card" role="region" aria-labelledby="partner-register">
        <div className="brand">
          <div className="logo">P</div>
          <div>
            <div style={{fontWeight:700}}>Food-Partner</div>
            <div style={{fontSize:13,color:'var(--muted)'}}>Register</div>
          </div>
        </div>

        <form className="auth-form" aria-label="Partner register form" onSubmit={handleRegister}>
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
            <label htmlFor="partner-business">Business name</label>
            <input 
              id="partner-business" 
              className="input" 
              type="text" 
              placeholder="Restaurant name" 
              required 
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="partner-contact-name">Contact name</label>
            <input 
              id="partner-contact-name" 
              className="input" 
              type="text" 
              placeholder="Primary contact person" 
              required 
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="partner-phone">Phone</label>
            <input 
              id="partner-phone" 
              className="input" 
              type="tel" 
              placeholder="+91 98765 43210" 
              required 
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="partner-address">Address</label>
            <input 
              id="partner-address" 
              className="input" 
              type="text" 
              placeholder="Street, city, ZIP" 
              required 
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="partner-email">Email</label>
            <input 
              id="partner-email" 
              className="input" 
              type="email" 
              placeholder="business@domain.com" 
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
              placeholder="Choose a password" 
              required 
              disabled={isLoading}
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
            <button type="button" className="btn ghost" disabled={isLoading}>Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}