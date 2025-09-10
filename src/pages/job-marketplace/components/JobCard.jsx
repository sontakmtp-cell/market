import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';
import { useSupabase } from '../../../contexts/SupabaseContext';

const JobCard = ({ job, userRole = 'freelancer', onShowNotification }) => {
  const { isAuthenticated, redirectToLogin } = useAuth();
  const { user } = useSupabase();
  
  // Check if current user is the job owner
  const isOwner = isAuthenticated && user && job?.client_user_id === user.id;
  
  const getCategoryIcon = (category) => {
    const icons = {
      'structural': 'Building',
      'mechanical': 'Cog',
      'electronic': 'Zap',
      'crane': 'Truck',
      'architecture': 'Home'
    };
    return icons?.[category] || 'Briefcase';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'structural': 'text-blue-600 bg-blue-50',
      'mechanical': 'text-green-600 bg-green-50',
      'electronic': 'text-yellow-600 bg-yellow-50',
      'crane': 'text-purple-600 bg-purple-50',
      'architecture': 'text-red-600 bg-red-50'
    };
    return colors?.[category] || 'text-gray-600 bg-gray-50';
  };

  const formatBudget = (min, max) => {
    return `${min?.toLocaleString('vi-VN')} - ${max?.toLocaleString('vi-VN')} VND`;
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    return date?.toLocaleDateString('vi-VN');
  };

  const getUrgencyColor = (deadline) => {
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 3) return 'text-red-600';
    if (daysLeft <= 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleSaveJob = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    // TODO: Implement save job functionality
    if (onShowNotification) {
      onShowNotification('Đã lưu công việc!', 'success');
    }
  };

  const handleApplyJob = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    // Navigate to job details or application form
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-elevation-2 transition-smooth">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link 
            to={`/job-details/${job?.id}`}
            className="text-lg font-semibold text-foreground hover:text-primary transition-smooth line-clamp-2"
          >
            {job?.title}
          </Link>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(job?.category)}`}>
              <Icon name={getCategoryIcon(job?.category)} size={12} className="mr-1" />
              {job?.category}
            </span>
            {job?.isUrgent && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-50">
                <Icon name="Clock" size={12} className="mr-1" />
                Khẩn cấp
              </span>
            )}
          </div>
        </div>
        {userRole === 'client' && (
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Đề xuất</div>
            <div className="text-lg font-semibold text-primary">{job?.proposalCount}</div>
          </div>
        )}
      </div>
      {/* Description */}
      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
        {job?.description}
      </p>
      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job?.skills?.slice(0, 3)?.map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
            {skill}
          </span>
        ))}
        {job?.skills?.length > 3 && (
          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
            +{job?.skills?.length - 3} khác
          </span>
        )}
      </div>
      {/* Budget and Deadline */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-muted-foreground">Ngân sách</div>
          <div className="font-semibold text-foreground">
            {formatBudget(job?.budgetMin, job?.budgetMax)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Hạn chót</div>
          <div className={`font-semibold ${getUrgencyColor(job?.deadline)}`}>
            {formatDeadline(job?.deadline)}
          </div>
        </div>
      </div>
      {/* Client Info */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <Icon name="User" size={16} color="white" />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">{job?.client?.name}</div>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={12} className="text-yellow-500 fill-current" />
              <span className="text-xs text-muted-foreground">
                {job?.client?.rating} ({job?.client?.reviewCount} đánh giá)
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Đã thuê</div>
          <div className="text-sm font-medium text-foreground">{job?.client?.hireCount} lần</div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Đăng {Math.floor((new Date() - new Date(job.postedAt)) / (1000 * 60 * 60 * 24))} ngày trước
        </div>
        <div className="flex items-center space-x-2">
          {userRole === 'freelancer' ? (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSaveJob}
                disabled={!isAuthenticated}
                title={!isAuthenticated ? "Đăng nhập để lưu công việc" : "Lưu công việc"}
              >
                <Icon name="Heart" size={14} className="mr-1" />
                {isAuthenticated ? "Lưu" : "Đăng nhập để lưu"}
              </Button>
              {isAuthenticated ? (
                <Link to={`/job-details/${job?.id}`}>
                  <Button variant="default" size="sm">
                    Xem chi tiết
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={redirectToLogin}
                >
                  <Icon name="LogIn" size={14} className="mr-1" />
                  Đăng nhập để ứng tuyển
                </Button>
              )}
            </>
          ) : (
            <>
              <Link to={`/job-details/${job?.id}`}>
                <Button variant="outline" size="sm">
                  Xem đề xuất
                </Button>
              </Link>
              {isOwner && (
                <Link to={`/job-post/edit/${job?.id}`}>
                  <Button variant="default" size="sm">
                    <Icon name="Edit" size={14} className="mr-1" />
                    Chỉnh sửa
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
      {/* Application Status for Freelancers */}
      {userRole === 'freelancer' && job?.applicationStatus && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            job?.applicationStatus === 'applied' ? 'text-blue-600 bg-blue-50' :
            job?.applicationStatus === 'shortlisted' ? 'text-green-600 bg-green-50' :
            job?.applicationStatus === 'rejected'? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50'
          }`}>
            <Icon name={
              job?.applicationStatus === 'applied' ? 'Clock' :
              job?.applicationStatus === 'shortlisted' ? 'CheckCircle' :
              job?.applicationStatus === 'rejected' ? 'XCircle' : 'Circle'
            } size={12} className="mr-1" />
            {job?.applicationStatus === 'applied' ? 'Đã ứng tuyển' :
             job?.applicationStatus === 'shortlisted' ? 'Được chọn' :
             job?.applicationStatus === 'rejected' ? 'Bị từ chối' : 'Chưa ứng tuyển'}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;