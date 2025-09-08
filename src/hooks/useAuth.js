import { useNavigate, useLocation } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useSupabase();

  const isAuthenticated = !!user;

  const requireAuth = (callback) => {
    if (!isAuthenticated) {
      // Store current location to redirect back after login
      navigate('/login', { 
        state: { from: location },
        replace: false 
      });
      return false;
    }
    
    if (callback) {
      callback();
    }
    return true;
  };

  const showLoginPrompt = () => {
    return !isAuthenticated;
  };

  const redirectToLogin = (customReturnPath) => {
    const returnPath = customReturnPath || location.pathname + location.search;
    navigate('/login', { 
      state: { from: { pathname: returnPath } },
      replace: false 
    });
  };

  return {
    user,
    loading,
    isAuthenticated,
    requireAuth,
    showLoginPrompt,
    redirectToLogin
  };
};
