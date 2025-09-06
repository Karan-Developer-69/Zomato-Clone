import { Navigate } from 'react-router-dom';
import { useRequireAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requireUser = false, requireFoodPartner = false }) => {
  const { isAuthenticated, isLoading, user, redirectTo } = useRequireAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check specific user type requirements
  if (requireUser && user?.type !== 'user') {
    return <Navigate to="/user/login" replace />;
  }

  if (requireFoodPartner && user?.type !== 'foodPartner') {
    return <Navigate to="/food-partner/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
