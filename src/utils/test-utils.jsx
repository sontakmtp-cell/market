import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nProvider } from '../contexts/I18nContext';
import { HelmetProvider } from 'react-helmet-async';

// Custom render function that includes providers
function render(ui, options = {}) {
  const {
    route = '/',
    initialEntries = [route],
    language = 'vi',
    ...renderOptions
  } = options;

  // Create wrapper with all providers
  function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <I18nProvider>
          <HelmetProvider>
            {children}
          </HelmetProvider>
        </I18nProvider>
      </MemoryRouter>
    );
  }

  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    // Utility functions for testing
    user: userEvent,
  };
}

// Mock user with proper setup
import userEvent from '@testing-library/user-event';

// Accessibility testing utilities
export const checkA11y = async (container) => {
  const { axe } = await import('jest-axe');
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

// Custom queries
export const getByTextContent = (text) => (content, element) => {
  const hasText = (element) => element.textContent === text;
  const nodeHasText = hasText(element);
  const childrenDontHaveText = Array.from(element.children).every(
    (child) => !hasText(child)
  );
  return nodeHasText && childrenDontHaveText;
};

// Mock data generators
export const mockUser = (overrides = {}) => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'freelancer',
  ...overrides,
});

export const mockJob = (overrides = {}) => ({
  id: '1',
  title: 'Test Job',
  description: 'Test job description',
  budgetMin: 1000000,
  budgetMax: 2000000,
  deadline: '2024-12-31',
  skills: ['React', 'JavaScript'],
  client: {
    name: 'Test Client',
    avatar: null,
    rating: 4.5,
    reviewCount: 10,
  },
  ...overrides,
});

export const mockProfile = (overrides = {}) => ({
  id: '1',
  name: 'Test Profile',
  role: 'freelancer',
  bio: 'Test bio',
  skills: ['React', 'JavaScript'],
  hourlyRate: 500000,
  availability: 'available',
  ...overrides,
});

// Wait for loading states
export const waitForLoadingToFinish = () =>
  waitFor(
    () => {
      return expect(
        screen.queryByTestId('loading') || screen.queryByText(/loading/i)
      ).not.toBeInTheDocument();
    },
    { timeout: 3000 }
  );

// Form testing utilities
export const fillForm = async (fields, user) => {
  for (const [label, value] of Object.entries(fields)) {
    const field = screen.getByLabelText(new RegExp(label, 'i'));
    await user.clear(field);
    await user.type(field, value);
  }
};

export const submitForm = async (user, buttonText = /submit|save|continue/i) => {
  const submitButton = screen.getByRole('button', { name: buttonText });
  await user.click(submitButton);
};

// Navigation testing utilities
export const expectToBeOn = (path) => {
  expect(window.location.pathname).toBe(path);
};

// Translation testing utilities
export const mockTranslations = {
  vi: {
    common: {
      loading: 'Đang tải...',
      error: 'Có lỗi xảy ra',
      save: 'Lưu',
      cancel: 'Hủy',
    },
  },
  en: {
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      save: 'Save',
      cancel: 'Cancel',
    },
  },
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { waitFor } from '@testing-library/react';

// Override the default render
export { render };
