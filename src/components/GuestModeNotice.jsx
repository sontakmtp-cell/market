import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './AppIcon';
import Button from './ui/Button';

const GuestModeNotice = ({ 
  title = "Chế độ xem khách", 
  message = "Bạn đang xem ở chế độ khách. Đăng nhập để sử dụng đầy đủ tính năng.",
  className = ""
}) => {
  return (
    <div className={`bg-amber-50 border border-amber-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Icon name="Info" size={20} className="text-amber-600 mt-0.5" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-amber-800 text-sm">{title}</h4>
          <p className="text-amber-700 text-xs mt-1">
            {message}
          </p>
          <div className="flex items-center space-x-2 mt-3">
            <Link to="/login">
              <Button variant="default" size="sm" className="bg-amber-600 hover:bg-amber-700">
                <Icon name="LogIn" size={14} className="mr-1" />
                Đăng nhập
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                Đăng ký
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestModeNotice;
