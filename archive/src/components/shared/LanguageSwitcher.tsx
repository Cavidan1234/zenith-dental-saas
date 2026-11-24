'use client';

import React from 'react';
import { Language } from '@/lib/i18n';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export function LanguageSwitcher({ currentLang, onLanguageChange }: LanguageSwitcherProps) {
  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'az', label: 'Azərbaycan', flag: '🇦🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  ];

  return (
    <div className="inline-flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-medium">
      <Globe className="w-3.5 h-3.5 ml-1.5 text-slate-500" />
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLanguageChange(lang.code)}
          className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
            currentLang === lang.code
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title={lang.label}
        >
          {lang.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
