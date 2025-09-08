import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './AppIcon';
import Button from './ui/Button';

const LoginPrompt = ({ 
  title = "Đăng nhập để tiếp tục", 
  message = "Bạn cần đăng nhập để sử dụng tính năng này",
  actionText = "tương tác với bài đăng",
  size = "default",
  className = ""
}) => {
  const sizeClasses = {
    sm: "p-3",
    default: "p-4", 
    lg: "p-6"
  };

  const iconSize = {
    sm: 16,
    default: 20,
    lg: 24
  };

  return (
    <div className={`bg-primary/5 border border-primary/20 rounded-lg ${sizeClasses[size]} ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Icon name="Lock" size={iconSize[size]} className="text-primary mt-0.5" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-foreground text-sm">{title}</h4>
          <p className="text-muted-foreground text-xs mt-1">
            {message}
          </p>
          <div className="flex items-center space-x-2 mt-3">
            <Link to="/login">
              <Button variant="default" size="sm">
                <Icon name="LogIn" size={14} className="mr-1" />
                Đăng nhập
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="sm">
                Đăng ký
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
