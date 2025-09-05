import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingDeadlines = () => {
  const deadlines = [
    {
      id: 1,
      projectTitle: 'Thiết kế hệ thống cầu trục 10 tấn',
      clientName: 'Công ty TNHH Cơ khí Việt Nam',
      deliverable: 'Bản vẽ thiết kế chi tiết và tính toán kết cấu',
      deadline: '2025-01-08',
      priority: 'high',
      progress: 75,
      daysLeft: 3
    },
    {
      id: 2,
      projectTitle: 'Tính toán kết cấu thép nhà xưởng',
      clientName: 'Công ty Xây dựng Đại Phát',
      deliverable: 'Báo cáo tính toán và bản vẽ kết cấu',
      deadline: '2025-01-12',
      priority: 'medium',
      progress: 60,
      daysLeft: 7
    },
    {
      id: 3,
      projectTitle: 'Thiết kế hệ thống băng tải',
      clientName: 'Nhà máy Sản xuất ABC',
      deliverable: 'Bản vẽ lắp ráp và danh mục vật tư',
      deadline: '2025-01-15',
      priority: 'low',
      progress: 40,
      daysLeft: 10
    }
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-error',
      medium: 'text-warning',
      low: 'text-success'
    };
    return colors?.[priority] || colors?.medium;
  };

  const getPriorityBg = (priority) => {
    const colors = {
      high: 'bg-error/10 border-error/20',
      medium: 'bg-warning/10 border-warning/20',
      low: 'bg-success/10 border-success/20'
    };
    return colors?.[priority] || colors?.medium;
  };

  const getDaysLeftColor = (days) => {
    if (days <= 3) return 'text-error';
    if (days <= 7) return 'text-warning';
    return 'text-success';
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={20} className="text-warning" />
          <h3 className="text-lg font-semibold text-foreground">Deadline sắp tới</h3>
        </div>
        <Button variant="ghost" size="sm" iconName="Plus" iconPosition="left">
          Thêm lịch
        </Button>
      </div>
      <div className="divide-y divide-border">
        {deadlines?.map((item) => (
          <div key={item?.id} className={`p-4 border-l-4 ${getPriorityBg(item?.priority)}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-foreground mb-1">{item?.projectTitle}</h4>
                <p className="text-sm text-muted-foreground mb-2">{item?.clientName}</p>
                <p className="text-sm text-foreground">{item?.deliverable}</p>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${getDaysLeftColor(item?.daysLeft)}`}>
                  {item?.daysLeft} ngày
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(item?.deadline)}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Tiến độ</span>
                <span className="text-sm font-medium text-foreground">{item?.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    item?.progress >= 80 ? 'bg-success' : 
                    item?.progress >= 50 ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${item?.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-1 ${getPriorityColor(item?.priority)}`}>
                <Icon name="AlertCircle" size={14} />
                <span className="text-sm font-medium">
                  {item?.priority === 'high' ? 'Ưu tiên cao' : 
                   item?.priority === 'medium' ? 'Ưu tiên trung bình' : 'Ưu tiên thấp'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" iconName="MessageSquare" iconPosition="left">
                  Nhắn tin
                </Button>
                <Button variant="default" size="sm" iconName="Upload" iconPosition="left">
                  Nộp bài
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Calendar" size={16} />
          <span>Xem lịch làm việc đầy đủ</span>
          <Icon name="ExternalLink" size={14} />
        </div>
      </div>
    </div>
  );
};

export default UpcomingDeadlines;