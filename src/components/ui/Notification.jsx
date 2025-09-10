// src/components/ui/Notification.jsx
import React, { useEffect } from 'react';
import Icon from '../AppIcon';

const Notification = ({ 
  message, 
  type = 'info', 
  isVisible = false, 
  onClose,
  autoClose = true,
  duration = 5000 
}) => {
  // Tự động đóng thông báo sau một khoảng thời gian
  useEffect(() => {
    if (isVisible && autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, onClose, duration]);

  // Định nghĩa style dựa trên type
  const getNotificationStyle = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-50 border-green-200',
          iconColor: 'text-green-600',
          textColor: 'text-green-800',
          icon: 'Check'
        };
      case 'error':
        return {
          bgColor: 'bg-red-50 border-red-200',
          iconColor: 'text-red-600',
          textColor: 'text-red-800',
          icon: 'X'
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-50 border-yellow-200',
          iconColor: 'text-yellow-600',
          textColor: 'text-yellow-800',
          icon: 'AlertTriangle'
        };
      default:
        return {
          bgColor: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-800',
          icon: 'Info'
        };
    }
  };

  const style = getNotificationStyle();

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full">
      <div className={`p-4 rounded-lg border shadow-lg ${style.bgColor} transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon 
              name={style.icon} 
              size={20} 
              className={style.iconColor}
            />
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${style.textColor}`}>
              {message}
            </p>
          </div>
          {onClose && (
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={onClose}
                className={`rounded-md inline-flex ${style.textColor} hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white p-1`}
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;