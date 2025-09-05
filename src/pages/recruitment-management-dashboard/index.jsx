import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import DashboardSidebar from '../../components/ui/DashboardSidebar';
import RecruitmentMetrics from './components/RecruitmentMetrics';
import JobPostingCard from './components/JobPostingCard';
import CandidateList from './components/CandidateList';
import PipelineStages from './components/PipelineStages';
import InterviewScheduler from './components/InterviewScheduler';
import RecruitmentAnalytics from './components/RecruitmentAnalytics';
import MessageCenter from './components/MessageCenter';

import CandidateDashboardView from './components/CandidateDashboardView';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const RecruitmentManagementDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userRole, setUserRole] = useState('employer'); // employer or candidate
  const [selectedTab, setSelectedTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    const role = localStorage.getItem('userRole') || 'employer';
    setUserRole(role);

    return () => clearInterval(timer);
  }, []);

  const activeJobPostings = [
    {
      id: 1,
      title: 'Kỹ sư Cơ khí Senior - Thiết kế Máy móc',
      company: 'Công ty TNHH Cơ khí Chính Xác Việt Nam',
      location: 'Hồ Chí Minh',
      salary: '25-35 triệu VNĐ',
      type: 'full-time',
      applications: 24,
      newApplications: 5,
      interviewsScheduled: 8,
      offers: 2,
      posted: '2025-01-02',
      deadline: '2025-01-20',
      status: 'active',
      priority: 'high',
      skills: ['AutoCAD', 'SolidWorks', 'Thiết kế máy', 'Gia công cơ khí'],
      experience: '3-5 năm'
    },
    {
      id: 2,
      title: 'Chuyên viên Tính toán Kết cấu',
      company: 'Tập đoàn Xây dựng Hòa Bình',
      location: 'Hà Nội',
      salary: '20-28 triệu VNĐ',
      type: 'full-time',
      applications: 18,
      newApplications: 3,
      interviewsScheduled: 6,
      offers: 1,
      posted: '2025-01-03',
      deadline: '2025-01-25',
      status: 'active',
      priority: 'medium',
      skills: ['SAP2000', 'ETABS', 'Tính toán kết cấu', 'Bê tông cốt thép'],
      experience: '2-4 năm'
    },
    {
      id: 3,
      title: 'Kỹ sư Điện - Tự động hóa',
      company: 'Nhà máy Samsung Việt Nam',
      location: 'Bắc Ninh',
      salary: '30-40 triệu VNĐ',
      type: 'full-time',
      applications: 31,
      newApplications: 7,
      interviewsScheduled: 12,
      offers: 3,
      posted: '2025-01-01',
      deadline: '2025-01-15',
      status: 'urgent',
      priority: 'high',
      skills: ['PLC', 'SCADA', 'Tự động hóa', 'Điều khiển công nghiệp'],
      experience: '2-5 năm'
    }
  ];

  const metricsData = userRole === 'employer' ? [
    {
      title: 'Vị trí tuyển dụng active',
      value: '12',
      change: '+3',
      changeType: 'increase',
      icon: 'Briefcase',
      color: 'primary'
    },
    {
      title: 'Ứng viên mới tuần này',
      value: '127',
      change: '+23%',
      changeType: 'increase',
      icon: 'Users',
      color: 'success'
    },
    {
      title: 'Phỏng vấn đã lên lịch',
      value: '34',
      change: '+8',
      changeType: 'increase',
      icon: 'Calendar',
      color: 'warning'
    },
    {
      title: 'Tỷ lệ tuyển dụng thành công',
      value: '67%',
      change: '+5%',
      changeType: 'increase',
      icon: 'Target',
      color: 'accent'
    }
  ] : [
    {
      title: 'Đơn ứng tuyển đã gửi',
      value: '8',
      change: '+2',
      changeType: 'increase',
      icon: 'Send',
      color: 'primary'
    },
    {
      title: 'Phỏng vấn được mời',
      value: '3',
      change: '+1',
      changeType: 'increase',
      icon: 'Calendar',
      color: 'success'
    },
    {
      title: 'Phản hồi từ nhà tuyển dụng',
      value: '6',
      change: '+2',
      changeType: 'increase',
      icon: 'MessageCircle',
      color: 'warning'
    },
    {
      title: 'Tỷ lệ phản hồi tích cực',
      value: '75%',
      change: '+10%',
      changeType: 'increase',
      icon: 'TrendingUp',
      color: 'accent'
    }
  ];

  const tabs = userRole === 'employer' ? [
    { id: 'overview', label: 'Tổng quan', icon: 'LayoutDashboard' },
    { id: 'jobs', label: 'Tin tuyển dụng', icon: 'Briefcase' },
    { id: 'candidates', label: 'Ứng viên', icon: 'Users' },
    { id: 'interviews', label: 'Phỏng vấn', icon: 'Calendar' },
    { id: 'analytics', label: 'Báo cáo', icon: 'BarChart3' },
    { id: 'messages', label: 'Tin nhắn', icon: 'MessageCircle' }
  ] : [
    { id: 'overview', label: 'Tổng quan', icon: 'LayoutDashboard' },
    { id: 'applications', label: 'Đơn ứng tuyển', icon: 'FileText' },
    { id: 'interviews', label: 'Lịch phỏng vấn', icon: 'Calendar' },
    { id: 'messages', label: 'Tin nhắn', icon: 'MessageCircle' }
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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContent = () => {
    if (userRole === 'candidate') {
      return <CandidateDashboardView selectedTab={selectedTab} />;
    }

    switch (selectedTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Job Postings Overview */}
            <div className="bg-card border border-border rounded-lg shadow-elevation-1">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="Briefcase" size={20} className="text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Tin tuyển dụng đang hoạt động</h2>
                </div>
                <Link to="/employer-job-posting">
                  <Button variant="default" size="sm" iconName="Plus" iconPosition="left">
                    Đăng tin mới
                  </Button>
                </Link>
              </div>
              <div className="p-6 space-y-4">
                {activeJobPostings?.map((job) => (
                  <JobPostingCard 
                    key={job?.id} 
                    job={job} 
                    onSelect={setSelectedJobId}
                    isSelected={selectedJobId === job?.id}
                  />
                ))}
              </div>
            </div>

            {/* Pipeline Stages */}
            <PipelineStages jobId={selectedJobId} />

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InterviewScheduler />
              <MessageCenter />
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Quản lý tin tuyển dụng</h2>
              <Link to="/employer-job-posting">
                <Button variant="default" iconName="Plus" iconPosition="left">
                  Đăng tin tuyển dụng mới
                </Button>
              </Link>
            </div>
            
            <div className="bg-card border border-border rounded-lg shadow-elevation-1">
              <div className="p-6">
                {activeJobPostings?.map((job) => (
                  <JobPostingCard 
                    key={job?.id} 
                    job={job} 
                    onSelect={setSelectedJobId}
                    isSelected={selectedJobId === job?.id}
                    detailed={true}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'candidates':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Quản lý ứng viên</h2>
              <div className="flex items-center space-x-3">
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e?.target?.value)}
                  className="px-4 py-2 border border-border rounded-md text-sm"
                >
                  <option value="all">Tất cả ứng viên</option>
                  <option value="new">Ứng viên mới</option>
                  <option value="screening">Đang sàng lọc</option>
                  <option value="interview">Phỏng vấn</option>
                  <option value="offer">Đã offer</option>
                </select>
                <Button variant="outline" iconName="Download" iconPosition="left">
                  Xuất danh sách
                </Button>
              </div>
            </div>
            <CandidateList filterStatus={filterStatus} selectedJobId={selectedJobId} />
          </div>
        );

      case 'interviews':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Quản lý phỏng vấn</h2>
              <Button variant="default" iconName="Plus" iconPosition="left">
                Lên lịch phỏng vấn
              </Button>
            </div>
            <InterviewScheduler detailed={true} />
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Báo cáo và phân tích tuyển dụng</h2>
            <RecruitmentAnalytics />
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Trung tâm tin nhắn</h2>
            <MessageCenter detailed={true} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DashboardSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={toggleSidebar}
      />
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {userRole === 'employer' ?'Bảng điều khiển Tuyển dụng' :'Theo dõi Ứng tuyển'
                }
              </h1>
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
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              {userRole === 'employer' ? (
                <>
                  <Button variant="outline" iconName="Download" iconPosition="left">
                    Xuất báo cáo
                  </Button>
                  <Link to="/employer-job-posting">
                    <Button variant="default" iconName="Plus" iconPosition="left">
                      Đăng tin tuyển dụng
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/job-marketplace">
                    <Button variant="outline" iconName="Search" iconPosition="left">
                      Tìm việc làm
                    </Button>
                  </Link>
                  <Link to="/cv-submission-portal">
                    <Button variant="default" iconName="Upload" iconPosition="left">
                      Nộp CV mới
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData?.map((metric, index) => (
              <RecruitmentMetrics
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

          {/* Navigation Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-1 bg-muted p-1 rounded-lg overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setSelectedTab(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth whitespace-nowrap ${
                    selectedTab === tab?.id
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default RecruitmentManagementDashboard;