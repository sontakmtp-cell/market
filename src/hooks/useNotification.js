// src/hooks/useNotification.js
import { useState } from 'react';

const useNotification = () => {
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'info'
  });

  const showNotification = (message, type = 'info') => {
    setNotification({
      isVisible: true,
      message,
      type
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const showSuccess = (message) => showNotification(message, 'success');
  const showError = (message) => showNotification(message, 'error');
  const showWarning = (message) => showNotification(message, 'warning');
  const showInfo = (message) => showNotification(message, 'info');

  return {
    notification,
    showNotification,
    closeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useNotification;
