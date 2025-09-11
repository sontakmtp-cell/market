import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { motion } from 'framer-motion';

const HeroBanner = () => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const fade = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const float = {
    initial: { y: 0 },
    animate: { y: [0, -8, 0], transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }
  };

  return (
    <motion.section
      className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div className="space-y-8 relative z-10" variants={container}>
            <div className="space-y-4">
              <motion.div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium" variants={fadeUp}>
                <Icon name="Zap" size={16} />
                <span>Nền tảng kỹ thuật hàng đầu Việt Nam</span>
              </motion.div>
              <motion.h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight" variants={fadeUp}>
                Kết nối
                <span className="text-primary"> chuyên gia kỹ thuật</span>
                <br />
                với dự án của bạn
              </motion.h1>
              <motion.p className="text-xl text-muted-foreground leading-relaxed" variants={fadeUp}>
                Tìm kiếm freelancer kỹ thuật chuyên nghiệp, tuyển dụng nhân tài, 
                mua sắm sản phẩm kỹ thuật và sử dụng công cụ tính toán chuyên ngành 
                - tất cả trong một nền tảng duy nhất.
              </motion.p>
            </div>

            <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeUp}>
              <Link to="/login">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="default" size="lg" iconName="ArrowRight" iconPosition="right">
                    Bắt đầu ngay
                  </Button>
                </motion.div>
              </Link>
              <Link to="/job-marketplace">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" size="lg" iconName="Search" iconPosition="left">
                    Khám phá dự án
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div className="flex items-center space-x-8 pt-8 border-t border-border" variants={fadeUp}>
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={20} className="text-success" />
                <span className="text-sm text-muted-foreground">Chứng nhận ISO 27001</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Award" size={20} className="text-success" />
                <span className="text-sm text-muted-foreground">Top 10 Sao Khuê 2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={20} className="text-success" />
                <span className="text-sm text-muted-foreground">50,000+ chuyên gia</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div className="relative" variants={fade}>
            <motion.div className="relative z-10" variants={fadeUp}>
              <motion.div variants={float} initial="initial" animate="animate">
                <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop"
                  alt="Vietnamese engineers working on technical projects"
                  className="w-full h-[500px] object-cover rounded-2xl shadow-elevation-3"
                />
              </motion.div>

              {/* Floating Cards */}
              <motion.div className="absolute -top-4 -left-4 bg-card border border-border rounded-xl p-4 shadow-elevation-2 glass-morphism"
                initial={{ opacity: 0, x: -16, y: -16 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                    <Icon name="CheckCircle" size={20} color="white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">2,847 dự án</div>
                    <div className="text-xs text-muted-foreground">hoàn thành tháng này</div>
                  </div>
                </div>
              </motion.div>

              <motion.div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-xl p-4 shadow-elevation-2 glass-morphism"
                initial={{ opacity: 0, x: 16, y: 16 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="TrendingUp" size={20} color="white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">98.5% hài lòng</div>
                    <div className="text-xs text-muted-foreground">đánh giá khách hàng</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl transform rotate-3 scale-105 -z-10"></div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroBanner;
