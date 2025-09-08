import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProjectCard = ({ project, userRole = 'freelancer' }) => {
  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-error text-error-foreground',
      medium: 'bg-warning text-warning-foreground',
      low: 'bg-success text-success-foreground'
    };
    return colors?.[priority] || colors?.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      'in-progress': 'text-accent',
      'review': 'text-warning',
      'completed': 'text-success',
      'pending': 'text-muted-foreground'
    };
    return colors?.[status] || colors?.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground">{project?.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project?.priority)}`}>
              {project?.priority === 'high' ? 'Cao' : project?.priority === 'medium' ? 'Trung bình' : 'Thấp'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {userRole === 'freelancer' 
              ? `Khách hàng: ${project?.clientName}`
              : `Freelancer: ${project?.freelancerName}`
            }
          </p>
          <p className="text-sm text-foreground">{project?.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{formatDate(project?.deadline)}</span>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Tiến độ</span>
          <span className="text-sm font-medium text-foreground">{project?.progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${project?.progress}%` }}
          ></div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="DollarSign" size={16} className="text-success" />
          <span className="text-sm font-medium text-foreground">
            {project?.budget?.toLocaleString('vi-VN')} VNĐ
          </span>
        </div>
        <div className={`flex items-center space-x-1 ${getStatusColor(project?.status)}`}>
          <Icon name="Clock" size={16} />
          <span className="text-sm font-medium">
            {project?.status === 'in-progress' ? 'Đang thực hiện' : 
             project?.status === 'review' ? 'Đang xem xét' :
             project?.status === 'completed' ? 'Hoàn thành' : 'Chờ xử lý'}
          </span>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Giao nộp tiếp theo:</p>
        <p className="text-sm text-foreground">{project?.nextDeliverable}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="MessageSquare" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{project?.messages} tin nhắn</span>
          <Icon name="Paperclip" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{project?.files} tệp</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="MessageSquare" iconPosition="left">
            Nhắn tin
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            iconName={userRole === 'freelancer' ? 'Eye' : 'FileText'} 
            iconPosition="left"
          >
            {userRole === 'freelancer' ? 'Xem chi tiết' : 'Đánh giá'}
          </Button>
        </div>
      </div>

      {/* Client Management Section */}
      {userRole === 'client' && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Quản lý dự án:</span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" iconName="Calendar">
                Họp
              </Button>
              <Button variant="ghost" size="sm" iconName="DollarSign">
                Thanh toán
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Freelancer: {project?.freelancerName}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              project?.status === 'in-progress' ? 'bg-primary/10 text-primary' :
              project?.status === 'review' ? 'bg-warning/10 text-warning' :
              'bg-success/10 text-success'
            }`}>
              {project?.status === 'in-progress' ? 'Đang thực hiện' :
               project?.status === 'review' ? 'Chờ duyệt' : 'Hoàn thành'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;