import React from 'react';
import ApplicationStatusTracker from './ApplicationStatusTracker';
import MessageCenter from './MessageCenter';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CandidateDashboardView = ({ selectedTab }) => {
  const upcomingInterviews = [
    {
      id: 1,
      jobTitle: 'Kỹ sư Cơ khí Senior',
      company: 'Công ty TNHH Cơ khí Chính Xác',
      date: '2025-01-10',
      time: '10:00 - 11:00',
      type: 'online',
      interviewer: 'Phạm Văn Thành',
      meetingLink: 'https://meet.google.com/abc-def-ghi',
      status: 'confirmed',
      round: 2
    },
    {
      id: 2,
      jobTitle: 'Chuyên viên Tính toán',
      company: 'Tập đoàn Xây dựng Hòa Bình',
      date: '2025-01-12',
      time: '14:00 - 15:00',
      type: 'offline',
      interviewer: 'Lê Thị Mai',
      location: 'Tầng 3, Tòa nhà Hòa Bình, Hà Nội',
      status: 'pending',
      round: 1
    }
  ];

  const notifications = [
    {
      id: 1,
      type: 'interview',
      title: 'Lịch phỏng vấn mới',
      message: 'Bạn có lịch phỏng vấn vào ngày 10/01/2025 lúc 10:00 cho vị trí Kỹ sư Cơ khí Senior.',
      timestamp: '2 giờ trước',
      read: false,
      icon: 'Calendar'
    },
    {
      id: 2,
      type: 'message',
      title: 'Tin nhắn mới từ HR',
      message: 'Chúng tôi đã nhận được CV của bạn và sẽ liên hệ trong 3 ngày làm việc tới.',
      timestamp: '1 ngày trước',
      read: false,
      icon: 'MessageCircle'
    },
    {
      id: 3,
      type: 'status_update',
      title: 'Cập nhật trạng thái ứng tuyển',
      message: 'Đơn ứng tuyển của bạn cho vị trí Chuyên viên IT đã chuyển sang giai đoạn phỏng vấn.',
      timestamp: '2 ngày trước',
      read: true,
      icon: 'Bell'
    }
  ];

  const jobSuggestions = [
    {
      id: 1,
      title: 'Kỹ sư Phần mềm Senior',
      company: 'VNG Corporation',
      location: 'Hồ Chí Minh',
      salary: '30-45 triệu VNĐ',
      type: 'full-time',
      matchScore: 95,
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
      posted: '1 ngày trước'
    },
    {
      id: 2,
      title: 'Technical Lead - Backend',
      company: 'Shopee Vietnam',
      location: 'Hà Nội',
      salary: '40-60 triệu VNĐ', 
      type: 'full-time',
      matchScore: 88,
      skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka'],
      posted: '3 ngày trước'
    }
  ];

  switch (selectedTab) {
    case 'overview':
      return (
        <div className="space-y-6">
          {/* Quick Stats section removed */}
          {/* Upcoming Interviews */}
          <div className="bg-card border border-border rounded-lg shadow-elevation-1">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                <Icon name="Calendar" size={20} className="text-primary" />
                <span>Lịch phỏng vấn sắp tới</span>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {upcomingInterviews?.map((interview) => (
                <div key={interview?.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {interview?.jobTitle} - Vòng {interview?.round}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {interview?.company}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Icon name="Calendar" size={14} />
                          <span>{new Date(interview.date)?.toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={14} />
                          <span>{interview?.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name={interview?.type === 'online' ? 'Video' : 'MapPin'} size={14} />
                          <span>{interview?.type === 'online' ? 'Trực tuyến' : 'Trực tiếp'}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                      interview?.status === 'confirmed' ? 'text-success bg-success/10' : 'text-warning bg-warning/10'
                    }`}>
                      {interview?.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <Icon name="User" size={14} className="inline mr-1" />
                      Người phỏng vấn: {interview?.interviewer}
                    </div>
                    <div className="flex items-center space-x-2">
                      {interview?.type === 'online' && interview?.status === 'confirmed' && (
                        <Button variant="outline" size="sm" iconName="Video" iconPosition="left">
                          Tham gia
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" iconName="Calendar" iconPosition="left">
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Job Suggestions section removed */}
        </div>
      );

    case 'applications':
      return <ApplicationStatusTracker candidateView={true} />;

    case 'interviews':
      return (
        <div className="bg-card border border-border rounded-lg shadow-elevation-1">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Icon name="Calendar" size={20} className="text-primary" />
              <span>Lịch phỏng vấn của tôi</span>
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {upcomingInterviews?.map((interview) => (
              <div key={interview?.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {interview?.jobTitle} - Vòng {interview?.round}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {interview?.company}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={14} />
                        <span>{new Date(interview.date)?.toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} />
                        <span>{interview?.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="User" size={14} />
                        <span>{interview?.interviewer}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name={interview?.type === 'online' ? 'Video' : 'MapPin'} size={14} />
                        <span>
                          {interview?.type === 'online' ?'Trực tuyến' 
                            : interview?.location
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                    interview?.status === 'confirmed' ? 'text-success bg-success/10' : 'text-warning bg-warning/10'
                  }`}>
                    {interview?.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="sm" iconName="MessageCircle" iconPosition="left">
                      Nhắn tin HR
                    </Button>
                    <Button variant="ghost" size="sm" iconName="FileText" iconPosition="left">
                      Xem job description
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    {interview?.type === 'online' && interview?.status === 'confirmed' && (
                      <Button variant="outline" size="sm" iconName="Video" iconPosition="left">
                        Tham gia phỏng vấn
                      </Button>
                    )}
                    {interview?.status === 'pending' && (
                      <Button variant="default" size="sm" iconName="Check" iconPosition="left">
                        Xác nhận lịch
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'messages':
      return <MessageCenter detailed={true} />;

    default:
      return (
        <div className="text-center py-12">
          <Icon name="AlertCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Tính năng đang được phát triển</p>
        </div>
      );
  }
};

export default CandidateDashboardView;