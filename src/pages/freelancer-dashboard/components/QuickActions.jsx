import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const quickActions = [
    {
      id: 1,
      title: 'Tìm dự án mới',
      description: 'Khám phá các cơ hội việc làm phù hợp',
      icon: 'Search',
      color: 'primary',
      action: () => window.location.href = '/job-marketplace'
    },
    {
      id: 2,
      title: 'Cập nhật hồ sơ',
      description: 'Chỉnh sửa thông tin và portfolio',
      icon: 'User',
      color: 'accent',
      action: () => console.log('Update profile')
    },
    {
      id: 3,
      title: 'Quản lý đề xuất',
      description: 'Xem và chỉnh sửa các đề xuất đã gửi',
      icon: 'FileText',
      color: 'success',
      action: () => console.log('Manage proposals')
    },
    {
      id: 4,
      title: 'Thay đổi trạng thái',
      description: 'Cập nhật tình trạng sẵn sàng làm việc',
      icon: 'ToggleLeft',
      color: 'warning',
      action: () => console.log('Change availability')
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
      success: 'bg-success text-success-foreground hover:bg-success/90',
      warning: 'bg-warning text-warning-foreground hover:bg-warning/90'
    };
    return colors?.[color] || colors?.primary;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Zap" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Thao tác nhanh</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions?.map((action) => (
          <button
            key={action?.id}
            onClick={action?.action}
            className={`p-4 rounded-lg transition-smooth text-left ${getColorClasses(action?.color)}`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <Icon name={action?.icon} size={20} />
              <h4 className="font-semibold">{action?.title}</h4>
            </div>
            <p className="text-sm opacity-90">{action?.description}</p>
          </button>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-foreground">Trạng thái làm việc</h4>
            <p className="text-sm text-muted-foreground">Hiện tại: Sẵn sàng nhận dự án mới</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-sm text-success font-medium">Hoạt động</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" iconName="Settings" iconPosition="left">
            Cài đặt
          </Button>
          <Button variant="ghost" size="sm" iconName="Eye" iconPosition="left">
            Xem hồ sơ công khai
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;