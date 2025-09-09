import React, { useEffect, useMemo, useRef, useState } from 'react';
import Button from './Button';
import Icon from '../AppIcon';

/**
 * RoleSwitcherDropdown Component
 *
 * Props:
 * - currentRole: string (e.g., 'employer')
 * - onRoleChange: function (roleKey: string) => void
 * - roles: object like { employer: { title: 'Nhà tuyển dụng', icon: 'Briefcase' }, ... }
 */
const RoleSwitcherDropdown = ({ currentRole, onRoleChange, roles = {} }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const closeTimerRef = useRef(null);

  // Enforce display order: 1) freelancer, 2) client, 3) employer, 4) candidate
  const roleEntries = useMemo(() => {
    const order = ['freelancer', 'client', 'employer', 'candidate'];
    const list = [];
    order.forEach((key) => {
      if (roles && roles[key]) list.push([key, roles[key]]);
    });
    return list;
  }, [roles]);

  const activeRoleKey = useMemo(() => {
    if (roles && roles[currentRole]) return currentRole;
    return roleEntries.length ? roleEntries[0][0] : null;
  }, [currentRole, roles, roleEntries]);

  const activeRole = activeRoleKey ? roles[activeRoleKey] : null;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!open) return;
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [open]);

  const cancelClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => setOpen(false), 180);
  };

  const handleToggle = () => setOpen(true);
  const handleSelect = (key) => {
    if (typeof onRoleChange === 'function') {
      onRoleChange(key);
    }
    setOpen(false);
  };

  return (
    <div
      className="relative inline-block text-left"
      ref={containerRef}
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <Button
        variant="outline"
        size="sm"
        className="min-w-[160px] justify-between"
        onClick={handleToggle}
      >
        <span className="flex items-center gap-2">
          {activeRole?.icon && (
            <Icon name={activeRole.icon} size={16} className="text-foreground" />
          )}
          <span className="truncate">{activeRole?.title || 'Select role'}</span>
        </span>
        <Icon name="ChevronDown" size={16} className={`ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </Button>

      {open && (
        <div
          className="absolute left-0 mt-2 w-56 origin-top-left bg-card border shadow-lg rounded-md focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="role-switcher"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="py-1" role="none">
            {roleEntries.map(([key, cfg]) => (
              <button
                key={key}
                role="menuitem"
                onClick={() => handleSelect(key)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                  key === activeRoleKey
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {cfg?.icon && <Icon name={cfg.icon} size={16} />}
                <span className="flex-1 truncate">{cfg?.title || key}</span>
              </button>
            ))}
            {roleEntries.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">No roles available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSwitcherDropdown;
