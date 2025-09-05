import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ApplicationForm = ({ data, onChange, errors }) => {
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handleQuickFill = () => {
    // Simulate filling from existing profile
    const profileData = {
      fullName: 'Nguyễn Văn An',
      email: 'nguyenvanan@email.com',
      phone: '0901234567',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      linkedin: 'https://linkedin.com/in/nguyenvanan',
      github: 'https://github.com/nguyenvanan',
      portfolio: 'https://portfolio.nguyenvanan.com',
      summary: 'Lập trình viên Full-stack với 5 năm kinh nghiệm phát triển web applications. Thành thạo React, Node.js và có passion với công nghệ mới.'
    };
    onChange(profileData);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">
            Thông tin cá nhân
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickFill}
            iconName="User"
          >
            Điền từ hồ sơ có sẵn
          </Button>
        </div>
        <p className="text-muted-foreground">
          Cung cấp thông tin liên hệ chính xác để nhà tuyển dụng có thể liên hệ với bạn.
        </p>
      </div>
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Họ và tên"
            placeholder="Nguyễn Văn An"
            value={data?.fullName || ''}
            onChange={(e) => handleChange('fullName', e?.target?.value)}
            error={errors?.fullName}
            required
          />
          <Input
            type="email"
            label="Email"
            placeholder="nguyenvanan@email.com"
            value={data?.email || ''}
            onChange={(e) => handleChange('email', e?.target?.value)}
            error={errors?.email}
            required
            description="Email chính để nhận thông báo về đơn ứng tuyển"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="tel"
            label="Số điện thoại"
            placeholder="0901234567"
            value={data?.phone || ''}
            onChange={(e) => handleChange('phone', e?.target?.value)}
            error={errors?.phone}
            required
          />
          <Input
            label="Địa chỉ hiện tại"
            placeholder="123 Đường ABC, Quận 1, TP.HCM"
            value={data?.address || ''}
            onChange={(e) => handleChange('address', e?.target?.value)}
          />
        </div>

        {/* Professional Summary */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Tóm tắt bản thân
            <span className="text-muted-foreground ml-2 font-normal">(Tùy chọn)</span>
          </label>
          <textarea
            placeholder="Mô tả ngắn gọn về kinh nghiệm, kỹ năng và mục tiêu nghề nghiệp của bạn..."
            value={data?.summary || ''}
            onChange={(e) => handleChange('summary', e?.target?.value)}
            rows={4}
            className="w-full p-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Một tóm tắt tốt sẽ giúp nhà tuyển dụng hiểu rõ hơn về bạn
          </p>
        </div>

        {/* Optional Professional Links */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <button
              type="button"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-smooth flex items-center"
            >
              <Icon 
                name={showOptionalFields ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="mr-1" 
              />
              Thông tin bổ sung (Tùy chọn)
            </button>
            <span className="text-xs text-muted-foreground">
              Giúp tăng độ tin cậy của hồ sơ
            </span>
          </div>

          {showOptionalFields && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <Input
                label="LinkedIn Profile"
                placeholder="https://linkedin.com/in/your-profile"
                value={data?.linkedin || ''}
                onChange={(e) => handleChange('linkedin', e?.target?.value)}
                description="Liên kết đến profile LinkedIn của bạn"
              />
              
              <Input
                label="GitHub Profile"
                placeholder="https://github.com/your-username"
                value={data?.github || ''}
                onChange={(e) => handleChange('github', e?.target?.value)}
                description="Để nhà tuyển dụng xem các dự án code của bạn"
              />
              
              <Input
                label="Portfolio Website"
                placeholder="https://your-portfolio.com"
                value={data?.portfolio || ''}
                onChange={(e) => handleChange('portfolio', e?.target?.value)}
                description="Website cá nhân showcasing các project của bạn"
              />
            </div>
          )}
        </div>

        {/* Data Privacy Notice */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
          <h4 className="font-medium text-foreground mb-2 flex items-center">
            <Icon name="Shield" size={16} className="mr-2 text-blue-600" />
            Bảo mật thông tin
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>✓ Thông tin của bạn được bảo mật và chỉ chia sẻ với nhà tuyển dụng</p>
            <p>✓ Email và số điện thoại không được sử dụng cho mục đích quảng cáo</p>
            <p>✓ Bạn có thể yêu cầu xóa thông tin bất kỳ lúc nào</p>
          </div>
        </div>

        {/* Validation Summary */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">Kiểm tra thông tin:</h4>
          <div className="space-y-1 text-sm">
            <div className={`flex items-center space-x-2 ${
              data?.fullName ? 'text-success' : 'text-muted-foreground'
            }`}>
              <Icon name={data?.fullName ? "CheckCircle" : "Circle"} size={14} />
              <span>Họ và tên</span>
            </div>
            <div className={`flex items-center space-x-2 ${
              data?.email && /\S+@\S+\.\S+/?.test(data?.email) ? 'text-success' : 'text-muted-foreground'
            }`}>
              <Icon name={data?.email && /\S+@\S+\.\S+/?.test(data?.email) ? "CheckCircle" : "Circle"} size={14} />
              <span>Email hợp lệ</span>
            </div>
            <div className={`flex items-center space-x-2 ${
              data?.phone ? 'text-success' : 'text-muted-foreground'
            }`}>
              <Icon name={data?.phone ? "CheckCircle" : "Circle"} size={14} />
              <span>Số điện thoại</span>
            </div>
            <div className={`flex items-center space-x-2 ${
              data?.summary || data?.linkedin || data?.github || data?.portfolio ? 'text-success' : 'text-muted-foreground'
            }`}>
              <Icon name={data?.summary || data?.linkedin || data?.github || data?.portfolio ? "CheckCircle" : "Circle"} size={14} />
              <span>Thông tin bổ sung (giúp nổi bật hồ sơ)</span>
            </div>
          </div>
        </div>

        {/* Auto-save indicator */}
        {Object.values(data)?.some(value => value) && (
          <div className="text-xs text-muted-foreground flex items-center justify-center space-x-1 p-2 bg-muted/50 rounded">
            <Icon name="Save" size={12} />
            <span>Thông tin được tự động lưu nháp</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationForm;