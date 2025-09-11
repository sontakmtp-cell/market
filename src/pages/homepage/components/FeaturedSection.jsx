import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { motion } from 'framer-motion';

const FeaturedSection = () => {
  const featuredFreelancers = [
    {
      id: 1,
      name: 'Nguyễn Văn Minh',
      title: 'Kỹ sư Cơ khí - Chuyên gia AutoCAD',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      completedProjects: 127,
      skills: ['AutoCAD', 'SolidWorks', 'Thiết kế cơ khí'],
      hourlyRate: '450.000',
      location: 'TP. Hồ Chí Minh',
      verified: true
    },
    {
      id: 2,
      name: 'Trần Thị Lan',
      title: 'Kiến trúc sư - Chuyên gia Revit',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      completedProjects: 89,
      skills: ['Revit', 'SketchUp', 'Thiết kế kiến trúc'],
      hourlyRate: '520.000',
      location: 'Hà Nội',
      verified: true
    },
    {
      id: 3,
      name: 'Lê Hoàng Đức',
      title: 'Kỹ sư Điện tử - IoT Specialist',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      completedProjects: 156,
      skills: ['Arduino', 'IoT', 'PCB Design'],
      hourlyRate: '380.000',
      location: 'Đà Nẵng',
      verified: true
    }
  ];

  const recentJobs = [
    {
      id: 1,
      title: 'Thiết kế hệ thống cần cẩu 50 tấn',
      company: 'Công ty TNHH Xây dựng Miền Nam',
      budget: '25.000.000 - 35.000.000 VNĐ',
      deadline: '15 ngày',
      skills: ['Tính toán kết cấu', 'AutoCAD', 'Cần cẩu'],
      applicants: 12,
      posted: '2 giờ trước',
      urgent: true
    },
    {
      id: 2,
      title: 'Phát triển ứng dụng IoT cho nhà máy',
      company: 'Tập đoàn Công nghiệp Việt',
      budget: '45.000.000 - 60.000.000 VNĐ',
      deadline: '30 ngày',
      skills: ['IoT', 'Python', 'Database'],
      applicants: 8,
      posted: '5 giờ trước',
      urgent: false
    },
    {
      id: 3,
      title: 'Thiết kế kiến trúc văn phòng 20 tầng',
      company: 'Công ty Bất động sản Đại Phát',
      budget: '80.000.000 - 120.000.000 VNĐ',
      deadline: '45 ngày',
      skills: ['Revit', 'Kiến trúc', '3D Modeling'],
      applicants: 15,
      posted: '1 ngày trước',
      urgent: false
    }
  ];

  const popularProducts = [
    {
      id: 1,
      title: 'Sổ tay Kỹ thuật Cơ khí 2024',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop',
      price: '850.000',
      originalPrice: '1.200.000',
      rating: 4.7,
      reviews: 234,
      category: 'Sách kỹ thuật',
      bestseller: true
    },
    {
      id: 2,
      title: 'Khóa học AutoCAD từ cơ bản đến nâng cao',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
      price: '2.500.000',
      originalPrice: '3.500.000',
      rating: 4.9,
      reviews: 1847,
      category: 'Khóa học',
      bestseller: true
    },
    {
      id: 3,
      title: 'Phần mềm tính toán kết cấu Pro',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
      price: '12.000.000',
      originalPrice: '15.000.000',
      rating: 4.6,
      reviews: 89,
      category: 'Phần mềm',
      bestseller: false
    }
  ];

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Freelancers */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Chuyên gia nổi bật
              </h2>
              <p className="text-muted-foreground">
                Kết nối với những freelancer kỹ thuật hàng đầu Việt Nam
              </p>
            </div>
            <Link to="/job-marketplace">
              <Button variant="outline" iconName="ArrowRight" iconPosition="right">
                Xem tất cả
              </Button>
            </Link>
          </div>

          <motion.div className="grid md:grid-cols-3 gap-6" variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            {featuredFreelancers?.map((freelancer) => (
              <motion.div key={freelancer?.id} className="bg-card border border-border rounded-2xl p-6 hover:shadow-elevation-2 transition-shadow" variants={item} whileHover={{ y: -4 }}>
                <div className="flex items-start space-x-4 mb-4">
                  <div className="relative">
                    <Image
                      src={freelancer?.avatar}
                      alt={freelancer?.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {freelancer?.verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                        <Icon name="Check" size={12} color="white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{freelancer?.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{freelancer?.title}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="Star" size={12} className="text-warning fill-current" />
                        <span>{freelancer?.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="CheckCircle" size={12} />
                        <span>{freelancer?.completedProjects} dự án</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {freelancer?.skills?.slice(0, 3)?.map((skill, index) => (
                      <span key={index} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <div className="text-lg font-bold text-foreground">{freelancer?.hourlyRate}đ/giờ</div>
                      <div className="text-xs text-muted-foreground flex items-center space-x-1">
                        <Icon name="MapPin" size={12} />
                        <span>{freelancer?.location}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Liên hệ
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Recent Jobs */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Dự án mới nhất
              </h2>
              <p className="text-muted-foreground">
                Cơ hội việc làm hấp dẫn đang chờ bạn
              </p>
            </div>
            <Link to="/job-marketplace">
              <Button variant="outline" iconName="ArrowRight" iconPosition="right">
                Xem tất cả
              </Button>
            </Link>
          </div>

          <motion.div className="space-y-4" variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            {recentJobs?.map((job) => (
              <motion.div key={job?.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-elevation-1 transition-shadow" variants={item}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{job?.title}</h3>
                      {job?.urgent && (
                        <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full">
                          Gấp
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">{job?.company}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job?.skills?.map((skill, index) => (
                        <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground mb-1">{job?.budget}</div>
                    <div className="text-sm text-muted-foreground">{job?.deadline}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Users" size={14} />
                      <span>{job?.applicants} ứng viên</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>{job?.posted}</span>
                    </div>
                  </div>
                  <Link to="/job-details">
                    <Button variant="outline" size="sm">
                      Xem chi tiết
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Popular Products */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Sản phẩm phổ biến
              </h2>
              <p className="text-muted-foreground">
                Tài liệu và công cụ kỹ thuật được yêu thích nhất
              </p>
            </div>
            <Link to="/store">
              <Button variant="outline" iconName="ArrowRight" iconPosition="right">
                Xem cửa hàng
              </Button>
            </Link>
          </div>

          <motion.div className="grid md:grid-cols-3 gap-6" variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            {popularProducts?.map((product) => (
              <motion.div key={product?.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-elevation-2 transition-shadow" variants={item} whileHover={{ y: -4 }}>
                <div className="relative">
                  <Image
                    src={product?.image}
                    alt={product?.title}
                    className="w-full h-48 object-cover"
                  />
                  {product?.bestseller && (
                    <div className="absolute top-3 left-3 bg-success text-success-foreground text-xs px-2 py-1 rounded-full">
                      Bán chạy
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                    {product?.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {product?.title}
                  </h3>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={14} className="text-warning fill-current" />
                      <span className="text-sm text-muted-foreground">{product?.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product?.reviews} đánh giá)</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-foreground">{product?.price}đ</div>
                      {product?.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          {product?.originalPrice}đ
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm" iconName="ShoppingCart" iconPosition="left">
                      Mua ngay
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;