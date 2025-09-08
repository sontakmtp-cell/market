import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentFeedback = () => {
  const feedbackData = [
    {
      id: 1,
      clientName: 'Nguyễn Văn Minh',
      projectTitle: 'Thiết kế hệ thống cầu trục 5 tấn',
      rating: 5,
      comment: 'Công việc xuất sắc! Thiết kế rất chi tiết và chuyên nghiệp. Giao hàng đúng hạn và hỗ trợ tận tình.',
      date: '2025-01-03',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
      clientName: 'Trần Thị Lan',
      projectTitle: 'Tính toán kết cấu thép nhà xưởng',
      rating: 5,
      comment: 'Rất hài lòng với chất lượng công việc. Tính toán chính xác và báo cáo rõ ràng.',
      date: '2025-01-02',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 3,
      clientName: 'Lê Hoàng Nam',
      projectTitle: 'Thiết kế hệ thống băng tải',
      rating: 4,
      comment: 'Công việc tốt, đúng yêu cầu kỹ thuật. Có thể cải thiện thêm về thời gian phản hồi.',
      date: '2024-12-30',
      avatar: 'https://randomuser.me/api/portraits/men/56.jpg'
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={index < rating ? 'text-warning fill-current' : 'text-muted-foreground'}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const averageRating = (feedbackData?.reduce((sum, feedback) => sum + feedback?.rating, 0) / feedbackData?.length)?.toFixed(1);

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="MessageCircle" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Đánh giá gần đây</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-sm font-medium text-foreground">{averageRating}</span>
            <span className="text-sm text-muted-foreground">({feedbackData?.length} đánh giá)</span>
          </div>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {feedbackData?.map((feedback) => (
          <div key={feedback?.id} className="p-4 border-b border-border last:border-b-0">
            <div className="flex items-start space-x-3">
              <img
                src={feedback?.avatar}
                alt={feedback?.clientName}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = '/assets/images/no_image.png';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{feedback?.clientName}</h4>
                    <p className="text-xs text-muted-foreground">{feedback?.projectTitle}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(feedback?.rating)}
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(feedback?.date)}</span>
                  </div>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{feedback?.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Tổng cộng {feedbackData?.length} đánh giá trong 30 ngày qua
          </div>
          <button className="text-sm text-primary hover:text-primary/80 transition-smooth">
            Xem tất cả đánh giá
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentFeedback;