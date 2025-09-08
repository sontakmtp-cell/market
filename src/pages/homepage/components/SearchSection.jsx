import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

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
    
    // Simulate search delay
    setTimeout(() => {
      const searchParams = new URLSearchParams({
        q: searchQuery,
        category: searchCategory
      });
      
      // Navigate based on category
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

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Tìm kiếm nhanh chóng
          </h2>
          <p className="text-xl text-muted-foreground">
            Khám phá hàng nghìn dự án, chuyên gia và sản phẩm kỹ thuật chất lượng cao
          </p>
        </div>

        {/* Main Search Form */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-elevation-2 mb-12">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  type="search"
                  placeholder="Tìm kiếm dự án, chuyên gia, sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="h-12"
                />
              </div>
              <div>
                <Select
                  options={searchCategories}
                  value={searchCategory}
                  onChange={setSearchCategory}
                  placeholder="Danh mục"
                />
              </div>
              <div>
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
              </div>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Tìm kiếm phổ biến:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches?.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handlePopularSearch(search)}
                  className="inline-flex items-center space-x-2 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <Icon name={search?.icon} size={14} />
                  <span>{search?.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions?.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action)}
              className="bg-card border border-border rounded-xl p-6 text-left hover:shadow-elevation-2 hover:scale-105 transition-all duration-300 group"
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
            </button>
          ))}
        </div>

        {/* Search Tips */}
        <div className="mt-12 bg-muted/50 rounded-xl p-6">
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
        </div>
      </div>
    </section>
  );
};

export default SearchSection;