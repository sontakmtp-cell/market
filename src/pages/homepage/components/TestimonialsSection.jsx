import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { motion } from 'framer-motion';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Nguyễn Minh Tuấn',
      position: 'Giám đốc Kỹ thuật',
      company: 'Công ty TNHH Xây dựng Hòa Bình',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      content: `TechMarketplace Pro đã giúp chúng tôi tìm được những kỹ sư tài năng cho dự án cầu vượt 500 tỷ. 
      Quy trình tuyển dụng minh bạch, chất lượng ứng viên rất cao. Đặc biệt ấn tượng với hệ thống đánh giá kỹ năng chuyên nghiệp.`,
      rating: 5,
      projectValue: '500 tỷ VNĐ',
      industry: 'Xây dựng & Hạ tầng'
    },
    {
      id: 2,
      name: 'Trần Thị Mai Lan',
      position: 'Trưởng phòng R&D',
      company: 'Tập đoàn Công nghiệp FPT',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
      content: `Nền tảng này thực sự là giải pháp toàn diện cho nhu cầu kỹ thuật của doanh nghiệp. 
      Từ tuyển dụng nhân tài đến mua sắm phần mềm chuyên ngành, tất cả đều có chất lượng cao và giá cả hợp lý.`,
      rating: 5,
      projectValue: '1.2 tỷ VNĐ',
      industry: 'Công nghệ & Sản xuất'
    },
    {
      id: 3,
      name: 'Lê Văn Hùng',
      position: 'Kỹ sư trưởng',
      company: 'Công ty CP Cơ khí Đông Á',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: `Công cụ tính toán kỹ thuật trên nền tảng rất chính xác và tiện lợi. 
      Đã sử dụng để thiết kế hệ thống cần cẩu cho nhiều dự án lớn. Tiết kiệm được rất nhiều thời gian và chi phí.`,
      rating: 5,
      projectValue: '300 triệu VNĐ',
      industry: 'Cơ khí & Chế tạo'
    }
  ];

  const companyLogos = [
    { name: 'Vingroup', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=60&fit=crop' },
    { name: 'FPT Corporation', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=60&fit=crop' },
    { name: 'Viettel Group', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=60&fit=crop' },
    { name: 'Hòa Phát Group', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=60&fit=crop' },
    { name: 'Coteccons', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=60&fit=crop' },
    { name: 'Techcombank', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=60&fit=crop' }
  ];

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hơn 2,000 doanh nghiệp Việt Nam đã tin tưởng và sử dụng 
            TechMarketplace Pro cho các dự án kỹ thuật quan trọng
          </p>
        </div>

        {/* Testimonials Grid */}
        <motion.div className="grid lg:grid-cols-3 gap-8 mb-16" variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          {testimonials?.map((testimonial) => (
            <motion.div key={testimonial?.id} className="bg-card border border-border rounded-2xl p-8 hover:shadow-elevation-2 transition-shadow" variants={item}>
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(testimonial?.rating)]?.map((_, index) => (
                  <Icon key={index} name="Star" size={20} className="text-warning fill-current" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-muted-foreground leading-relaxed mb-6">
                "{testimonial?.content}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-start space-x-4">
                <Image
                  src={testimonial?.avatar}
                  alt={testimonial?.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground">{testimonial?.name}</div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {testimonial?.position}
                  </div>
                  <div className="text-sm font-medium text-primary mb-2">
                    {testimonial?.company}
                  </div>
                  
                  {/* Project Details */}
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="DollarSign" size={12} />
                      <span>{testimonial?.projectValue}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Building" size={12} />
                      <span>{testimonial?.industry}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Company Logos */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-8">
            Được tin tưởng bởi các doanh nghiệp hàng đầu Việt Nam
          </h3>
          
          <motion.div className="flex flex-wrap items-center justify-center gap-8 opacity-60 hover:opacity-80 transition-opacity" variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {companyLogos?.map((company, index) => (
              <motion.div key={index} className="flex items-center justify-center w-24 h-12 bg-card border border-border rounded-lg p-2 hover:shadow-elevation-1 transition-shadow" variants={item}>
                <Image
                  src={company?.logo}
                  alt={`${company?.name} logo`}
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Trust Metrics */}
        <motion.div className="mt-16 bg-card border border-border rounded-2xl p-8" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
          <motion.div className="grid md:grid-cols-3 gap-8 text-center" variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div className="space-y-2" variants={item}>
              <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={32} className="text-success" />
              </div>
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="text-sm text-muted-foreground">Bảo mật thông tin</div>
              <div className="text-xs text-muted-foreground">
                Tuân thủ tiêu chuẩn ISO 27001
              </div>
            </motion.div>
            
            <motion.div className="space-y-2" variants={item}>
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="Clock" size={32} className="text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">&lt; 24h</div>
              <div className="text-sm text-muted-foreground">Thời gian phản hồi</div>
              <div className="text-xs text-muted-foreground">
                Hỗ trợ khách hàng 24/7
              </div>
            </motion.div>
            
            <motion.div className="space-y-2" variants={item}>
              <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="Award" size={32} className="text-warning" />
              </div>
              <div className="text-2xl font-bold text-foreground">98.5%</div>
              <div className="text-sm text-muted-foreground">Độ hài lòng</div>
              <div className="text-xs text-muted-foreground">
                Từ hơn 10,000 đánh giá
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;