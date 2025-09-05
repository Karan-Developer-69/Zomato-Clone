import React, { useState } from 'react';
import '../../styles/auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function PartnerRegister({SERVER_URL}) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setIsLoading(true);
    try {
    const response = await axios.post(`${SERVER_URL}/api/auth/food-partner/register`, {
      name: document.getElementById('partner-business').value,
      contactName: document.getElementById('partner-contact-name').value,
      phone: document.getElementById('partner-phone').value,
      address: document.getElementById('partner-address').value,
      email: document.getElementById('partner-email').value,
      password: document.getElementById('partner-password').value
    },{withCredentials:true});
    navigate('/create-food');
    } catch (error) {
      console.error('Registration failed:', error);
      // Show error message to user
    } finally {
      setIsLoading(false);
    }
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

        <form className="auth-form" aria-label="Partner register form">
          <div>
            <label htmlFor="partner-business">Business name</label>
            <input id="partner-business" className="input" type="text" placeholder="Restaurant name" />
          </div>

          <div>
            <label htmlFor="partner-contact-name">Contact name</label>
            <input id="partner-contact-name" className="input" type="text" placeholder="Primary contact person" />
          </div>

          <div>
            <label htmlFor="partner-phone">Phone</label>
            <input id="partner-phone" className="input" type="tel" placeholder="+91 98765 43210" />
          </div>

          <div>
            <label htmlFor="partner-address">Address</label>
            <input id="partner-address" className="input" type="text" placeholder="Street, city, ZIP" />
          </div>

          <div>
            <label htmlFor="partner-email">Email</label>
            <input id="partner-email" className="input" type="email" placeholder="business@domain.com" />
          </div>

          <div>
            <label htmlFor="partner-password">Password</label>
            <input id="partner-password" className="input" type="password" placeholder="Choose a password" />
          </div>

          <div className="actions">
            <button type="button" className="btn" onClick={handleRegister} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Create account'}
            </button>
            <button type="button" className="btn ghost">Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}