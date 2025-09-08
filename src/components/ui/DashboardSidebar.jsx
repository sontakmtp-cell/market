import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const DashboardSidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const [expandedSections, setExpandedSections] = useState({
    projects: true,
    profile: false,
    tools: false
  });
  const location = useLocation();

  const sidebarSections = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'LayoutDashboard',
      path: '/freelancer-dashboard',
      exact: true
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: 'Briefcase',
      expandable: true,
      items: [
        { label: 'Active Projects', path: '/freelancer-dashboard/projects/active', icon: 'Play' },
        { label: 'Proposals', path: '/freelancer-dashboard/projects/proposals', icon: 'FileText' },
        { label: 'Completed', path: '/freelancer-dashboard/projects/completed', icon: 'CheckCircle' },
        { label: 'Find New Work', path: '/job-marketplace', icon: 'Search' }
      ]
    },
    {
      id: 'earnings',
      label: 'Earnings',
      icon: 'DollarSign',
      path: '/freelancer-dashboard/earnings'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: 'MessageSquare',
      path: '/freelancer-dashboard/messages',
      badge: '3'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'User',
      expandable: true,
      items: [
        { label: 'View Profile', path: '/freelancer-dashboard/profile/view', icon: 'Eye' },
        { label: 'Edit Profile', path: '/freelancer-dashboard/profile/edit', icon: 'Edit' },
        { label: 'Portfolio', path: '/freelancer-dashboard/profile/portfolio', icon: 'Folder' },
        { label: 'Skills & Tests', path: '/freelancer-dashboard/profile/skills', icon: 'Award' }
      ]
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: 'Calculator',
      expandable: true,
      items: [
        { label: 'Time Tracker', path: '/freelancer-dashboard/tools/time-tracker', icon: 'Clock' },
        { label: 'Invoice Generator', path: '/freelancer-dashboard/tools/invoices', icon: 'Receipt' },
        { label: 'Calculators', path: '/tools', icon: 'Calculator' }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: 'BarChart3',
      path: '/freelancer-dashboard/reports'
    }
  ];

  const isActivePath = (path, exact = false) => {
    if (exact) {
      return location?.pathname === path;
    }
    return location?.pathname === path || location?.pathname?.startsWith(path + '/');
  };

  const toggleSection = (sectionId) => {
    if (isCollapsed) return;
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev?.[sectionId]
    }));
  };

  const renderSidebarItem = (item, isSubItem = false) => {
    const isActive = isActivePath(item?.path, item?.exact);
    const hasSubItems = item?.expandable && item?.items;
    const isExpanded = expandedSections?.[item?.id];

    return (
      <div key={item?.id || item?.path} className="space-y-1">
        {hasSubItems ? (
          <button
            onClick={() => toggleSection(item?.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            } ${isSubItem ? 'pl-6' : ''}`}
          >
            <div className="flex items-center space-x-3">
              <Icon name={item?.icon} size={18} />
              {!isCollapsed && <span>{item?.label}</span>}
            </div>
            {!isCollapsed && (
              <Icon 
                name="ChevronDown" 
                size={14} 
                className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            )}
          </button>
        ) : (
          <Link
            to={item?.path}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            } ${isSubItem ? 'pl-6' : ''}`}
          >
            <div className="flex items-center space-x-3">
              <Icon name={item?.icon} size={18} />
              {!isCollapsed && <span>{item?.label}</span>}
            </div>
            {!isCollapsed && item?.badge && (
              <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
                {item?.badge}
              </span>
            )}
          </Link>
        )}
        {/* Sub Items */}
        {hasSubItems && isExpanded && !isCollapsed && (
          <div className="ml-3 space-y-1 border-l border-border pl-3">
            {item?.items?.map((subItem) => (
              <Link
                key={subItem?.path}
                to={subItem?.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-smooth ${
                  isActivePath(subItem?.path)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={subItem?.icon} size={16} />
                <span>{subItem?.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`fixed left-0 top-16 bottom-0 z-40 bg-card border-r border-border transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } lg:translate-x-0`}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Icon name="LayoutDashboard" size={20} className="text-primary" />
              <span className="font-semibold text-foreground">Dashboard</span>
            </div>
          )}
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="hover:bg-muted"
            >
              <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarSections?.map((section) => renderSidebarItem(section))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  Professional Account
                </div>
                <div className="text-xs text-muted-foreground">
                  Freelancer
                </div>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="mt-3 space-y-2">
              <Link to="/profile">
                <Button variant="ghost" size="sm" fullWidth className="justify-start">
                  <Icon name="Settings" size={14} className="mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;