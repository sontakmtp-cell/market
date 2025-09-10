import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { useSupabase } from '../../../contexts/SupabaseContext';

const LoginForm = ({ onLanguageChange, currentLanguage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithPassword, signInWithProvider } = useSupabase();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/freelancer-dashboard';

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = currentLanguage === 'vi' ? 'Vui lòng nhập email' : 'Please enter email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = currentLanguage === 'vi' ? 'Email không hợp lệ' : 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = currentLanguage === 'vi' ? 'Vui lòng nhập mật khẩu' : 'Please enter password';
    } else if (formData.password.length < 6) {
      newErrors.password = currentLanguage === 'vi' ? 'Mật khẩu tối thiểu 6 ký tự' : 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const { error } = await signInWithPassword(formData.email, formData.password);
      if (error) {
        setErrors({ general: currentLanguage === 'vi' ? 'Email hoặc mật khẩu không đúng.' : 'Invalid email or password.' });
      } else {
        if (formData.rememberMe) localStorage.setItem('rememberLogin', 'true');
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      setErrors({ general: err?.message || 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    try {
      const { error } = await signInWithProvider(provider, {
        redirectTo: window.location.origin + redirectTo,
      });
      if (error) setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-elevation-2 p-8 border border-border">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Zap" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {currentLanguage === 'vi' ? 'Đăng nhập' : 'Sign In'}
          </h1>
          <p className="text-muted-foreground">
            {currentLanguage === 'vi' ? 'Truy cập vào nền tảng dịch vụ kỹ thuật của bạn' : 'Access your technical services platform'}
          </p>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <p className="text-sm text-error">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={currentLanguage === 'vi' ? 'Email' : 'Email Address'}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={currentLanguage === 'vi' ? 'Nhập email của bạn' : 'Enter your email'}
            error={errors.email}
            required
            disabled={isLoading}
          />

          <Input
            label={currentLanguage === 'vi' ? 'Mật khẩu' : 'Password'}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={currentLanguage === 'vi' ? 'Nhập mật khẩu' : 'Enter your password'}
            error={errors.password}
            required
            disabled={isLoading}
          />

          <div className="flex items-center justify-between">
            <Checkbox
              label={currentLanguage === 'vi' ? 'Ghi nhớ đăng nhập' : 'Remember me'}
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              disabled={isLoading}
            />

            <button
              type="button"
              className="text-sm text-primary hover:text-primary/80 transition-smooth"
              onClick={() => navigate('/forgot-password')}
            >
              {currentLanguage === 'vi' ? 'Quên mật khẩu?' : 'Forgot password?'}
            </button>
          </div>

          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            iconName="LogIn"
            iconPosition="right"
          >
            {currentLanguage === 'vi' ? 'Đăng nhập' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-border"></div>
          <span className="px-4 text-sm text-muted-foreground">
            {currentLanguage === 'vi' ? 'hoặc' : 'or'}
          </span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <Button
            variant="outline"
            fullWidth
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            iconName="Chrome"
            iconPosition="left"
          >
            {currentLanguage === 'vi' ? 'Tiếp tục với Google' : 'Continue with Google'}
          </Button>

          <Button
            variant="outline"
            fullWidth
            onClick={() => handleSocialLogin('github')}
            disabled={isLoading}
            iconName="Github"
            iconPosition="left"
          >
            {currentLanguage === 'vi' ? 'Tiếp tục với GitHub' : 'Continue with GitHub'}
          </Button>

          {/* Temporarily hidden Facebook login button */}
          {/* <Button
            variant="outline"
            fullWidth
            onClick={() => handleSocialLogin('facebook')}
            disabled={isLoading}
            iconName="Facebook"
            iconPosition="left"
          >
            {currentLanguage === 'vi' ? 'Tiếp tục với Facebook' : 'Continue with Facebook'}
          </Button> */}
        </div>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {currentLanguage === 'vi' ? 'Chưa có tài khoản?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-primary hover:text-primary/80 font-medium transition-smooth"
            >
              {currentLanguage === 'vi' ? 'Đăng ký ngay' : 'Create account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

