import React from 'react';
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
}) => {
  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between space-x-3">
          <div className="flex-1 flex items-center space-x-3">
            <div className="relative w-full max-w-xl">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search roles, skills, company..."
                className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm"
              >
                <option value="newest">Newest</option>
                <option value="salary-high">Salary: High to Low</option>
                <option value="salary-low">Salary: Low to High</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center bg-muted rounded-md p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`px-3 py-1.5 text-sm rounded ${viewMode === 'grid' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                title="Grid"
              >
                Grid
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-3 py-1.5 text-sm rounded ${viewMode === 'list' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                title="List"
              >
                List
              </button>
            </div>
            <Link to="/recruitment-management-dashboard">
              <Button variant="default" size="sm">
                <Icon name="LayoutDashboard" size={16} className="mr-2" /> Dashboard
              </Button>
            </Link>
            <Button variant="outline" className="md:hidden" onClick={onFilterToggle}>
              <Icon name="Sliders" size={16} className="mr-2" /> Filters
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mt-2">{jobCount} jobs</div>
      </div>
    </div>
  );
};

export default SearchHeader;

