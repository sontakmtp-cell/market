import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCenter = () => {
  const [notifications] = useState([
    {
      id: 1,
      type: 'job_match',
      title: 'Công việc phù hợp mới',
      message: 'Có 3 dự án thiết kế cơ khí phù hợp với kỹ năng của bạn',
      time: '5 phút trước',
      unread: true,
      icon: 'Briefcase',
      color: 'accent'
    },
    {
      id: 2,
      type: 'message',
      title: 'Tin nhắn từ khách hàng',
      message: 'Nguyễn Văn A đã gửi tin nhắn về dự án thiết kế nhà máy',
      time: '15 phút trước',
      unread: true,
      icon: 'MessageSquare',
      color: 'primary'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Thanh toán đã được xử lý',
      message: 'Bạn đã nhận được 15.000.000 VNĐ cho dự án hoàn thành',
      time: '1 giờ trước',
      unread: false,
      icon: 'DollarSign',
      color: 'success'
    },
    {
      id: 4,
      type: 'contract',
      title: 'Hợp đồng cần ký',
      message: 'Hợp đồng dự án thiết kế cầu trục đang chờ xác nhận',
      time: '2 giờ trước',
      unread: true,
      icon: 'FileText',
      color: 'warning'
    },
    {
      id: 5,
      type: 'review',
      title: 'Đánh giá mới',
      message: 'Bạn đã nhận được đánh giá 5 sao từ dự án vừa hoàn thành',
      time: '3 giờ trước',
      unread: false,
      icon: 'Star',
      color: 'success'
    }
  ]);

  const getIconColor = (color) => {
    const colors = {
      primary: 'text-primary',
      accent: 'text-accent',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error'
    };
    return colors?.[color] || colors?.primary;
  };

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Bell" size={20} className="text-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Thông báo</h3>
          {unreadCount > 0 && (
            <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" iconName="Settings" iconPosition="left">
          Cài đặt
        </Button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications?.map((notification) => (
          <div
            key={notification?.id}
            className={`p-4 border-b border-border last:border-b-0 hover:bg-muted transition-smooth cursor-pointer ${
              notification?.unread ? 'bg-accent/5' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${getIconColor(notification?.color)}`}>
                <Icon name={notification?.icon} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-sm font-medium ${notification?.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {notification?.title}
                  </h4>
                  {notification?.unread && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {notification?.message}
                </p>
                <span className="text-xs text-muted-foreground">{notification?.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border">
        <Button variant="ghost" fullWidth iconName="Eye" iconPosition="left">
          Xem tất cả thông báo
        </Button>
      </div>
    </div>
  );
};

export default NotificationCenter;