import { useEffect, useRef, useState, useCallback } from 'react';

// Hook for managing focus
export const useFocus = () => {
  const elementRef = useRef(null);

  const focus = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.focus();
    }
  }, []);

  const blur = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.blur();
    }
  }, []);

  return { elementRef, focus, blur };
};

// Hook for managing focus trap
export const useFocusTrap = (isActive = true) => {
  const containerRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstFocusableRef.current = firstElement;
    lastFocusableRef.current = lastElement;

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return { containerRef, firstFocusableRef, lastFocusableRef };
};

// Hook for managing escape key
export const useEscapeKey = (callback, isActive = true) => {
  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [callback, isActive]);
};

// Hook for managing outside click
export const useOutsideClick = (callback, isActive = true) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [callback, isActive]);

  return ref;
};

// Hook for announcements to screen readers
export const useAnnounce = () => {
  const [announcement, setAnnouncement] = useState('');

  const announce = useCallback((message, priority = 'polite') => {
    setAnnouncement(''); // Clear first to ensure it's announced
    setTimeout(() => {
      setAnnouncement(message);
    }, 100);
  }, []);

  const AnnouncementComponent = () => (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );

  return { announce, AnnouncementComponent };
};

// Hook for managing reduced motion preference
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Hook for managing keyboard navigation
export const useKeyboardNavigation = (items, onSelect) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => prev <= 0 ? items.length - 1 : prev - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeIndex >= 0 && onSelect) {
          onSelect(items[activeIndex], activeIndex);
        }
        break;
      case 'Escape':
        setActiveIndex(-1);
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(items.length - 1);
        break;
      default:
        break;
    }
  }, [items, activeIndex, onSelect]);

  return { activeIndex, setActiveIndex, handleKeyDown };
};

// Utility function to generate unique IDs
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Utility function to check if element is visible
export const isElementVisible = (element) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// ARIA helpers
export const ariaHelpers = {
  // Generates ARIA attributes for expandable sections
  expandable: (isExpanded, controls) => ({
    'aria-expanded': isExpanded,
    'aria-controls': controls,
  }),

  // Generates ARIA attributes for buttons
  button: (pressed, label, describedBy) => ({
    'aria-pressed': pressed !== undefined ? pressed : undefined,
    'aria-label': label,
    'aria-describedby': describedBy,
  }),

  // Generates ARIA attributes for form fields
  field: (required, invalid, describedBy, labelledBy) => ({
    'aria-required': required,
    'aria-invalid': invalid,
    'aria-describedby': describedBy,
    'aria-labelledby': labelledBy,
  }),

  // Generates ARIA attributes for lists
  list: (size, setSize, posInSet) => ({
    'aria-setsize': setSize || size,
    'aria-posinset': posInSet,
  }),

  // Generates ARIA attributes for dialogs
  dialog: (labelledBy, describedBy) => ({
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
  }),
};

// Screen reader only class utility
export const srOnly = 'sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';

// Focus visible utility
export const focusVisible = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

// Skip link component
export const SkipLink = ({ href = '#main-content', children = 'Skip to main content' }) => (
  <a
    href={href}
    className={`${srOnly} focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 transition-smooth`}
  >
    {children}
  </a>
);

export default {
  useFocus,
  useFocusTrap,
  useEscapeKey,
  useOutsideClick,
  useAnnounce,
  useReducedMotion,
  useKeyboardNavigation,
  generateId,
  isElementVisible,
  ariaHelpers,
  srOnly,
  focusVisible,
  SkipLink,
};
