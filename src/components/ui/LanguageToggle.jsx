import React from 'react';
import { useTranslation, useLanguage } from '../../contexts/I18nContext';
import Button from '../ui/Button';

const LanguageToggle = ({ className = '' }) => {
  const { currentLanguage, languages, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  const languageOptions = Object.values(languages);

  return (
    <div className={`relative ${className}`}>
      <div className="bg-card border border-border rounded-lg shadow-elevation-1 p-1">
        <div className="flex items-center space-x-1" role="group" aria-label={t('common.language')}>
          {languageOptions.map((lang) => (
            <Button
              key={lang.code}
              variant={currentLanguage.code === lang.code ? "default" : "ghost"}
              size="sm"
              onClick={() => changeLanguage(lang.code)}
              className="flex items-center space-x-2 min-w-0"
              aria-pressed={currentLanguage.code === lang.code}
              aria-label={`${t('common.switchTo')} ${lang.name}`}
              title={`${t('common.switchTo')} ${lang.name}`}
            >
              <span className="text-base" role="img" aria-label={lang.name}>
                {lang.flag}
              </span>
              <span className="text-xs font-medium hidden sm:inline">
                {lang.name}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageToggle;
