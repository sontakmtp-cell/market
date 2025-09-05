import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ApplicationStatusTracker = ({ candidateView = false }) => {
  const [selectedApplication, setSelectedApplication] = useState(null);

  const applications = [
    {
      id: 1,
      jobTitle: 'Kỹ sư Cơ khí Senior - Thiết kế Máy móc',
      company: 'Công ty TNHH Cơ khí Chính Xác Việt Nam',
      appliedDate: '2025-01-05',
      status: 'interview',
      currentStage: 'Phỏng vấn vòng 1',
      nextStep: 'Phỏng vấn vòng 2',
      estimatedCompletion: '2025-01-12',
      notes: 'Phỏng vấn kỹ thuật đã hoàn thành tốt. Chờ kết quả từ hiring manager.',
      stages: [
        { name: 'Nộp đơn', status: 'completed', date: '2025-01-05', icon: 'FileText' },
        { name: 'Sàng lọc CV', status: 'completed', date: '2025-01-06', icon: 'Filter' },
        { name: 'Phỏng vấn vòng 1', status: 'current', date: '2025-01-08', icon: 'Users' },
        { name: 'Phỏng vấn vòng 2', status: 'pending', date: null, icon: 'UserCheck' },
        { name: 'Quyết định cuối', status: 'pending', date: null, icon: 'CheckCircle' }
      ],
      interviewDetails: {
        date: '2025-01-08',
        time: '14:00 - 15:00',
        interviewer: 'Phạm Văn Thành - Trưởng phòng Kỹ thuật',
        type: 'online',
        feedback: 'Ứng viên có kiến thức kỹ thuật tốt, kinh nghiệm phù hợp'
      }
    },
    {
      id: 2,
      jobTitle: 'Chuyên viên Tính toán Kết cấu',
      company: 'Tập đoàn Xây dựng Hòa Bình',
      appliedDate: '2025-01-04',
      status: 'offer',
      currentStage: 'Đã gửi offer',
      nextStep: 'Chờ phản hồi từ ứng viên',
      estimatedCompletion: '2025-01-10',
      notes: 'Offer đã được gửi với mức lương 25 triệu VNĐ. Thời hạn phản hồi đến 10/01.',
      stages: [
        { name: 'Nộp đơn', status: 'completed', date: '2025-01-04', icon: 'FileText' },
        { name: 'Sàng lọc CV', status: 'completed', date: '2025-01-05', icon: 'Filter' },
        { name: 'Phỏng vấn vòng 1', status: 'completed', date: '2025-01-07', icon: 'Users' },
        { name: 'Phỏng vấn vòng 2', status: 'completed', date: '2025-01-08', icon: 'UserCheck' },
        { name: 'Offer', status: 'current', date: '2025-01-09', icon: 'Mail' },
        { name: 'Hoàn tất', status: 'pending', date: null, icon: 'Trophy' }
      ],
      offerDetails: {
        salary: '25,000,000 VNĐ',
        startDate: '2025-01-15',
        benefits: 'Bảo hiểm full, thưởng tháng 13, review lương 6 tháng/lần'
      }
    },
    {
      id: 3,
      jobTitle: 'Kỹ sư Điện - Tự động hóa',
      company: 'Nhà máy Samsung Việt Nam',
      appliedDate: '2025-01-03',
      status: 'screening',
      currentStage: 'Đang sàng lọc CV',
      nextStep: 'Chờ kết quả sàng lọc',
      estimatedCompletion: '2025-01-15',
      notes: 'CV đã được tiếp nhận và đang trong quá trình đánh giá.',
      stages: [
        { name: 'Nộp đơn', status: 'completed', date: '2025-01-03', icon: 'FileText' },
        { name: 'Sàng lọc CV', status: 'current', date: '2025-01-04', icon: 'Filter' },
        { name: 'Phỏng vấn vòng 1', status: 'pending', date: null, icon: 'Users' },
        { name: 'Phỏng vấn vòng 2', status: 'pending', date: null, icon: 'UserCheck' },
        { name: 'Quyết định cuối', status: 'pending', date: null, icon: 'CheckCircle' }
      ]
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      screening: 'text-warning bg-warning/10',
      interview: 'text-accent bg-accent/10',
      offer: 'text-success bg-success/10',
      rejected: 'text-error bg-error/10',
      hired: 'text-primary bg-primary/10'
    };
    return colors?.[status] || colors?.screening;
  };

  const getStatusLabel = (status) => {
    const labels = {
      screening: 'Đang sàng lọc',
      interview: 'Phỏng vấn',
      offer: 'Đã có offer',
      rejected: 'Từ chối',
      hired: 'Đã tuyển'
    };
    return labels?.[status] || 'Không xác định';
  };

  const getStageStatus = (stage) => {
    const colors = {
      completed: 'bg-success text-white',
      current: 'bg-primary text-white',
      pending: 'bg-muted text-muted-foreground'
    };
    return colors?.[stage] || colors?.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date?.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="FileText" size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            {candidateView ? 'Trạng thái ứng tuyển' : 'Theo dõi đơn ứng tuyển'}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Filter" iconPosition="left">
            Lọc
          </Button>
          <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {applications?.map((application) => (
            <div key={application?.id} className="border border-border rounded-lg p-4">
              {/* Application Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer">
                      {application?.jobTitle}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application?.status)}`}>
                      {getStatusLabel(application?.status)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <Icon name="Building2" size={14} />
                      <span>{application?.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={14} />
                      <span>Nộp đơn: {formatDate(application?.appliedDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>{calculateDaysAgo(application?.appliedDate)} ngày trước</span>
                    </div>
                  </div>

                  <div className="text-sm mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-muted-foreground">Giai đoạn hiện tại:</span>
                      <span className="font-medium text-foreground">{application?.currentStage}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">Bước tiếp theo:</span>
                      <span className="font-medium text-primary">{application?.nextStep}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-2">
                    Dự kiến hoàn thành
                  </div>
                  <div className="font-medium text-foreground">
                    {formatDate(application?.estimatedCompletion)}
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  {application?.stages?.map((stage, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      {/* Stage Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${getStageStatus(stage?.status)}`}>
                        <Icon name={stage?.icon} size={16} />
                      </div>
                      
                      {/* Stage Name */}
                      <div className="text-xs text-center mb-1 font-medium text-foreground">
                        {stage?.name}
                      </div>
                      
                      {/* Stage Date */}
                      {stage?.date && (
                        <div className="text-xs text-muted-foreground text-center">
                          {formatDate(stage?.date)}
                        </div>
                      )}
                      
                      {/* Connection Line */}
                      {index < application?.stages?.length - 1 && (
                        <div className={`hidden lg:block absolute h-0.5 w-full top-5 left-1/2 transform translate-x-1/2 ${
                          stage?.status === 'completed' ? 'bg-success' : 'bg-border'
                        }`} style={{ zIndex: -1 }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              {application?.notes && (
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="MessageSquare" size={16} className="text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground mb-1">Ghi chú</div>
                      <p className="text-sm text-muted-foreground">{application?.notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Interview Details */}
              {application?.interviewDetails && (
                <div className="mb-4 p-3 bg-accent/5 border border-accent/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="Calendar" size={16} className="text-accent mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground mb-2">Chi tiết phỏng vấn</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Thời gian: </span>
                          <span className="text-foreground">{formatDate(application?.interviewDetails?.date)} - {application?.interviewDetails?.time}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Người PV: </span>
                          <span className="text-foreground">{application?.interviewDetails?.interviewer}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Hình thức: </span>
                          <span className="text-foreground">{application?.interviewDetails?.type === 'online' ? 'Trực tuyến' : 'Trực tiếp'}</span>
                        </div>
                      </div>
                      {application?.interviewDetails?.feedback && (
                        <div className="mt-2">
                          <span className="text-muted-foreground">Nhận xét: </span>
                          <span className="text-foreground">{application?.interviewDetails?.feedback}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Offer Details */}
              {application?.offerDetails && (
                <div className="mb-4 p-3 bg-success/5 border border-success/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="Mail" size={16} className="text-success mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground mb-2">Chi tiết offer</div>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-muted-foreground">Mức lương: </span>
                          <span className="font-medium text-success">{application?.offerDetails?.salary}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Ngày bắt đầu: </span>
                          <span className="text-foreground">{formatDate(application?.offerDetails?.startDate)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phúc lợi: </span>
                          <span className="text-foreground">{application?.offerDetails?.benefits}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" iconName="MessageCircle" iconPosition="left">
                    Nhắn tin HR
                  </Button>
                  <Button variant="ghost" size="sm" iconName="FileText" iconPosition="left">
                    Xem mô tả việc làm
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  {application?.status === 'offer' && candidateView && (
                    <>
                      <Button variant="outline" size="sm" iconName="X" iconPosition="left">
                        Từ chối offer
                      </Button>
                      <Button variant="success" size="sm" iconName="Check" iconPosition="left">
                        Chấp nhận offer
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm" iconName="Eye" iconPosition="left">
                    Chi tiết
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {applications?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {candidateView ? 'Chưa có đơn ứng tuyển nào' : 'Chưa có ứng viên nào'}
            </h3>
            <p className="text-muted-foreground">
              {candidateView 
                ? 'Bắt đầu ứng tuyển để theo dõi trạng thái tại đây' :'Các đơn ứng tuyển sẽ hiển thị ở đây khi có ứng viên'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationStatusTracker;