import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes, FaUser, FaStore, FaSignOutAlt, FaBookmark, FaPlus } from 'react-icons/fa';
import '../styles/navigation.css';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <nav className="navigation">
        <div className="nav-brand">
          <span className="brand-text">Zomato-S</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="nav-menu desktop-menu">
          <button 
            className="nav-btn secondary"
            onClick={() => navigate('/user/login')}
          >
            <FaUser />
            <span>User Login</span>
          </button>
          <button 
            className="nav-btn primary"
            onClick={() => navigate('/food-partner/login')}
          >
            <FaStore />
            <span>Partner Login</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-menu-header">
                <span className="brand-text">Zomato-S</span>
                <button 
                  className="close-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="mobile-menu-content">
                <button 
                  className="mobile-menu-item"
                  onClick={() => handleNavigation('/user/login')}
                >
                  <FaUser />
                  <span>User Login</span>
                </button>
                <button 
                  className="mobile-menu-item"
                  onClick={() => handleNavigation('/food-partner/login')}
                >
                  <FaStore />
                  <span>Partner Login</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <span className="brand-text">Zomato-S</span>
      </div>
      
      {/* Desktop Menu */}
      <div className="nav-menu desktop-menu">
        <div className="user-info">
          <span className="welcome-text">
            Welcome, {user?.fullName || user?.name}
          </span>
          <span className={`user-type ${user?.type}`}>
            {user?.type === 'user' ? 'User' : 'Food Partner'}
          </span>
        </div>
        
        {user?.type === 'user' && (
          <button 
            className="nav-btn secondary"
            onClick={() => navigate('/saved')}
          >
            <FaBookmark />
            <span>Saved</span>
          </button>
        )}
        
        {user?.type === 'foodPartner' && (
          <button 
            className="nav-btn secondary"
            onClick={() => navigate('/create')}
          >
            <FaPlus />
            <span>Create Food</span>
          </button>
        )}
        
        <button 
          className="nav-btn danger"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="user-profile">
                <span className="brand-text">Zomato-S</span>
                <div className="user-details">
                  <span className="welcome-text">
                    {user?.fullName || user?.name}
                  </span>
                  <span className={`user-type ${user?.type}`}>
                    {user?.type === 'user' ? 'User' : 'Food Partner'}
                  </span>
                </div>
              </div>
              <button 
                className="close-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="mobile-menu-content">
              {user?.type === 'user' && (
                <button 
                  className="mobile-menu-item"
                  onClick={() => handleNavigation('/saved')}
                >
                  <FaBookmark />
                  <span>Saved</span>
                </button>
              )}
              
              {user?.type === 'foodPartner' && (
                <button 
                  className="mobile-menu-item"
                  onClick={() => handleNavigation('/create')}
                >
                  <FaPlus />
                  <span>Create Food</span>
                </button>
              )}
              
              <button 
                className="mobile-menu-item danger"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
