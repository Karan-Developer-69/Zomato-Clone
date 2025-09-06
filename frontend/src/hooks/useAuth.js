import { useAuth as useAuthContext } from '../contexts/AuthContext';

// Re-export the useAuth hook from context for convenience
export const useAuth = useAuthContext;

// Custom hook for protected routes
export const useRequireAuth = (redirectTo = '/user/login') => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    user,
    redirectTo
  };
};

// Custom hook for user-specific operations
export const useUserAuth = () => {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  
  const isUser = user?.type === 'user';
  const isFoodPartner = user?.type === 'foodPartner';
  
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
