import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InterviewScheduler = ({ detailed = false }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // week, month
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const interviews = [
    {
      id: 1,
      candidateName: 'Nguyễn Văn Minh',
      position: 'Kỹ sư Cơ khí Senior',
      date: '2025-01-09',
      time: '09:00 - 10:00',
      type: 'online',
      interviewer: 'Phạm Văn Thành',
      status: 'confirmed',
      meetingLink: 'https://meet.google.com/abc-def-ghi',
      notes: 'Phỏng vấn kỹ thuật về thiết kế máy móc'
    },
    {
      id: 2,
      candidateName: 'Trần Thị Hương',
      position: 'Chuyên viên Tính toán',
      date: '2025-01-09',
      time: '14:00 - 15:00',
      type: 'offline',
      interviewer: 'Lê Thị Mai',
      status: 'pending',
      location: 'Phòng họp A - Tầng 3',
      notes: 'Phỏng vấn về kinh nghiệm tính toán kết cấu'
    },
    {
      id: 3,
      candidateName: 'Lê Hoàng Nam',
      position: 'Kỹ sư Điện - Tự động hóa',
      date: '2025-01-10',
      time: '10:30 - 11:30',
      type: 'online',
      interviewer: 'Nguyễn Đức Hòa',
      status: 'confirmed',
      meetingLink: 'https://zoom.us/j/123456789',
      notes: 'Phỏng vấn chuyên sâu về PLC và SCADA'
    },
    {
      id: 4,
      candidateName: 'Phạm Minh Tuấn',
      position: 'Kỹ sư Cơ khí Senior',
      date: '2025-01-11',
      time: '15:00 - 16:00',
      type: 'offline',
      interviewer: 'Trần Văn Bình',
      status: 'rescheduled',
      location: 'Phòng họp B - Tầng 5',
      notes: 'Phỏng vấn với Ban Giám đốc'
    }
  ];

  const todaysInterviews = interviews?.filter(interview => 
    interview?.date === new Date()?.toISOString()?.split('T')?.[0]
  );

  const upcomingInterviews = interviews?.filter(interview => 
    new Date(interview.date) > new Date()
  )?.slice(0, detailed ? 10 : 3);

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'text-success bg-success/10',
      pending: 'text-warning bg-warning/10',
      rescheduled: 'text-accent bg-accent/10',
      cancelled: 'text-error bg-error/10'
    };
    return colors?.[status] || colors?.pending;
  };

  const getStatusLabel = (status) => {
    const labels = {
      confirmed: 'Đã xác nhận',
      pending: 'Chờ xác nhận',
      rescheduled: 'Đã dời lịch',
      cancelled: 'Đã hủy'
    };
    return labels?.[status] || 'Không xác định';
  };

  const getTypeIcon = (type) => {
    return type === 'online' ? 'Video' : 'MapPin';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days?.[date?.getDay()];
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            {detailed ? 'Quản lý phỏng vấn' : 'Lịch phỏng vấn'}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          {detailed && (
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 text-sm rounded-md transition-smooth ${
                  viewMode === 'week' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Tuần
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 text-sm rounded-md transition-smooth ${
                  viewMode === 'month' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Tháng
              </button>
            </div>
          )}
          <Button 
            variant="default" 
            size="sm" 
            iconName="Plus" 
            iconPosition="left"
            onClick={() => setShowScheduleForm(true)}
          >
            Lên lịch mới
          </Button>
        </div>
      </div>
      <div className="p-6">
        {/* Today's Interviews */}
        {!detailed && todaysInterviews?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
              <Icon name="Clock" size={18} className="text-accent" />
              <span>Phỏng vấn hôm nay ({todaysInterviews?.length})</span>
            </h3>
            <div className="space-y-3">
              {todaysInterviews?.map((interview) => (
                <div 
                  key={interview?.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      interview?.status === 'confirmed' ? 'bg-success' :
                      interview?.status === 'pending' ? 'bg-warning' : 'bg-accent'
                    }`} />
                    <div>
                      <div className="font-medium text-foreground">
                        {interview?.candidateName}
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <span>{interview?.time}</span>
                        <span>{interview?.position}</span>
                        <div className="flex items-center space-x-1">
                          <Icon name={getTypeIcon(interview?.type)} size={14} />
                          <span>{interview?.type === 'online' ? 'Online' : 'Offline'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {interview?.type === 'online' && (
                      <Button variant="outline" size="sm" iconName="Video" iconPosition="left">
                        Tham gia
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Interviews */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="CalendarDays" size={18} className="text-primary" />
            <span>
              {detailed ? 'Tất cả lịch phỏng vấn' : 'Sắp tới'} ({upcomingInterviews?.length})
            </span>
          </h3>

          <div className="space-y-4">
            {upcomingInterviews?.map((interview) => (
              <div 
                key={interview?.id}
                className="border border-border rounded-lg p-4 hover:shadow-elevation-1 transition-smooth"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="text-lg font-bold text-foreground">
                        {formatDate(interview?.date)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getDayOfWeek(interview?.date)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-foreground">
                          {interview?.candidateName}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(interview?.status)}`}>
                          {getStatusLabel(interview?.status)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        {interview?.position}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={14} />
                          <span>{interview?.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name={getTypeIcon(interview?.type)} size={14} />
                          <span>
                            {interview?.type === 'online' ?'Online - ' + (interview?.meetingLink ? 'Google Meet' : 'Zoom')
                              : 'Offline - ' + interview?.location
                            }
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="User" size={14} />
                          <span>PV: {interview?.interviewer}</span>
                        </div>
                      </div>
                      
                      {interview?.notes && (
                        <div className="mt-2 p-2 bg-muted rounded text-sm text-muted-foreground">
                          {interview?.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {interview?.type === 'online' && interview?.status === 'confirmed' && (
                      <Button variant="outline" size="sm" iconName="Video" iconPosition="left">
                        Tham gia
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" iconName="Edit" iconPosition="left">
                      Sửa
                    </Button>
                    <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
                  </div>
                </div>

                {/* Quick Actions */}
                {detailed && (
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" iconName="MessageCircle" iconPosition="left">
                        Nhắn tin ứng viên
                      </Button>
                      <Button variant="ghost" size="sm" iconName="FileText" iconPosition="left">
                        Xem CV
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {interview?.status === 'pending' && (
                        <>
                          <Button variant="outline" size="sm" iconName="Check" iconPosition="left">
                            Xác nhận
                          </Button>
                          <Button variant="ghost" size="sm" iconName="Calendar" iconPosition="left">
                            Dời lịch
                          </Button>
                        </>
                      )}
                      {interview?.status === 'confirmed' && (
                        <Button variant="ghost" size="sm" iconName="X" iconPosition="left">
                          Hủy lịch
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {upcomingInterviews?.length === 0 && (
            <div className="text-center py-8">
              <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Chưa có lịch phỏng vấn nào
              </h3>
              <p className="text-muted-foreground mb-4">
                Lên lịch phỏng vấn với ứng viên để bắt đầu quá trình tuyển dụng
              </p>
              <Button 
                variant="default" 
                iconName="Plus" 
                iconPosition="left"
                onClick={() => setShowScheduleForm(true)}
              >
                Lên lịch phỏng vấn đầu tiên
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Schedule Interview Form Modal (placeholder) */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Lên lịch phỏng vấn mới
              </h3>
              <button 
                onClick={() => setShowScheduleForm(false)}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="p-6 text-center text-muted-foreground">
              Form lên lịch phỏng vấn sẽ được implement ở đây
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewScheduler;