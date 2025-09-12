import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';
import { useSupabase } from '../../../contexts/SupabaseContext';
import { saveJob, unsaveJob, checkIfJobSaved } from '../../../services/jobService';
import './JobCardVIP.css';

const JobCardVIP = ({ job, userRole = 'freelancer', onShowNotification }) => {
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
      'structural': '#4a90e2',
      'mechanical': '#5cb85c',
      'electronic': '#f0ad4e',
      'crane': '#9b59b6',
      'architecture': '#e74c3c'
    };
    return colors?.[category] || '#6c757d';
  };

  const formatBudget = (min, max) => {
    return `${min?.toLocaleString('vi-VN')} - ${max?.toLocaleString('vi-VN')} VND`;
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    return date?.toLocaleDateString('vi-VN');
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} ngày trước`;
    } else if (diffHours > 0) {
      return `${diffHours} giờ trước`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} phút trước`;
    } else {
      return 'Vừa xong';
    }
  };

  const getUrgencyColor = (deadline) => {
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 3) return '#e74c3c';
    if (daysLeft <= 7) return '#f39c12';
    return '#27ae60';
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
    <div className="card-effect">
      <div className="card-inner" style={{ '--card-bg': '#ffffff', '--card-accent': getCategoryColor(job?.category) }}>
        {/* Liquid Background Effect */}
        <div className="card__liquid" style={{ background: getCategoryColor(job?.category) }}></div>
        
        {/* Glow Effect */}
        <div className="card__glow"></div>
        
        {/* Shine Effect */}
        <div className="card__shine"></div>
        
        {/* VIP Badge */}
        {(job?.isUrgent || job?.displayType === 'vip') && (
          <div className="card__badge">
            <Icon name="Star" size={12} className="mr-1" />
            VIP
          </div>
        )}

        {/* Card Content */}
        <div className="card__content">
          {/* Category Icon/Image */}
          <div className="card__image" style={{ '--bg-color': `${getCategoryColor(job?.category)}20` }}>
            <div className="w-full h-full flex items-center justify-center">
              <Icon 
                name={getCategoryIcon(job?.category)} 
                size={40} 
                style={{ color: getCategoryColor(job?.category) }}
              />
            </div>
          </div>

          {/* Job Title and Description */}
          <div className="card__text">
            <h3 className="card__title">
              <Link to={`/job-details/${job?.id}`} className="hover:text-current">
                {job?.title}
              </Link>
            </h3>
            <p className="card__description">
              {job?.description}
            </p>
          </div>

          {/* Skills Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {job?.skills?.slice(0, 2)?.map((skill, index) => (
              <span 
                key={index} 
                className="px-2 py-1 text-xs rounded-full"
                style={{ 
                  backgroundColor: `${getCategoryColor(job?.category)}20`,
                  color: getCategoryColor(job?.category)
                }}
              >
                {skill.length > 8 ? `${skill.substring(0, 8)}...` : skill}
              </span>
            ))}
            {job?.skills?.length > 2 && (
              <span 
                className="px-2 py-1 text-xs rounded-full"
                style={{ 
                  backgroundColor: `${getCategoryColor(job?.category)}20`,
                  color: getCategoryColor(job?.category)
                }}
              >
                +{job?.skills?.length - 2}
              </span>
            )}
          </div>

          {/* Budget and Actions */}
          <div className="card__footer">
            <div className="card__price">
              {job?.budgetMin && job?.budgetMax ? 
                formatBudget(job.budgetMin, job.budgetMax) : 
                'Thỏa thuận'
              }
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-1">
              {userRole === 'freelancer' ? (
                <>
                  <button
                    onClick={handleSaveJob}
                    disabled={!isAuthenticated || isSaving}
                    className="card__button-save"
                    title={!isAuthenticated ? "Đăng nhập để lưu công việc" : isSaved ? "Bỏ lưu công việc" : "Lưu công việc"}
                    style={{ 
                      backgroundColor: isSaved ? getCategoryColor(job?.category) : 'transparent',
                      border: `2px solid ${getCategoryColor(job?.category)}`,
                      color: isSaved ? 'white' : getCategoryColor(job?.category)
                    }}
                  >
                    <Icon 
                      name="Heart" 
                      size={16} 
                      className={isSaved ? "fill-current" : ""} 
                    />
                    <span className="ml-1 text-xs font-medium">
                      {isSaving ? "..." : (isSaved ? "Đã lưu" : "Lưu")}
                    </span>
                  </button>
                  <Link 
                    to={`/job-details/${job?.id}`}
                    className="card__button"
                    title="Xem chi tiết"
                  >
                    <Icon name="ArrowRight" size={16} />
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to={`/job-details/${job?.id}`}
                    className="card__button-proposal"
                    title="Xem đề xuất"
                    style={{ 
                      backgroundColor: getCategoryColor(job?.category),
                      color: 'white'
                    }}
                  >
                    <Icon name="Eye" size={14} />
                    <span className="ml-1 text-xs font-medium hidden sm:inline">
                      Xem đề xuất
                    </span>
                    <span className="ml-1 text-xs font-medium sm:hidden">
                      Xem
                    </span>
                  </Link>
                  {isOwner && (
                    <button
                      onClick={handleEditJob}
                      className="card__button-edit"
                      title="Chỉnh sửa"
                      style={{ 
                        backgroundColor: `${getCategoryColor(job?.category)}20`,
                        color: getCategoryColor(job?.category),
                        border: `1px solid ${getCategoryColor(job?.category)}40`
                      }}
                    >
                      <Icon name="Edit" size={14} />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Client Info - Enhanced */}
          <div className="card__client-info">
            <div className="flex items-center space-x-2">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: getCategoryColor(job?.category) }}
              >
                <Icon name="User" size={12} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate">
                  {job?.client?.name || 'Khách hàng'}
                </div>
                <div className="flex items-center space-x-3 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={12} style={{ color: '#f39c12' }} className="flex-shrink-0" />
                    <span className="font-medium">{job?.client?.rating || '5.0'}</span>
                    <span>({job?.client?.reviewCount || 0} đánh giá)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deadline and Proposal Count - Enhanced */}
          <div className="card__meta-info">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={12} className="text-gray-500 flex-shrink-0" />
                  <span className="text-xs text-gray-500">Hạn chót</span>
                </div>
                <span className="font-medium text-gray-700 truncate text-xs">
                  {formatDeadline(job?.deadline)}
                </span>
              </div>
              <div className="flex flex-col space-y-1 items-end">
                <div className="flex items-center space-x-1">
                  <Icon name="Users" size={12} className="text-blue-600 flex-shrink-0" />
                  <span className="text-xs text-gray-500">Đề xuất</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-blue-600 text-xs">
                    {job?.proposalCount || 0}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Posted time */}
            <div className="flex items-center justify-center mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Icon name="Calendar" size={12} className="flex-shrink-0" />
                <span>Đăng {formatTimeAgo(job?.postedAt || job?.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCardVIP;
