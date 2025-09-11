import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { motion } from 'framer-motion';

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const searchCategories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'jobs', label: 'Dự án' },
    { value: 'freelancers', label: 'Chuyên gia' },
    { value: 'products', label: 'Sản phẩm' },
    { value: 'tools', label: 'Công cụ' }
  ];

  const popularSearches = [
    { text: 'Thiết kế cơ khí', category: 'jobs', icon: 'Settings' },
    { text: 'Kỹ sư AutoCAD', category: 'freelancers', icon: 'User' },
    { text: 'Sách kỹ thuật', category: 'products', icon: 'Book' },
    { text: 'Tính toán cần cẩu', category: 'tools', icon: 'Calculator' },
    { text: 'Kiến trúc sư Revit', category: 'freelancers', icon: 'User' },
    { text: 'Phần mềm CAD', category: 'products', icon: 'Monitor' }
  ];

  const quickActions = [
    {
      title: 'Đăng dự án',
      description: 'Tìm chuyên gia cho dự án của bạn',
      icon: 'Plus',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      path: '/job-marketplace'
    },
    {
      title: 'Tìm việc làm',
      description: 'Khám phá cơ hội nghề nghiệp',
      icon: 'Search',
      color: 'text-success',
      bgColor: 'bg-success/10',
      path: '/job-marketplace'
    },
    {
      title: 'Mua sắm',
      description: 'Sản phẩm kỹ thuật chất lượng',
      icon: 'ShoppingCart',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      path: '/store'
    },
    {
      title: 'Công cụ tính toán',
      description: 'Giải pháp kỹ thuật chuyên nghiệp',
      icon: 'Calculator',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      path: '/tools'
    }
  ];

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery?.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      const searchParams = new URLSearchParams({
        q: searchQuery,
        category: searchCategory
      });
      switch (searchCategory) {
        case 'jobs':
          navigate(`/job-marketplace?${searchParams}`);
          break;
        case 'freelancers':
          navigate(`/freelancer-dashboard?${searchParams}`);
          break;
        case 'products':
          navigate(`/store?${searchParams}`);
          break;
        case 'tools':
          navigate(`/tools?${searchParams}`);
          break;
        default:
          navigate(`/job-marketplace?${searchParams}`);
      }
      setIsSearching(false);
    }, 1000);
  };

  const handlePopularSearch = (search) => {
    setSearchQuery(search?.text);
    setSearchCategory(search?.category);
  };

  const handleQuickAction = (action) => {
    navigate(action?.path);
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={container}>
          <motion.h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" variants={fadeUp}>
            Tìm kiếm nhanh chóng
          </motion.h2>
          <motion.p className="text-xl text-muted-foreground" variants={fadeUp}>
            Khám phá hàng nghìn dự án, chuyên gia và sản phẩm kỹ thuật chất lượng cao
          </motion.p>
        </motion.div>

        {/* Main Search Form */}
        <motion.div className="bg-card border border-border rounded-2xl p-8 shadow-elevation-2 mb-12" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <motion.div className="md:col-span-2" initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
                <Input
                  type="search"
                  placeholder="Tìm kiếm dự án, chuyên gia, sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="h-12"
                />
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.05 }}>
                <Select
                  options={searchCategories}
                  value={searchCategory}
                  onChange={setSearchCategory}
                  placeholder="Danh mục"
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}>
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  fullWidth
                  loading={isSearching}
                  iconName="Search"
                  iconPosition="left"
                  disabled={!searchQuery?.trim()}
                >
                  Tìm kiếm
                </Button>
              </motion.div>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Tìm kiếm phổ biến:</span>
            </div>
            <motion.div className="flex flex-wrap gap-2" variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {popularSearches?.map((search, index) => (
                <motion.button
                  key={index}
                  onClick={() => handlePopularSearch(search)}
                  className="inline-flex items-center space-x-2 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg text-sm transition-colors"
                  variants={fadeUp}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon name={search?.icon} size={14} />
                  <span>{search?.text}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4" variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {quickActions?.map((action, index) => (
            <motion.button
              key={index}
              onClick={() => handleQuickAction(action)}
              className="bg-card border border-border rounded-xl p-6 text-left hover:shadow-elevation-2 hover:scale-105 transition-all duration-300 group"
              variants={fadeUp}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 ${action?.bgColor} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                <Icon name={action?.icon} size={24} className={action?.color} />
              </div>
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {action?.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {action?.description}
              </p>
              <div className="flex items-center space-x-1 mt-3 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                <span>Khám phá ngay</span>
                <Icon name="ArrowRight" size={12} />
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Search Tips */}
        <motion.div className="mt-12 bg-muted/50 rounded-xl p-6" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
          <div className="flex items-start space-x-3">
            <Icon name="Lightbulb" size={20} className="text-warning flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-medium text-foreground mb-2">Mẹo tìm kiếm hiệu quả:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Sử dụng từ khóa cụ thể như "AutoCAD", "Revit", "IoT"</li>
                <li>• Thêm địa điểm để tìm chuyên gia gần bạn</li>
                <li>• Lọc theo danh mục để có kết quả chính xác hơn</li>
                <li>• Sử dụng dấu ngoặc kép cho cụm từ chính xác</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchSection;