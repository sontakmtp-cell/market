import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';
import { useSupabase } from '../../../contexts/SupabaseContext';
import { saveJob, unsaveJob, checkIfJobSaved } from '../../../services/jobService';

const JobCard = ({ job, userRole = 'freelancer', onShowNotification }) => {
  const { isAuthenticated, redirectToLogin } = useAuth();
  const { user, supabase } = useSupabase();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Check if current user is the job owner
  const isOwner = isAuthenticated && user && job?.client_user_id === user.id;

  // Check if job is saved when component mounts or user changes
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (user?.id && job?.id) {
        try {
          const saved = await checkIfJobSaved(user.id, job.id);
          setIsSaved(saved);
        } catch (error) {
          console.error('Error checking if job is saved:', error);
        }
      }
    };

    checkSavedStatus();
  }, [user?.id, job?.id]);
  
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

  const formatPostExpiration = (postExpiresAt, postDuration) => {
    if (!postExpiresAt) {
      return `${postDuration || 30} ngày`;
    }
    const date = new Date(postExpiresAt);
    const daysLeft = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Đã hết hạn';
  };

  const getPostExpirationColor = (postExpiresAt) => {
    if (!postExpiresAt) return 'text-gray-600';
    const daysLeft = Math.ceil((new Date(postExpiresAt) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 3) return 'text-red-600';
    if (daysLeft <= 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    if (!user?.id || !job?.id) {
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        await unsaveJob(user.id, job.id);
        setIsSaved(false);
        if (onShowNotification) {
          onShowNotification('Đã bỏ lưu công việc!', 'success');
        }
      } else {
        await saveJob(user.id, job.id);
        setIsSaved(true);
        if (onShowNotification) {
          onShowNotification('Đã lưu công việc!', 'success');
        }
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
      if (onShowNotification) {
        onShowNotification(
          error.message === 'Job is already saved' 
            ? 'Công việc đã được lưu trước đó!' 
            : 'Có lỗi xảy ra, vui lòng thử lại!', 
          'error'
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyJob = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    // Navigate to job details or application form
  };

  const handleEditJob = async (e) => {
    if (e) {
      try { e.preventDefault(); e.stopPropagation(); } catch (_) {}
    }
    if (!job?.id) return;

    try {
      // Block editing when project is not active or has an accepted proposal
      if (job?.status && job.status !== 'active') {
        if (onShowNotification) {
          onShowNotification('Bài đăng đã có đề xuất được chấp nhận hoặc đang thực hiện. Không thể chỉnh sửa.', 'warning');
        }
        return;
      }

      if (supabase) {
        const { count: acceptedCount } = await supabase
          .from('proposals')
          .select('id', { count: 'exact', head: true })
          .eq('project_id', job.id)
          .eq('status', 'accepted');

        if ((acceptedCount || 0) > 0) {
          if (onShowNotification) {
            onShowNotification('Bài đăng đã có đề xuất được chấp nhận. Không thể chỉnh sửa.', 'warning');
          }
          return;
        }
      }

      navigate(`/job-post/edit/${job?.id}`);
    } catch (err) {
      console.warn('Edit guard check failed (marketplace):', err);
      navigate(`/job-post/edit/${job?.id}`);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-smooth">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Link 
            to={`/job-details/${job?.id}`}
            className="text-base font-semibold text-foreground hover:text-primary transition-smooth line-clamp-2"
          >
            {job?.title}
          </Link>
          <div className="flex items-center space-x-2 mt-1">
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
      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
        {job?.description}
      </p>
      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-3">
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
      {/* Budget and Post Duration */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-muted-foreground">Ngân sách</div>
          <div className="font-semibold text-foreground">
            {formatBudget(job?.budgetMin, job?.budgetMax)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Bài đăng</div>
          <div className={`font-semibold ${getPostExpirationColor(job?.postExpiresAt)}`}>
            {formatPostExpiration(job?.postExpiresAt, job?.postDuration)}
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
                variant={isSaved ? "default" : "outline"}
                size="sm"
                onClick={handleSaveJob}
                disabled={!isAuthenticated || isSaving}
                title={!isAuthenticated ? "Đăng nhập để lưu công việc" : isSaved ? "Bỏ lưu công việc" : "Lưu công việc"}
              >
                <Icon 
                  name={isSaved ? "Heart" : "Heart"} 
                  size={14} 
                  className={`mr-1 ${isSaved ? "fill-current" : ""}`} 
                />
                {isSaving ? "..." : (isSaved ? "Đã lưu" : "Lưu")}
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
                  <Button variant="default" size="sm" onClick={handleEditJob}>
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
