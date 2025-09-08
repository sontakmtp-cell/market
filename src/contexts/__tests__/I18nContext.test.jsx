import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../../utils/test-utils';
import { I18nProvider, useTranslation } from '../I18nContext';

// Test component to verify translation hook
const TestComponent = () => {
  const { t, language, changeLanguage } = useTranslation();
  
  return (
    <div>
      <p data-testid="current-language">{language}</p>
      <p data-testid="translated-text">{t('common.loading')}</p>
      <button onClick={() => changeLanguage('en')}>Switch to English</button>
      <button onClick={() => changeLanguage('vi')}>Switch to Vietnamese</button>
    </div>
  );
};

describe('I18nContext', () => {
  it('provides default language as Vietnamese', () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('current-language')).toHaveTextContent('vi');
  });

  it('changes language when requested', async () => {
    const { user } = render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    await user.click(screen.getByText('Switch to English'));
    
    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toHaveTextContent('en');
    });
  });

  it('persists language choice in localStorage', async () => {
    const mockSetItem = vi.fn();
    Object.defineProperty(window, 'localStorage', {
      value: { setItem: mockSetItem },
      writable: true,
    });

    const { user } = render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    await user.click(screen.getByText('Switch to English'));

    expect(mockSetItem).toHaveBeenCalledWith('techmarketplace_language', 'en');
  });

  it('translates text correctly', async () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    // Should show Vietnamese translation by default
    expect(screen.getByTestId('translated-text')).toHaveTextContent('Đang tải...');
  });

  it('handles missing translation keys gracefully', () => {
    const TestMissingKey = () => {
      const { t } = useTranslation();
      return <p data-testid="missing-key">{t('nonexistent.key')}</p>;
    };

    render(
      <I18nProvider>
        <TestMissingKey />
      </I18nProvider>
    );

    expect(screen.getByTestId('missing-key')).toHaveTextContent('nonexistent.key');
  });
});
