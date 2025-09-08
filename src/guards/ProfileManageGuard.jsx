import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';

const ProfileManageGuard = ({ children }) => {
  const location = useLocation();
  const { user, loading } = useSupabase();

  if (loading) return null; // Optionally render a spinner

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProfileManageGuard;
