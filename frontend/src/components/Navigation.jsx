import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <nav style={{ 
        padding: '1rem 2rem', 
        backgroundColor: '#fff', 
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>
          Zomato-S
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/user/login')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            User Login
          </button>
          <button 
            onClick={() => navigate('/food-partner/login')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Partner Login
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav style={{ 
      padding: '1rem 2rem', 
      backgroundColor: '#fff', 
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>
        Zomato-S
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: '#6b7280' }}>
          Welcome, {user?.fullName || user?.name}
        </span>
        <span style={{ 
          fontSize: '0.75rem', 
          backgroundColor: user?.type === 'user' ? '#10b981' : '#3b82f6',
          color: 'white',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.25rem'
        }}>
          {user?.type === 'user' ? 'User' : 'Food Partner'}
        </span>
        
        {user?.type === 'user' && (
          <button 
            onClick={() => navigate('/saved')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Saved
          </button>
        )}
        
        {user?.type === 'foodPartner' && (
          <button 
            onClick={() => navigate('/create')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Create Food
          </button>
        )}
        
        <button 
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
