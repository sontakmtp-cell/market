import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../../contexts/SupabaseContext';
import LoginForm from './components/LoginForm';
import RoleIndicator from './components/RoleIndicator';
import LanguageToggle from './components/LanguageToggle';
import LoginBackground from './components/LoginBackground';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useSupabase();
  const [currentLanguage, setCurrentLanguage] = useState('vi');

  useEffect(() => {
    // Redirect if already authenticated via Supabase
    if (!loading && user) {
      navigate('/job-marketplace');
      return;
    }

    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'vi';
    setCurrentLanguage(savedLanguage);
  }, [loading, user, navigate]);

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferredLanguage', language);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Language Toggle */}
      <LanguageToggle 
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
      {/* Left Side - Login Form */}
      <div className="flex-1 lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto">
          {/* Role Indicators */}
          <div className="mb-8">
            <RoleIndicator currentLanguage={currentLanguage} />
          </div>

          {/* Login Form */}
          <LoginForm 
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
          />

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex justify-center space-x-6 text-sm">
              <button
                onClick={() => navigate('/homepage')}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                {currentLanguage === 'vi' ? 'Về trang chủ' : 'Back to Home'}
              </button>
              <button
                onClick={() => navigate('/job-marketplace')}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                {currentLanguage === 'vi' ? 'Khám phá việc làm' : 'Explore Jobs'}
              </button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              © {new Date()?.getFullYear()} TechMarketplace Pro. 
              {currentLanguage === 'vi' ? ' Bảo lưu mọi quyền.' : ' All rights reserved.'}
            </div>
          </div>
        </div>
      </div>
      {/* Right Side - Background Image */}
      <LoginBackground />
    </div>
  );
};

export default LoginPage;
