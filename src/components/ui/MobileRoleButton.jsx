import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

/**
 * MobileRoleButton - Compact role switcher for mobile header
 */
const MobileRoleButton = ({ currentRole, roles = {}, onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeRole = roles[currentRole] || Object.values(roles)[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (roleKey) => {
    setIsOpen(false);
    
    // Đảm bảo callback được gọi sau khi dropdown đã đóng
    setTimeout(() => {
      if (onRoleChange) {
        onRoleChange(roleKey);
      }
    }, 100);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Compact Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-2 py-1.5 rounded-md border border-border bg-card hover:bg-muted transition-smooth"
      >
        {activeRole?.icon && (
          <Icon name={activeRole.icon} size={16} className="text-foreground" />
        )}
        <span className="text-xs font-medium text-foreground max-w-[60px] truncate">
          {activeRole?.title || 'Role'}
        </span>
        <Icon 
          name="ChevronDown" 
          size={12} 
          className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-md shadow-lg z-50">
          <div className="py-1">
            {Object.entries(roles).map(([key, role]) => (
              <button
                key={key}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelect(key);
                }}
                className={`w-full flex items-center space-x-2 px-3 py-2 text-sm text-left transition-colors ${
                  key === currentRole
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {role.icon && <Icon name={role.icon} size={16} />}
                <div className="flex-1">
                  <div className="font-medium">{role.title}</div>
                  <div className="text-xs text-muted-foreground">{role.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileRoleButton;
