import React from 'react';
import Icon from '../../../components/AppIcon';

const RoleSelectionCard = ({ role, isSelected, onSelect }) => {
  const roleConfig = {
    client: {
      title: 'Khách hàng',
      description: 'Tôi cần thuê freelancer cho các dự án kỹ thuật',
      icon: 'User',
      benefits: [
        'Đăng dự án miễn phí',
        'Tiếp cận hàng nghìn freelancer',
        'Quản lý dự án dễ dàng',
        'Thanh toán an toàn'
      ]
    },
    freelancer: {
      title: 'Freelancer',
      description: 'Tôi muốn làm việc với các dự án kỹ thuật',
      icon: 'Briefcase',
      benefits: [
        'Tìm việc phù hợp',
        'Đặt giá cạnh tranh',
        'Xây dựng danh tiếng',
        'Thu nhập ổn định'
      ]
    },
    employer: {
      title: 'Nhà tuyển dụng',
      description: 'Tôi cần tuyển dụng nhân tài kỹ thuật',
      icon: 'Users',
      benefits: [
        'Đăng tin tuyển dụng',
        'Tìm ứng viên chất lượng',
        'Quản lý ứng tuyển',
        'Phỏng vấn trực tuyến'
      ]
    },
    candidate: {
      title: 'Ứng viên',
      description: 'Tôi muốn tìm và ứng tuyển việc làm kỹ thuật',
      icon: 'UserCheck',
      benefits: [
        'Tạo hồ sơ chuyên nghiệp',
        'Tìm và ứng tuyển nhanh',
        'Theo dõi trạng thái ứng tuyển',
        'Nhận gợi ý việc làm phù hợp'
      ]
    }
  };

  const config = roleConfig?.[role];

  return (
    <div
      onClick={() => onSelect(role)}
      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-elevation-2'
          : 'border-border bg-card hover:border-primary/50 hover:shadow-elevation-1'
      }`}
    >
      {/* Selection Indicator */}
      <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
        isSelected
          ? 'border-primary bg-primary' :'border-muted-foreground/30'
      }`}>
        {isSelected && <Icon name="Check" size={14} color="white" />}
      </div>
      {/* Role Icon */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      }`}>
        <Icon name={config?.icon} size={24} />
      </div>
      {/* Role Info */}
      <h3 className="text-lg font-semibold text-foreground mb-2">{config?.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{config?.description}</p>
      {/* Benefits */}
      <ul className="space-y-2">
        {config?.benefits?.map((benefit, index) => (
          <li key={index} className="flex items-center space-x-2 text-sm text-foreground">
            <Icon name="Check" size={14} className="text-success flex-shrink-0" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoleSelectionCard;
