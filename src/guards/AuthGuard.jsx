import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';

const AuthGuard = ({ children, fallback = null }) => {
  const location = useLocation();
  const { user, loading } = useSupabase();

  if (loading) {
    return fallback || (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Đang kiểm tra trạng thái đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;
