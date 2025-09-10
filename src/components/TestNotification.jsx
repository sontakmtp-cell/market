// src/components/TestNotification.jsx
import React from 'react';
import Button from './ui/Button';
import Notification from './ui/Notification';
import useNotification from '../hooks/useNotification';

const TestNotification = () => {
  const { notification, showSuccess, showError, showWarning, showInfo, closeNotification } = useNotification();

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-xl font-bold">Test Notifications</h2>
      
      <div className="space-x-4">
        <Button 
          onClick={() => showSuccess('Thành công!')}
          className="bg-green-600 hover:bg-green-700"
        >
          Test Success
        </Button>
        
        <Button 
          onClick={() => showError('Có lỗi xảy ra!')}
          className="bg-red-600 hover:bg-red-700"
        >
          Test Error
        </Button>
        
        <Button 
          onClick={() => showWarning('Cảnh báo!')}
          className="bg-yellow-600 hover:bg-yellow-700"
        >
          Test Warning
        </Button>
        
        <Button 
          onClick={() => showInfo('Thông tin!')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Test Info
        </Button>
      </div>

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={closeNotification}
      />
    </div>
  );
};

export default TestNotification;
