import React from 'react';
import Button from './Button';
import Icon from '../AppIcon';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Xác nhận", 
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  type = "warning", // warning, danger, info, success
  isLoading = false
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'AlertTriangle',
          iconColor: 'text-red-500',
          confirmVariant: 'destructive'
        };
      case 'success':
        return {
          icon: 'CheckCircle',
          iconColor: 'text-green-500',
          confirmVariant: 'default'
        };
      case 'warning':
        return {
          icon: 'AlertTriangle',
          iconColor: 'text-yellow-500',
          confirmVariant: 'default'
        };
      default:
        return {
          icon: 'Info',
          iconColor: 'text-blue-500',
          confirmVariant: 'default'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Icon 
            name={typeStyles.icon} 
            size={24} 
            className={typeStyles.iconColor}
          />
          <h3 className="text-lg font-semibold text-foreground">
            {title}
          </h3>
        </div>
        
        {/* Message */}
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {message}
        </p>
        
        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={typeStyles.confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
            iconName={isLoading ? "Loader2" : undefined}
            iconPosition="left"
            className={isLoading ? "animate-spin" : ""}
          >
            {isLoading ? "Đang xử lý..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
