import React from 'react';
import Icon from '../../../components/AppIcon';

const RoleIndicator = ({ currentLanguage }) => {
  const roles = [
    {
      id: 'freelancer',
      icon: 'User',
      title: currentLanguage === 'vi' ? 'Freelancer' : 'Freelancer',
      description: currentLanguage === 'vi' ?'Chuyên gia kỹ thuật độc lập' :'Independent technical expert',
      credentials: 'freelancer@techmarket.vn'
    },
    {
      id: 'client',
      icon: 'Briefcase',
      title: currentLanguage === 'vi' ? 'Khách hàng' : 'Client',
      description: currentLanguage === 'vi' ?'Tìm kiếm dịch vụ kỹ thuật' :'Seeking technical services',
      credentials: 'client@techmarket.vn'
    },
    {
      id: 'employer',
      icon: 'Building',
      title: currentLanguage === 'vi' ? 'Nhà tuyển dụng' : 'Employer',
      description: currentLanguage === 'vi' ?'Tuyển dụng nhân tài kỹ thuật' :'Recruiting technical talent',
      credentials: 'employer@techmarket.vn'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          {currentLanguage === 'vi' ? 'Chọn loại tài khoản' : 'Choose Account Type'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {currentLanguage === 'vi' ?'Sử dụng thông tin đăng nhập mẫu bên dưới' :'Use the sample credentials below'
          }
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles?.map((role) => (
          <div
            key={role?.id}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-1 transition-smooth"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name={role?.icon} size={24} className="text-primary" />
              </div>
              
              <div>
                <h3 className="font-medium text-foreground">{role?.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {role?.description}
                </p>
              </div>
              
              <div className="w-full pt-2 border-t border-border">
                <div className="text-xs text-muted-foreground mb-1">
                  {currentLanguage === 'vi' ? 'Email mẫu:' : 'Sample email:'}
                </div>
                <code className="text-xs bg-muted px-2 py-1 rounded text-foreground font-mono">
                  {role?.credentials}
                </code>
                <div className="text-xs text-muted-foreground mt-1">
                  {currentLanguage === 'vi' ? 'Mật khẩu:' : 'Password:'} 
                  <code className="ml-1 bg-muted px-1 rounded">{role?.id}123</code>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleIndicator;