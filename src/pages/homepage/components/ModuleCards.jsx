import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ModuleCards = () => {
  const modules = [
    {
      id: 'job-marketplace',
      title: 'Thị trường việc làm',
      description: 'Tìm kiếm và đăng tuyển các dự án kỹ thuật chuyên nghiệp từ thiết kế cơ khí, điện tử đến kiến trúc và xây dựng.',
      icon: 'Briefcase',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-100',
      path: '/job-marketplace',
      stats: '1,247 dự án đang mở',
      features: [
        'Thiết kế cơ khí & điện tử',
        'Kiến trúc & xây dựng',
        'Tính toán kết cấu',
        'Quản lý dự án'
      ]
    },
    {
      id: 'recruitment',
      title: 'Tuyển dụng & CV',
      description: 'Nền tảng tuyển dụng chuyên biệt cho ngành kỹ thuật với hệ thống lọc ứng viên thông minh và quản lý CV chuyên nghiệp.',
      icon: 'Users',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100',
      path: '/recruitment',
      stats: '3,892 ứng viên chất lượng',
      features: [
        'Tìm kiếm ứng viên',
        'Quản lý CV chuyên nghiệp',
        'Phỏng vấn trực tuyến',
        'Đánh giá kỹ năng'
      ]
    },
    {
      id: 'product-store',
      title: 'Cửa hàng sản phẩm',
      description: 'Mua sắm sách kỹ thuật, phần mềm chuyên ngành, khóa học trực tuyến và vật liệu kỹ thuật chất lượng cao.',
      icon: 'ShoppingCart',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:bg-purple-100',
      path: '/store',
      stats: '15,634 sản phẩm có sẵn',
      features: [
        'Sách & tài liệu kỹ thuật',
        'Phần mềm chuyên ngành',
        'Khóa học trực tuyến',
        'Vật liệu & thiết bị'
      ]
    },
    {
      id: 'calculation-tools',
      title: 'Công cụ tính toán',
      description: 'Bộ công cụ tính toán kỹ thuật chuyên nghiệp cho cần cẩu, ổ bi, dung sai và nhiều ứng dụng kỹ thuật khác.',
      icon: 'Calculator',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      hoverColor: 'hover:bg-orange-100',
      path: '/tools',
      stats: '28 công cụ chuyên nghiệp',
      features: [
        'Tính toán cần cẩu',
        'Lựa chọn ổ bi',
        'Tính dung sai',
        'Xuất báo cáo PDF'
      ]
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Giải pháp kỹ thuật toàn diện
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Khám phá bốn module chính của nền tảng, được thiết kế đặc biệt 
            để đáp ứng mọi nhu cầu kỹ thuật của doanh nghiệp và chuyên gia Việt Nam.
          </p>
        </div>

        {/* Module Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {modules?.map((module) => (
            <div
              key={module.id}
              className={`group relative bg-card border ${module.borderColor} rounded-2xl p-8 transition-all duration-300 hover:shadow-elevation-3 ${module.hoverColor} hover:scale-[1.02]`}
            >
              {/* Module Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 ${module.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon name={module.icon} size={32} className={module.iconColor} />
              </div>

              {/* Module Content */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {module.title}
                  </h3>
                  <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {module.stats}
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {module.description}
                </p>

                {/* Features List */}
                <div className="grid grid-cols-2 gap-2">
                  {module.features?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon name="Check" size={16} className="text-success flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <Link to={module.path} className="block">
                <Button 
                  variant="outline" 
                  fullWidth 
                  iconName="ArrowRight" 
                  iconPosition="right"
                  className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                >
                  Khám phá ngay
                </Button>
              </Link>

              {/* Decorative Element */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon name={module.icon} size={64} className={module.iconColor} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-muted rounded-2xl p-6">
            <div className="flex items-center space-x-2">
              <Icon name="Sparkles" size={24} className="text-primary" />
              <span className="text-lg font-semibold text-foreground">
                Không tìm thấy những gì bạn cần?
              </span>
            </div>
            <Link to="/register">
              <Button variant="default" iconName="MessageCircle" iconPosition="left">
                Liên hệ tư vấn
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleCards;