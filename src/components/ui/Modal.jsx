import React from 'react';
import { useTranslation } from '../../contexts/I18nContext';
import { 
  useFocusTrap, 
  useEscapeKey, 
  useOutsideClick, 
  useAnnounce,
  ariaHelpers,
  focusVisible 
} from '../../utils/accessibility';
import { cn } from '../../utils/cn';

// Enhanced Modal with full accessibility
const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'default',
  closeOnEscape = true,
  closeOnOutsideClick = true,
  showCloseButton = true,
  className = '',
  overlayClassName = '',
  contentClassName = '',
}) => {
  const { t } = useTranslation();
  const { announce } = useAnnounce();
  
  // Accessibility hooks
  const { containerRef } = useFocusTrap(isOpen);
  const outsideClickRef = useOutsideClick(() => {
    if (closeOnOutsideClick) {
      onClose();
    }
  }, isOpen);

  useEscapeKey(() => {
    if (closeOnEscape) {
      onClose();
    }
  }, isOpen);

  // Announce modal opening/closing
  React.useEffect(() => {
    if (isOpen) {
      announce(t('accessibility.openDialog'));
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, announce, t]);

  if (!isOpen) return null;

  // Size styles
  const sizes = {
    sm: 'max-w-md',
    default: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  const titleId = 'modal-title';
  const descriptionId = description ? 'modal-description' : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity',
          overlayClassName
        )}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        ref={(node) => {
          containerRef.current = node;
          outsideClickRef.current = node;
        }}
        className={cn(
          'relative w-full bg-card border border-border rounded-lg shadow-elevation-3',
          'transform transition-all duration-200',
          'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2',
          sizes[size],
          className
        )}
        {...ariaHelpers.dialog(titleId, descriptionId)}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            {title && (
              <h2 id={titleId} className="text-lg font-semibold text-foreground">
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  'p-2 rounded-md text-muted-foreground hover:text-foreground',
                  'hover:bg-muted transition-smooth',
                  focusVisible
                )}
                aria-label={t('accessibility.closeDialog')}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="px-6 pt-4">
            <p id={descriptionId} className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        )}

        {/* Content */}
        <div className={cn('p-6', contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Modal Header Component
const ModalHeader = ({ children, className = '' }) => (
  <div className={cn('mb-4', className)}>
    {children}
  </div>
);

// Modal Footer Component
const ModalFooter = ({ children, className = '' }) => (
  <div className={cn('flex justify-end space-x-2 mt-6 pt-4 border-t border-border', className)}>
    {children}
  </div>
);

// Modal Title Component
const ModalTitle = ({ children, className = '' }) => (
  <h3 className={cn('text-lg font-semibold text-foreground', className)}>
    {children}
  </h3>
);

// Modal Description Component
const ModalDescription = ({ children, className = '' }) => (
  <p className={cn('text-sm text-muted-foreground', className)}>
    {children}
  </p>
);

// Export all components
Modal.Header = ModalHeader;
Modal.Footer = ModalFooter;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;

export default Modal;
