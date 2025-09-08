import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// In a real app, this would check with authentication state
// For now, we'll simulate a logged-in user
const ProfileManageGuard = ({ children }) => {
  const location = useLocation();
  
  // Check auth token - matching the login system
  const authToken = localStorage.getItem('authToken');
  const isAuthenticated = !!authToken;
  
  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProfileManageGuard;
