import React, { forwardRef } from 'react';
import { useTranslation } from '../../contexts/I18nContext';
import { cn } from '../../utils/cn';
import { ariaHelpers, focusVisible, generateId } from '../../utils/accessibility';

// Enhanced Button with better accessibility
const Button = forwardRef(({
  variant = 'default',
  size = 'default',
  className = '',
  children,
  disabled = false,
  loading = false,
  iconName,
  iconPosition = 'left',
  iconSize = 16,
  fullWidth = false,
  pressed,
  describedBy,
  label,
  loadingText,
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const { t } = useTranslation();
  const buttonId = generateId('button');

  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center font-medium transition-smooth 
    disabled:pointer-events-none disabled:opacity-50 
    ${focusVisible}
    ${fullWidth ? 'w-full' : ''}
  `;

  // Variant styles
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90',
    outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/90',
    ghost: 'hover:bg-accent hover:text-accent-foreground active:bg-accent/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95',
    success: 'bg-success text-success-foreground hover:bg-success/90 active:bg-success/95',
    warning: 'bg-warning text-warning-foreground hover:bg-warning/90 active:bg-warning/95',
  };

  // Size styles
  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-md',
    default: 'h-10 px-4 py-2 text-sm rounded-lg',
    lg: 'h-12 px-6 text-base rounded-lg',
    icon: 'h-10 w-10 rounded-lg',
    'icon-sm': 'h-8 w-8 rounded-md',
  };

  const Icon = iconName ? () => {
    try {
      const IconComponent = require('lucide-react')[iconName];
      return IconComponent ? <IconComponent size={iconSize} /> : null;
    } catch {
      return null;
    }
  } : null;

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const ariaAttributes = {
    ...ariaHelpers.button(pressed, label, describedBy),
    'aria-disabled': disabled || loading,
    'aria-busy': loading,
  };

  return (
    <button
      ref={ref}
      id={buttonId}
      type={type}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      onClick={handleClick}
      {...ariaAttributes}
      {...props}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" 
             role="status" 
             aria-label={t('common.loading')} />
      )}
      
      {Icon && iconPosition === 'left' && !loading && (
        <Icon />
      )}
      
      {children && (
        <span className={cn(
          Icon && iconPosition === 'left' && !loading ? 'ml-2' : '',
          Icon && iconPosition === 'right' ? 'mr-2' : ''
        )}>
          {loading && loadingText ? loadingText : children}
        </span>
      )}
      
      {Icon && iconPosition === 'right' && !loading && (
        <Icon />
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
