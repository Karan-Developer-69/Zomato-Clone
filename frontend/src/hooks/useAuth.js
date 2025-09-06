import { useAuth as useAuthContext } from '../contexts/AuthContext';

// Re-export the useAuth hook from context for convenience
export const useAuth = useAuthContext;

// Custom hook for protected routes
export const useRequireAuth = (redirectTo = '/user/login') => {
  const { isAuthenticated, isLoading, user,foodPartner } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    user,
    foodPartner,
    redirectTo
  };
};

// Custom hook for user-specific operations
export const useUserAuth = () => {
  const { user, isAuthenticated, login, register, logout, foodPartner } = useAuth();
  
  const isUser = user && ture;
  const isFoodPartner = foodPartner && true;
  
  return {
    user,
    isAuthenticated,
    isUser,
    isFoodPartner,
    login,
    register,
    logout
  };
};
