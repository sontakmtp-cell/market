import React, { createContext, useContext, useState, useEffect } from 'react';

// Translation context
const I18nContext = createContext();

// Available languages
const LANGUAGES = {
  vi: {
    code: 'vi',
    name: 'Tiếng Việt',
    flag: '🇻🇳',
    direction: 'ltr'
  },
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    direction: 'ltr'
  }
};

// Default language
const DEFAULT_LANGUAGE = 'vi';

// Storage key
const LANGUAGE_STORAGE_KEY = 'techmarketplace_language';

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get from localStorage or browser language or default
    try {
      const saved = localStorage?.getItem?.(LANGUAGE_STORAGE_KEY);
      if (saved && LANGUAGES[saved]) {
        return saved;
      }
    } catch (error) {
      // localStorage not available
    }
    
    const browserLang = navigator?.language?.split('-')?.[0];
    return LANGUAGES[browserLang] ? browserLang : DEFAULT_LANGUAGE;
  });

  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const response = await import(`../locales/${language}.json`);
        setTranslations(response.default || response);
      } catch (error) {
        console.warn(`Failed to load translations for ${language}:`, error);
        // Fallback to default language
        if (language !== DEFAULT_LANGUAGE) {
          try {
            const fallback = await import(`../locales/${DEFAULT_LANGUAGE}.json`);
            setTranslations(fallback.default || fallback);
          } catch (fallbackError) {
            console.error('Failed to load fallback translations:', fallbackError);
            setTranslations({});
          }
        }
      }
      setIsLoading(false);
    };

    loadTranslations();
  }, [language]);

  // Change language
  const changeLanguage = (newLanguage) => {
    if (LANGUAGES[newLanguage]) {
      setLanguage(newLanguage);
      try {
        localStorage?.setItem?.(LANGUAGE_STORAGE_KEY, newLanguage);
      } catch (error) {
        // localStorage not available
      }
      
      // Update document language and direction
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLanguage;
        document.documentElement.dir = LANGUAGES[newLanguage].direction;
      }
    }
  };

  // Get translation by key with interpolation support
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Return key as fallback
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }
    
    // Simple interpolation
    return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  };

  // Get current language info
  const currentLanguage = LANGUAGES[language];

  const value = {
    language,
    currentLanguage,
    languages: LANGUAGES,
    translations,
    isLoading,
    changeLanguage,
    t
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook to use translation
export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};

// Hook for language switching
export const useLanguage = () => {
  const { language, currentLanguage, languages, changeLanguage } = useTranslation();
  return { language, currentLanguage, languages, changeLanguage };
};

export default I18nContext;
