import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ filters, onFiltersChange, jobCount = 0, isOpen, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const categories = [
    { id: 'structural', label: 'Kết cấu', icon: 'Building', count: 45 },
    { id: 'mechanical', label: 'Cơ khí', icon: 'Cog', count: 32 },
    { id: 'electronic', label: 'Điện tử', icon: 'Zap', count: 28 },
    { id: 'crane', label: 'Cần cẩu', icon: 'Truck', count: 15 },
    { id: 'architecture', label: 'Kiến trúc', icon: 'Home', count: 38 }
  ];

  const budgetRanges = [
    { id: 'under-5m', label: 'Dưới 5 triệu VND', min: 0, max: 5000000, count: 23 },
    { id: '5m-15m', label: '5 - 15 triệu VND', min: 5000000, max: 15000000, count: 41 },
    { id: '15m-30m', label: '15 - 30 triệu VND', min: 15000000, max: 30000000, count: 28 },
    { id: '30m-50m', label: '30 - 50 triệu VND', min: 30000000, max: 50000000, count: 15 },
    { id: 'over-50m', label: 'Trên 50 triệu VND', min: 50000000, max: Infinity, count: 8 }
  ];

  const durations = [
    { id: 'less-1week', label: 'Dưới 1 tuần', count: 12 },
    { id: '1-4weeks', label: '1 - 4 tuần', count: 35 },
    { id: '1-3months', label: '1 - 3 tháng', count: 42 },
    { id: '3-6months', label: '3 - 6 tháng', count: 18 },
    { id: 'over-6months', label: 'Trên 6 tháng', count: 8 }
  ];

  const experienceLevels = [
    { id: 'entry', label: 'Mới bắt đầu', count: 25 },
    { id: 'intermediate', label: 'Trung cấp', count: 48 },
    { id: 'expert', label: 'Chuyên gia', count: 32 }
  ];

  const locations = [
    { id: 'hanoi', label: 'Hà Nội', count: 45 },
    { id: 'hcm', label: 'TP. Hồ Chí Minh', count: 52 },
    { id: 'danang', label: 'Đà Nẵng', count: 18 },
    { id: 'remote', label: 'Làm việc từ xa', count: 38 }
  ];

  const handleFilterChange = (filterType, value, checked) => {
    const newFilters = { ...localFilters };
    
    if (filterType === 'categories' || filterType === 'budgetRanges' || 
        filterType === 'durations' || filterType === 'experienceLevels' || 
        filterType === 'locations') {
      if (!newFilters?.[filterType]) {
        newFilters[filterType] = [];
      }
      
      if (checked) {
        newFilters[filterType] = [...newFilters?.[filterType], value];
      } else {
        newFilters[filterType] = newFilters?.[filterType]?.filter(item => item !== value);
      }
    } else {
      newFilters[filterType] = value;
    }
    
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    if (onClose) onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      categories: [],
      budgetRanges: [],
      durations: [],
      experienceLevels: [],
      locations: [],
      skills: '',
      isUrgent: false,
      hasProposals: false
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [isExpanded, setIsExpanded] = useState(defaultOpen);
    
    return (
      <div className="border-b border-border pb-4 mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="font-medium text-foreground">{title}</h3>
          <Icon 
            name="ChevronDown" 
            size={16} 
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
        {isExpanded && children}
      </div>
    );
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Bộ lọc</h2>
          <p className="text-sm text-muted-foreground">{jobCount} công việc</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <Icon name="X" size={20} />
          </Button>
        )}
      </div>

      {/* Search Skills */}
      <div>
        <Input
          label="Tìm theo kỹ năng"
          type="search"
          placeholder="VD: AutoCAD, SolidWorks..."
          value={localFilters?.skills || ''}
          onChange={(e) => handleFilterChange('skills', e?.target?.value)}
          className="mb-4"
        />
      </div>

      {/* Categories */}
      <FilterSection title="Danh mục">
        <div className="space-y-3">
          {categories?.map((category) => (
            <div key={category?.id} className="flex items-center justify-between">
              <Checkbox
                label={
                  <div className="flex items-center space-x-2">
                    <Icon name={category?.icon} size={16} />
                    <span>{category?.label}</span>
                  </div>
                }
                checked={localFilters?.categories?.includes(category?.id) || false}
                onChange={(e) => handleFilterChange('categories', category?.id, e?.target?.checked)}
              />
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {category?.count}
              </span>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Budget Range */}
      <FilterSection title="Ngân sách">
        <div className="space-y-3">
          {budgetRanges?.map((range) => (
            <div key={range?.id} className="flex items-center justify-between">
              <Checkbox
                label={range?.label}
                checked={localFilters?.budgetRanges?.includes(range?.id) || false}
                onChange={(e) => handleFilterChange('budgetRanges', range?.id, e?.target?.checked)}
              />
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {range?.count}
              </span>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Duration */}
      <FilterSection title="Thời gian dự án">
        <div className="space-y-3">
          {durations?.map((duration) => (
            <div key={duration?.id} className="flex items-center justify-between">
              <Checkbox
                label={duration?.label}
                checked={localFilters?.durations?.includes(duration?.id) || false}
                onChange={(e) => handleFilterChange('durations', duration?.id, e?.target?.checked)}
              />
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {duration?.count}
              </span>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Experience Level */}
      <FilterSection title="Trình độ yêu cầu">
        <div className="space-y-3">
          {experienceLevels?.map((level) => (
            <div key={level?.id} className="flex items-center justify-between">
              <Checkbox
                label={level?.label}
                checked={localFilters?.experienceLevels?.includes(level?.id) || false}
                onChange={(e) => handleFilterChange('experienceLevels', level?.id, e?.target?.checked)}
              />
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {level?.count}
              </span>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Location */}
      <FilterSection title="Địa điểm">
        <div className="space-y-3">
          {locations?.map((location) => (
            <div key={location?.id} className="flex items-center justify-between">
              <Checkbox
                label={location?.label}
                checked={localFilters?.locations?.includes(location?.id) || false}
                onChange={(e) => handleFilterChange('locations', location?.id, e?.target?.checked)}
              />
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {location?.count}
              </span>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Special Filters */}
      <FilterSection title="Bộ lọc đặc biệt">
        <div className="space-y-3">
          <Checkbox
            label="Chỉ công việc khẩn cấp"
            checked={localFilters?.isUrgent || false}
            onChange={(e) => handleFilterChange('isUrgent', e?.target?.checked)}
          />
          <Checkbox
            label="Chưa có đề xuất nào"
            checked={localFilters?.hasProposals || false}
            onChange={(e) => handleFilterChange('hasProposals', e?.target?.checked)}
          />
        </div>
      </FilterSection>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4 border-t border-border">
        <Button variant="default" fullWidth onClick={handleApplyFilters}>
          <Icon name="Filter" size={16} className="mr-2" />
          Áp dụng bộ lọc
        </Button>
        <Button variant="outline" fullWidth onClick={handleClearFilters}>
          <Icon name="RotateCcw" size={16} className="mr-2" />
          Xóa tất cả
        </Button>
      </div>
    </div>
  );

  // Mobile overlay
  if (isOpen && onClose) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-card border-l border-border overflow-y-auto">
          <div className="p-6">
            {sidebarContent}
          </div>
        </div>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <div className="hidden lg:block w-80 bg-card border-r border-border overflow-y-auto">
      <div className="p-6 sticky top-0">
        {sidebarContent}
      </div>
    </div>
  );
};

export default FilterSidebar;