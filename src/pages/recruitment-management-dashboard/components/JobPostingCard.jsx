import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const JobPostingCard = ({ job, onSelect, isSelected, detailed = false }) => {
  const getStatusColor = (status) => {
    const colors = {
      active: 'text-success bg-success/10',
      urgent: 'text-error bg-error/10',
      draft: 'text-warning bg-warning/10',
      expired: 'text-muted-foreground bg-muted'
    };
    return colors?.[status] || colors?.active;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'border-l-error',
      medium: 'border-l-warning',
      low: 'border-l-primary'
    };
    return colors?.[priority] || colors?.medium;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft(job?.deadline);

  return (
    <div 
      className={`border-l-4 ${getPriorityColor(job?.priority)} bg-card border border-border rounded-lg p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-smooth cursor-pointer ${
        isSelected ? 'ring-2 ring-primary ring-opacity-50' : ''
      }`}
      onClick={() => onSelect?.(job?.id)}
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-smooth">
              {job?.title}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job?.status)}`}>
              {job?.status === 'active' ? 'Đang tuyển' : 
               job?.status === 'urgent' ? 'Gấp' : 
               job?.status === 'draft' ? 'Bản nháp' : 'Hết hạn'}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center space-x-1">
              <Icon name="Building2" size={14} />
              <span>{job?.company}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="MapPin" size={14} />
              <span>{job?.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="DollarSign" size={14} />
              <span>{job?.salary}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{job?.experience}</span>
            </div>
          </div>

          {detailed && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {job?.skills?.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-muted text-xs rounded-md text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end space-y-2 mt-4 lg:mt-0 lg:ml-6">
          <div className="text-sm text-muted-foreground text-right">
            <div className="flex items-center space-x-1 mb-1">
              <Icon name="Calendar" size={14} />
              <span>Hết hạn: {formatDate(job?.deadline)}</span>
            </div>
            <div className={`text-xs ${daysLeft <= 3 ? 'text-error' : daysLeft <= 7 ? 'text-warning' : 'text-muted-foreground'}`}>
              {daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Đã hết hạn'}
            </div>
          </div>
        </div>
      </div>

      {/* Application Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{job?.applications}</div>
          <div className="text-xs text-muted-foreground">Tổng ứng viên</div>
          {job?.newApplications > 0 && (
            <div className="text-xs text-primary">+{job?.newApplications} mới</div>
          )}
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-warning">{job?.interviewsScheduled}</div>
          <div className="text-xs text-muted-foreground">Đã lên lịch PV</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-success">{job?.offers}</div>
          <div className="text-xs text-muted-foreground">Đã gửi offer</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-accent">
            {job?.applications > 0 ? Math.round((job?.offers / job?.applications) * 100) : 0}%
          </div>
          <div className="text-xs text-muted-foreground">Tỷ lệ thành công</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" iconName="Eye" iconPosition="left">
            Xem chi tiết
          </Button>
          <Button variant="ghost" size="sm" iconName="Users" iconPosition="left">
            Xem ứng viên ({job?.applications})
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          {job?.newApplications > 0 && (
            <div className="flex items-center space-x-1 text-primary text-sm">
              <Icon name="Bell" size={14} />
              <span>{job?.newApplications} ứng viên mới</span>
            </div>
          )}
          <Button variant="outline" size="sm" iconName="Edit" iconPosition="left">
            Chỉnh sửa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobPostingCard;