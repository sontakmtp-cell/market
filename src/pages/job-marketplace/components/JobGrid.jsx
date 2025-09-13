import React from 'react';
import JobCard from './JobCard';
import JobCardVIP from './JobCardVIP';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';

const JobGrid = ({ 
  jobs = [], 
  loading = false, 
  viewMode = 'grid', 
  userRole = 'freelancer',
  onLoadMore,
  hasMore = false,
  onShowNotification
}) => {
  const { isAuthenticated, redirectToLogin } = useAuth();
  if (loading && jobs?.length === 0) {
    return (
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)]?.map((_, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6 animate-pulse">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="h-8 w-8 bg-muted rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                  <div className="h-6 bg-muted rounded w-14"></div>
                </div>
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <div className="h-3 bg-muted rounded w-12"></div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 bg-muted rounded w-12"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-muted rounded-full"></div>
                    <div className="space-y-1">
                      <div className="h-3 bg-muted rounded w-16"></div>
                      <div className="h-3 bg-muted rounded w-12"></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-muted rounded w-16"></div>
                    <div className="h-8 bg-muted rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (jobs?.length === 0 && !loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Search" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Không tìm thấy công việc nào
          </h3>
          <p className="text-muted-foreground mb-6">
            Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để xem thêm kết quả.
          </p>
          <div className="space-y-3">
            <Button variant="outline" fullWidth>
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Xóa tất cả bộ lọc
            </Button>
            {userRole === 'client' && (
              isAuthenticated ? (
                <Link to="/employer-job-posting">
                  <Button variant="default" fullWidth>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Đăng công việc mới
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant="default" 
                  fullWidth
                  onClick={redirectToLogin}
                >
                  <Icon name="LogIn" size={16} className="mr-2" />
                  Đăng nhập để đăng công việc
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6">
      {/* Jobs Grid */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6' 
          : 'space-y-4'
      }`}>
        {jobs?.map((job) => {
          // Check if job should display as VIP based on displayType only
          // This ensures user's choice in job-post is respected
          const isVIP = job?.displayType === 'vip';
          
          return isVIP ? (
            <JobCardVIP
              key={job?.id} 
              job={job} 
              userRole={userRole}
              onShowNotification={onShowNotification}
            />
          ) : (
            <JobCard 
              key={job?.id} 
              job={job} 
              userRole={userRole}
              onShowNotification={onShowNotification}
            />
          );
        })}
      </div>
      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            className="min-w-[200px]"
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                <Icon name="ChevronDown" size={16} className="mr-2" />
                Xem thêm công việc
              </>
            )}
          </Button>
        </div>
      )}
      {/* Loading More Indicator */}
      {loading && jobs?.length > 0 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Loader2" size={16} className="animate-spin" />
            <span className="text-sm">Đang tải thêm công việc...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobGrid;