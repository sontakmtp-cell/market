import React, { forwardRef, useState } from 'react';
import { useTranslation } from '../../contexts/I18nContext';
import { cn } from '../../utils/cn';
import { ariaHelpers, focusVisible, generateId } from '../../utils/accessibility';

// Enhanced Input with better accessibility
const Input = forwardRef(({
  type = 'text',
  className = '',
  disabled = false,
  required = false,
  error,
  label,
  description,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  autoComplete,
  maxLength,
  minLength,
  pattern,
  showPasswordToggle = false,
  leftIcon,
  rightIcon,
  leftContent,
  rightContent,
  size = 'default',
  variant = 'default',
  ...props
}, ref) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputId = generateId('input');
  const errorId = error ? generateId('error') : undefined;
  const descriptionId = description ? generateId('description') : undefined;
  const labelId = label ? generateId('label') : undefined;

  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Base styles
  const baseStyles = `
    flex w-full border border-border bg-background px-3 py-2 text-sm 
    placeholder:text-muted-foreground transition-smooth
    disabled:cursor-not-allowed disabled:opacity-50
    ${focusVisible}
  `;

  // Variant styles
  const variants = {
    default: 'rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20',
    outline: 'rounded-lg border-2 focus:border-primary',
    filled: 'rounded-md bg-muted border-transparent focus:bg-background focus:border-primary',
  };

  // Size styles
  const sizes = {
    sm: 'h-8 px-2 text-xs',
    default: 'h-10 px-3 py-2',
    lg: 'h-12 px-4 text-base',
  };

  // Error styles
  const errorStyles = error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : '';

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const ariaAttributes = {
    ...ariaHelpers.field(
      required,
      !!error,
      [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
      labelId
    ),
  };

  const containerClasses = cn(
    'relative',
    leftIcon || leftContent ? 'pl-10' : '',
    rightIcon || rightContent || (type === 'password' && showPasswordToggle) ? 'pr-10' : ''
  );

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          id={labelId}
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium text-foreground mb-1',
            required && 'after:content-["*"] after:ml-1 after:text-destructive'
          )}
        >
          {label}
        </label>
      )}

      {/* Description */}
      {description && (
        <p id={descriptionId} className="text-xs text-muted-foreground mb-2">
          {description}
        </p>
      )}

      {/* Input Container */}
      <div className={containerClasses}>
        {/* Left Icon/Content */}
        {(leftIcon || leftContent) && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftContent || (leftIcon && (
              <div className="h-4 w-4">
                {/* Icon implementation */}
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={cn(
            baseStyles,
            variants[variant],
            sizes[size],
            errorStyles,
            leftIcon || leftContent ? 'pl-10' : '',
            rightIcon || rightContent || (type === 'password' && showPasswordToggle) ? 'pr-10' : '',
            className
          )}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          {...ariaAttributes}
          {...props}
        />

        {/* Right Icon/Content */}
        {(rightIcon || rightContent || (type === 'password' && showPasswordToggle)) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {type === 'password' && showPasswordToggle ? (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={cn(
                  'text-muted-foreground hover:text-foreground transition-smooth p-1 rounded',
                  focusVisible
                )}
                aria-label={showPassword ? t('forms.hidePassword') : t('forms.showPassword')}
                tabIndex={-1}
              >
                <div className="h-4 w-4">
                  {/* Eye icon implementation */}
                  {showPassword ? '🙈' : '👁️'}
                </div>
              </button>
            ) : (
              rightContent || (rightIcon && (
                <div className="h-4 w-4 text-muted-foreground">
                  {/* Icon implementation */}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Character Count */}
      {maxLength && (
        <div className="flex justify-end mt-1">
          <span className={cn(
            'text-xs',
            value?.length > maxLength * 0.9 ? 'text-warning' : 'text-muted-foreground',
            value?.length === maxLength ? 'text-destructive' : ''
          )}>
            {value?.length || 0}/{maxLength}
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p id={errorId} className="text-xs text-destructive mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
