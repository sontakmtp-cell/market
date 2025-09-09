import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import RoleDropdown from './RoleSwitcherDropdown';
import { ROLE_CONFIG } from '../../utils/constants';
import { useSupabase } from '../../contexts/SupabaseContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useSupabase();
  const location = useLocation();

  const isAuthenticated = !!user;
  const userRole = user?.user_metadata?.role || 'freelancer';
  const currentRole = (typeof window !== 'undefined' && window?.localStorage?.getItem('userRole')) || userRole;
  const usernameSlug = (user?.user_metadata?.username || user?.email?.split("@")[0] || 'user').toString();
  const publicProfilePath = `/profile/${usernameSlug}`;


  const navigationItems = [
    {
      label: 'Job Marketplace',
      path: '/job-marketplace',
      icon: 'Briefcase',
      description: 'Find technical projects and opportunities',
      disabled: false
    },
    {
      label: 'Recruitment & CV',
      path: '/recruitment-job-board',
      icon: 'Users',
      description: 'Professional hiring solutions',
      disabled: false
    },
    {
      label: 'Product Store',
      path: '/store',
      icon: 'ShoppingCart',
      description: 'Technical resources and materials',
      disabled: true
    },
    {
      label: 'Calculation Tools',
      path: '/tools',
      icon: 'Calculator',
      description: 'Engineering utilities and calculators',
      disabled: true
    }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path || location?.pathname?.startsWith(path + '/');
  };

  const handleLogout = async () => {
    try { await signOut(); } finally { window.location.href = '/login'; }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-elevation-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/homepage" className="flex items-center space-x-3 hover:opacity-80 transition-smooth">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} color="#000000" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground leading-none">Kỹ Thuật Vàng</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems?.map((item) => {
              if (item?.disabled) {
                return (
                  <div
                    key={item?.path}
                    className="px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 text-muted-foreground/50 cursor-not-allowed"
                    title="Coming soon"
                  >
                    <Icon name={item?.icon} size={16} />
                    <span>{item?.label}</span>
                  </div>
                );
              }
              
              return (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth flex items-center space-x-2 ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <RoleDropdown
                  currentRole={currentRole}
                  roles={ROLE_CONFIG}
                  onRoleChange={(roleKey) => {
                    try { localStorage.setItem('userRole', roleKey); } catch {}
                    const path = (roleKey === 'candidate' || roleKey === 'employer')
                      ? '/recruitment-management-dashboard'
                      : '/freelancer-dashboard';
                    window.location.href = path;
                  }}
                />
                <div className="relative group">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="white" />
                    </div>
                    <Icon name="ChevronDown" size={14} />
                  </Button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-elevation-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
                        <div className="font-medium text-foreground">Professional Account</div>
                        <div className="text-xs capitalize">{userRole}</div>
                      </div>
                      <Link
                        to={publicProfilePath}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                      >
                        <Icon name="Eye" size={14} />
                        <span>Profile Public</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                      >
                        <Icon name="Settings" size={14} />
                        <span>Profile Manage</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                      >
                        <Icon name="LogOut" size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="default">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background z-40 animate-slide-in-from-top">
          <div className="px-4 py-6 space-y-6">
            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navigationItems?.map((item) => {
                if (item?.disabled) {
                  return (
                    <div
                      key={item?.path}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground/50 cursor-not-allowed"
                      title="Coming soon"
                    >
                      <Icon name={item?.icon} size={20} />
                      <div>
                        <div className="font-medium">{item?.label}</div>
                        <div className="text-xs opacity-70">{item?.description}</div>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-smooth ${
                      isActivePath(item?.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={item?.icon} size={20} />
                    <div>
                      <div className="font-medium">{item?.label}</div>
                      <div className="text-xs opacity-70">{item?.description}</div>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile User Section */}
            <div className="border-t border-border pt-6">
              {isAuthenticated ? (
                <div className="space-y-3">

                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    <div className="font-medium text-foreground">Professional Account</div>
                    <div className="text-xs capitalize">{userRole}</div>
                  </div>
                  <Link
                    to={publicProfilePath}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-smooth"
                  >
                    <Icon name="Eye" size={20} />
                    <span>Profile Public</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-smooth"
                  >
                    <Icon name="Settings" size={20} />
                    <span>Profile Manage</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-smooth"
                  >
                    <Icon name="LogOut" size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full"
                  >
                    <Button variant="ghost" fullWidth>Sign In</Button>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full"
                  >
                    <Button variant="default" fullWidth>Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
