import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const SearchHeader = ({ 
  searchQuery, 
  onSearchChange, 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewModeChange,
  onFilterToggle,
  jobCount = 0,
  userRole = 'freelancer',
  filters = {} // Add this parameter with default value
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const sortOptions = [
    { value: 'relevance', label: 'Liên quan nhất', icon: 'Target' },
    { value: 'newest', label: 'Mới nhất', icon: 'Clock' },
    { value: 'budget-high', label: 'Ngân sách cao', icon: 'TrendingUp' },
    { value: 'budget-low', label: 'Ngân sách thấp', icon: 'TrendingDown' },
    { value: 'deadline', label: 'Hạn chót gần', icon: 'Calendar' }
  ];

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    onSearchChange(localSearchQuery);
  };

  const handleSearchClear = () => {
    setLocalSearchQuery('');
    onSearchChange('');
  };

  const getSortIcon = (value) => {
    const option = sortOptions?.find(opt => opt?.value === value);
    return option ? option?.icon : 'ArrowUpDown';
  };

  const getSortLabel = (value) => {
    const option = sortOptions?.find(opt => opt?.value === value);
    return option ? option?.label : 'Sắp xếp';
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="p-6 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Tìm kiếm công việc, kỹ năng, hoặc từ khóa..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e?.target?.value)}
              className="w-full pl-10 pr-20 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {localSearchQuery && (
              <button
                type="button"
                onClick={handleSearchClear}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Icon name="X" size={16} />
              </button>
            )}
            <Button
              type="submit"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Icon name="Search" size={16} />
            </Button>
          </div>
        </form>

        {/* Controls Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left Side - Results Count & Filter Toggle */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={onFilterToggle}
              className="lg:hidden"
            >
              <Icon name="Filter" size={16} className="mr-2" />
              Bộ lọc
            </Button>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{jobCount?.toLocaleString('vi-VN')}</span> công việc
              {searchQuery && (
                <span> cho "<span className="font-medium text-foreground">{searchQuery}</span>"</span>
              )}
            </div>
          </div>

          {/* Right Side - Sort & View Controls */}
          <div className="flex items-center space-x-3">
            <Link to="/freelancer-dashboard">
              <Button variant="default" size="sm">
                <Icon name="LayoutDashboard" size={16} className="mr-2" />
                Dashboard
              </Button>
            </Link>
            {/* Sort Dropdown */}
            <div className="relative group">
              <Button variant="outline" className="flex items-center space-x-2">
                <Icon name={getSortIcon(sortBy)} size={16} />
                <span className="hidden sm:inline">{getSortLabel(sortBy)}</span>
                <Icon name="ChevronDown" size={14} />
              </Button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevation-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth z-10">
                <div className="py-2">
                  {sortOptions?.map((option) => (
                    <button
                      key={option?.value}
                      onClick={() => onSortChange(option?.value)}
                      className={`flex items-center space-x-3 w-full px-4 py-2 text-sm transition-smooth ${
                        sortBy === option?.value
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={option?.icon} size={16} />
                      <span>{option?.label}</span>
                      {sortBy === option?.value && (
                        <Icon name="Check" size={14} className="ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center border border-border rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded transition-smooth ${
                  viewMode === 'grid' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name="Grid3X3" size={16} />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded transition-smooth ${
                  viewMode === 'list' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name="List" size={16} />
              </button>
            </div>

            {/* Post Job Button for Clients */}
            {userRole === 'client' && (
              <Link to="/employer-job-posting">
                <Button variant="default">
                  <Icon name="Plus" size={16} className="mr-2" />
                  <span className="hidden sm:inline">Đăng dự án mới</span>
                  <span className="sm:hidden">Đăng</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || Object.values(filters || {})?.some(f => Array.isArray(f) ? f?.length > 0 : f)) && (
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Bộ lọc đang áp dụng:</span>
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                Tìm kiếm: {searchQuery}
                <button
                  onClick={handleSearchClear}
                  className="ml-2 hover:bg-primary-foreground hover:bg-opacity-20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHeader;