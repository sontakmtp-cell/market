import React from 'react';
import Button from '../../../components/ui/Button';


const LanguageToggle = ({ currentLanguage, onLanguageChange }) => {
  const languages = [
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', label: 'English', flag: '🇺🇸' }
  ];

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-card border border-border rounded-lg shadow-elevation-1 p-1">
        <div className="flex items-center space-x-1">
          {languages?.map((lang) => (
            <Button
              key={lang?.code}
              variant={currentLanguage === lang?.code ? "default" : "ghost"}
              size="sm"
              onClick={() => onLanguageChange(lang?.code)}
              className="flex items-center space-x-2 min-w-0"
            >
              <span className="text-base">{lang?.flag}</span>
              <span className="text-xs font-medium hidden sm:inline">
                {lang?.label}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageToggle;