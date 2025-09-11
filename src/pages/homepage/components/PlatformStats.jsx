import React from 'react';
import Icon from '../../../components/AppIcon';
import { motion } from 'framer-motion';

const PlatformStats = () => {
  const stats = [
    {
      id: 'projects',
      label: 'Dự án hoàn thành',
      value: '12,847',
      change: '+23%',
      changeType: 'increase',
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      id: 'freelancers',
      label: 'Chuyên gia kỹ thuật',
      value: '8,392',
      change: '+15%',
      changeType: 'increase',
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 'companies',
      label: 'Doanh nghiệp tin tưởng',
      value: '2,156',
      change: '+31%',
      changeType: 'increase',
      icon: 'Building',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      id: 'satisfaction',
      label: 'Độ hài lòng',
      value: '98.5%',
      change: '+2.1%',
      changeType: 'increase',
      icon: 'Star',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  const achievements = [
    {
      title: 'Chứng nhận ISO 27001:2013',
      description: 'Bảo mật thông tin quốc tế',
      icon: 'Shield',
      verified: true
    },
    {
      title: 'Giải thưởng Sao Khuê 2024',
      description: 'Top 10 nền tảng công nghệ',
      icon: 'Award',
      verified: true
    },
    {
      title: 'Thành viên VINASA',
      description: 'Hiệp hội Phần mềm Việt Nam',
      icon: 'Users',
      verified: true
    },
    {
      title: 'Chứng nhận DMCA',
      description: 'Bảo vệ bản quyền số',
      icon: 'Lock',
      verified: true
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16" variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          {stats?.map((stat) => (
            <motion.div key={stat?.id} className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-elevation-2 transition-shadow" variants={item}>
              <div className={`inline-flex items-center justify-center w-12 h-12 ${stat?.bgColor} rounded-xl mb-4`}>
                <Icon name={stat?.icon} size={24} className={stat?.color} />
              </div>
              <div className="space-y-2">
                <motion.div className="text-3xl font-bold text-foreground" initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.3 }}>
                  {stat?.value}
                </motion.div>
                <div className="text-sm text-muted-foreground">{stat?.label}</div>
                <div className={`inline-flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${
                  stat?.changeType === 'increase' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                }`}>
                  <Icon 
                    name={stat?.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                    size={12} 
                  />
                  <span>{stat?.change} so với tháng trước</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievements Section */}
        <motion.div className="bg-card border border-border rounded-2xl p-8" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Chứng nhận & Giải thưởng
            </h3>
            <p className="text-muted-foreground">
              Được công nhận bởi các tổ chức uy tín trong và ngoài nước
            </p>
          </div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {achievements?.map((achievement, index) => (
              <motion.div key={index} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-muted/50 transition-colors" variants={item}>
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name={achievement?.icon} size={20} className="text-success" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {achievement?.title}
                    </h4>
                    {achievement?.verified && (
                      <Icon name="BadgeCheck" size={16} className="text-success flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {achievement?.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div className="mt-12 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <div className="inline-flex items-center space-x-8 bg-card border border-border rounded-2xl px-8 py-4">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={20} className="text-success" />
              <span className="text-sm font-medium text-foreground">Bảo mật SSL 256-bit</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={20} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Hỗ trợ 24/7</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CreditCard" size={20} className="text-accent" />
              <span className="text-sm font-medium text-foreground">Thanh toán an toàn</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PlatformStats;