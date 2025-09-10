import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useSupabase } from '../../../contexts/SupabaseContext';
import { getSavedJobsWithDetails, unsaveJob } from '../../../services/jobService';

const SavedJobs = () => {
  const { user } = useSupabase();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const jobs = await getSavedJobsWithDetails(user.id);
        setSavedJobs(jobs);
      } catch (err) {
        console.error('Error fetching saved jobs:', err);
        setError('Không thể tải danh sách công việc đã lưu');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [user?.id]);

  const handleUnsaveJob = async (jobId) => {
    if (!user?.id) return;

    try {
      await unsaveJob(user.id, jobId);
      // Remove job from local state
      setSavedJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    } catch (err) {
      console.error('Error unsaving job:', err);
      // You might want to show a notification here
    }
  };

  const formatBudget = (budget) => {
    if (!budget) return 'Thỏa thuận';
    
    if (typeof budget === 'string' && budget.includes('-')) {
      const [min, max] = budget.split('-');
      return `${parseInt(min)?.toLocaleString('vi-VN')} - ${parseInt(max)?.toLocaleString('vi-VN')} VNĐ`;
    }
    
    return budget;
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} ngày trước`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} tháng trước`;
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-elevation-1">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Heart" size={20} className="text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Công việc đã lưu</h3>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-elevation-1">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Heart" size={20} className="text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Công việc đã lưu</h3>
          </div>
        </div>
        <div className="p-8 text-center">
          <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-2" />
          <p className="text-error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Heart" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Công việc đã lưu</h3>
          {savedJobs.length > 0 && (
            <span className="bg-accent/10 text-accent px-2 py-1 rounded-full text-xs">
              {savedJobs.length}
            </span>
          )}
        </div>
        {savedJobs.length > 0 && (
          <Button variant="ghost" size="sm" iconName="ExternalLink" iconPosition="right">
            Xem thêm
          </Button>
        )}
      </div>

      {savedJobs.length === 0 ? (
        <div className="p-8 text-center">
          <Icon name="Heart" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">Chưa có công việc nào được lưu</h4>
          <p className="text-muted-foreground">
            Bạn chưa lưu dự án nào. Hãy khám phá các công việc phù hợp và lưu lại để xem sau.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {savedJobs.map((job) => (
            <div key={job?.id} className="p-4 hover:bg-muted transition-smooth">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-foreground mb-1">{job?.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{job?.client_name || job?.company}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Lưu {formatTimeAgo(job?.saved_at)}
                </div>
              </div>

              <p className="text-sm text-foreground mb-3 line-clamp-2">
                {job?.description || job?.project_description}
              </p>

              {job?.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="DollarSign" size={14} />
                    <span>{formatBudget(job?.budget)}</span>
                  </div>
                  {job?.duration && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>{job.duration}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{formatTimeAgo(job?.created_at)}</span>
                  {job?.applications_count && (
                    <span>{job.applications_count} ứng viên</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    iconName="HeartOff" 
                    iconPosition="left"
                    onClick={() => handleUnsaveJob(job.id)}
                  >
                    Bỏ lưu
                  </Button>
                  <Button variant="default" size="sm" iconName="Send" iconPosition="left">
                    Ứng tuyển
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
