import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MetricsCard from './components/MetricsCard';
import ProjectCard from './components/ProjectCard';
import NotificationCenter from './components/NotificationCenter';
import SavedJobs from './components/SavedJobs';
import EarningsChart from './components/EarningsChart';
import QuickActions from './components/QuickActions';
import RecentFeedback from './components/RecentFeedback';
import UpcomingDeadlines from './components/UpcomingDeadlines';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FreelancerManagement from './components/FreelancerManagement';
import PaymentManagement from './components/PaymentManagement';
import { ROLES } from '../../utils/constants';

const FreelancerDashboard = () => {
  console.log('FreelancerDashboard component rendering...');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userRole, setUserRole] = useState('freelancer'); // freelancer or client

  useEffect(() => {
    console.log('FreelancerDashboard useEffect running...');
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    const role = localStorage.getItem('userRole') || 'freelancer';
    setUserRole(role);

    return () => clearInterval(timer);
  }, []);

  const handleRoleChange = (newRole) => {
    localStorage.setItem('userRole', newRole);
    setUserRole(newRole);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const freelancerProjects = [
    {
      id: 1,
      title: 'Thiết kế hệ thống cầu trục 10 tấn',
      clientName: 'Công ty TNHH Cơ khí Việt Nam',
      description: 'Thiết kế và tính toán hệ thống cầu trục 10 tấn cho nhà máy sản xuất với yêu cầu kỹ thuật cao.',
      deadline: '2025-01-08',
      progress: 75,
      budget: 35000000,
      priority: 'high',
      status: 'in-progress',
      nextDeliverable: 'Bản vẽ thiết kế chi tiết và tính toán kết cấu',
      messages: 12,
      files: 8
    },
    {
      id: 2,
      title: 'Tính toán kết cấu thép nhà xưởng',
      clientName: 'Công ty Xây dựng Đại Phát',
      description: 'Tính toán và thiết kế kết cấu thép cho nhà xưởng diện tích 2000m2 theo tiêu chuẩn TCVN.',
      deadline: '2025-01-12',
      progress: 60,
      budget: 20000000,
      priority: 'medium',
      status: 'in-progress',
      nextDeliverable: 'Báo cáo tính toán và bản vẽ kết cấu',
      messages: 8,
      files: 5
    },
    {
      id: 3,
      title: 'Thiết kế hệ thống băng tải',
      clientName: 'Nhà máy Sản xuất ABC',
      description: 'Thiết kế hệ thống băng tải tự động cho dây chuyền sản xuất với công suất 100 tấn/giờ.',
      deadline: '2025-01-15',
      progress: 40,
      budget: 25000000,
      priority: 'low',
      status: 'review',
      nextDeliverable: 'Bản vẽ lắp ráp và danh mục vật tư',
      messages: 5,
      files: 3
    }
  ];

  const clientProjects = [
    {
      id: 1,
      title: 'Thiết kế hệ thống cầu trục 10 tấn',
      freelancerName: 'Nguyễn Văn A',
      description: 'Thiết kế và tính toán hệ thống cầu trục 10 tấn cho nhà máy sản xuất với yêu cầu kỹ thuật cao.',
      deadline: '2025-01-08',
      progress: 75,
      budget: 35000000,
      priority: 'high',
      status: 'in-progress',
      nextDeliverable: 'Bản vẽ thiết kế chi tiết và tính toán kết cấu',
      messages: 12,
      files: 8
    },
    {
      id: 2,
      title: 'Tính toán kết cấu thép nhà xưởng',
      freelancerName: 'Trần Thị B',
      description: 'Tính toán và thiết kế kết cấu thép cho nhà xưởng diện tích 2000m2 theo tiêu chuẩn TCVN.',
      deadline: '2025-01-12',
      progress: 60,
      budget: 20000000,
      priority: 'medium',
      status: 'in-progress',
      nextDeliverable: 'Báo cáo tính toán và bản vẽ kết cấu',
      messages: 8,
      files: 5
    },
    {
      id: 3,
      title: 'Thiết kế hệ thống băng tải',
      freelancerName: 'Lê Văn C',
      description: 'Thiết kế hệ thống băng tải tự động cho dây chuyền sản xuất với công suất 100 tấn/giờ.',
      deadline: '2025-01-15',
      progress: 40,
      budget: 25000000,
      priority: 'low',
      status: 'review',
      nextDeliverable: 'Bản vẽ lắp ráp và danh mục vật tư',
      messages: 5,
      files: 3
    }
  ];

  const freelancerMetricsData = [
    {
      title: 'Thu nhập tháng này',
      value: '35.2M VNĐ',
      change: '+12.5%',
      changeType: 'increase',
      icon: 'DollarSign',
      color: 'success'
    },
    {
      title: 'Dự án đang thực hiện',
      value: '6',
      change: '+2',
      changeType: 'increase',
      icon: 'Briefcase',
      color: 'primary'
    },
    {
      title: 'Đánh giá trung bình',
      value: '4.9/5',
      change: '+0.2',
      changeType: 'increase',
      icon: 'Star',
      color: 'warning'
    },
    {
      title: 'Tỷ lệ hoàn thành',
      value: '98%',
      change: '+3%',
      changeType: 'increase',
      icon: 'CheckCircle',
      color: 'accent'
    }
  ];

  const clientMetricsData = [
    {
      title: 'Ngân sách đã sử dụng',
      value: '52.8M VNĐ',
      change: '-8.3%',
      changeType: 'decrease',
      icon: 'CreditCard',
      color: 'warning'
    },
    {
      title: 'Dự án đang hoạt động',
      value: '4',
      change: '+1',
      changeType: 'increase',
      icon: 'Play',
      color: 'primary'
    },
    {
      title: 'Freelancer đang hợp tác',
      value: '12',
      change: '+3',
      changeType: 'increase',
      icon: 'UserCheck',
      color: 'accent'
    },
    {
      title: 'Dự án hoàn thành',
      value: '95%',
      change: '+2%',
      changeType: 'increase',
      icon: 'Trophy',
      color: 'success'
    }
  ];

  const formatTime = (date) => {
    return date?.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-foreground">
                    {userRole === 'freelancer' ? 'Bảng điều khiển Freelancer' : 'Bảng điều khiển Client'}
                  </h1>
                  {/* Role switch removed; role managed globally via header */}
                </div>
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={16} />
                    <span className="text-sm">{formatDate(currentTime)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={16} />
                    <span className="text-sm">{formatTime(currentTime)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {userRole === 'freelancer' ? (
                    <>
                      <Link to="/job-marketplace">
                        <Button variant="outline" iconName="Search" iconPosition="left">
                          Tìm dự án mới
                        </Button>
                      </Link>
                      <Button variant="default" iconName="Plus" iconPosition="left">
                        Tạo đề xuất
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/job-post">
                        <Button variant="default" iconName="Plus" iconPosition="left">
                          Đăng dự án mới
                        </Button>
                      </Link>
                      <Button variant="outline" iconName="Users" iconPosition="left">
                        Tìm Freelancer
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {(userRole === 'freelancer' ? freelancerMetricsData : clientMetricsData)?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                color={metric?.color}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Projects and Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Projects */}
              <div className="bg-card border border-border rounded-lg shadow-elevation-1">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <div className="flex items-center space-x-2">
                    <Icon name="Briefcase" size={20} className="text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">Dự án đang thực hiện</h2>
                  </div>
                  <Button variant="ghost" size="sm" iconName="MoreHorizontal">
                    Xem tất cả
                  </Button>
                </div>
                <div className="p-6 space-y-6">
                  {(userRole === 'freelancer' ? freelancerProjects : clientProjects)?.map((project) => (
                    <ProjectCard key={project?.id} project={project} userRole={userRole} />
                  ))}
                </div>
              </div>

              {/* Earnings Chart */}
              <EarningsChart />
            </div>

            {/* Right Column - Notifications and Quick Actions */}
            <div className="space-y-6">
              <NotificationCenter />
              <QuickActions />
            </div>
          </div>

          {/* Secondary Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {userRole === 'freelancer' ? (
              <>
                <RecentFeedback />
                <SavedJobs />
              </>
            ) : (
              <>
                <FreelancerManagement />
                <PaymentManagement />
              </>
            )}
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userRole === 'freelancer' && <UpcomingDeadlines />}
            
            {/* File Management */}
            <div className="bg-card border border-border rounded-lg shadow-elevation-1">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="FolderOpen" size={20} className="text-accent" />
                  <h3 className="text-lg font-semibold text-foreground">Quản lý tệp</h3>
                </div>
                <Button variant="ghost" size="sm" iconName="Upload" iconPosition="left">
                  Tải lên
                </Button>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-smooth cursor-pointer">
                  <Icon name="Upload" size={32} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Kéo thả tệp vào đây hoặc nhấp để chọn
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Hỗ trợ: PDF, DOC, DWG, JPG, PNG (tối đa 50MB)
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="FileText" size={16} className="text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Hợp đồng dự án A</p>
                        <p className="text-xs text-muted-foreground">2.3 MB • PDF</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" iconName="Download">
                      Tải về
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="Image" size={16} className="text-success" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Bản vẽ thiết kế</p>
                        <p className="text-xs text-muted-foreground">15.7 MB • DWG</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" iconName="Download">
                      Tải về
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreelancerDashboard;
