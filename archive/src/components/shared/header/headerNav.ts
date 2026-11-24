import React from 'react';
import {
  Stethoscope,
  Sparkles,
  Calculator,
  ShieldCheck,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { Language } from '@/lib/i18n';

export interface NavItem {
  id: string;
  label: string;
  shortLabel?: string;
  icon: React.ElementType;
}

export function getNavItems(lang: Language = 'en'): NavItem[] {
  return [
    {
      id: 'doctors',
      label: lang === 'az' ? 'Mütəxəssislər' : lang === 'ru' ? 'Специалисты' : 'Specialists',
      shortLabel: lang === 'az' ? 'Həkimlər' : lang === 'ru' ? 'Врачи' : 'Doctors',
      icon: Stethoscope,
    },
    {
      id: 'pricing',
      label: lang === 'az' ? 'Xidmətlər & Qiymətlər' : lang === 'ru' ? 'Цены и Услуги' : 'Pricing & Treatments',
      shortLabel: lang === 'az' ? 'Qiymətlər' : lang === 'ru' ? 'Цены' : 'Pricing',
      icon: Sparkles,
    },
    {
      id: 'calculator',
      label: lang === 'az' ? 'Smeta & Kredit' : lang === 'ru' ? 'Калькулятор' : 'Financing Calculator',
      shortLabel: lang === 'az' ? 'Kalkulyator' : lang === 'ru' ? 'Расчет' : 'Calculator',
      icon: Calculator,
    },
    {
      id: 'about',
      label: lang === 'az' ? 'Haqqımızda & Zəmanət' : lang === 'ru' ? 'О нас и Гарантия' : 'About & Guarantee',
      shortLabel: lang === 'az' ? 'Haqqımızda' : lang === 'ru' ? 'О нас' : 'About',
      icon: ShieldCheck,
    },
    {
      id: 'contact',
      label: lang === 'az' ? 'Əlaqə' : lang === 'ru' ? 'Контакты' : 'Contact',
      shortLabel: lang === 'az' ? 'Əlaqə' : lang === 'ru' ? 'Контакты' : 'Contact',
      icon: MapPin,
    },
    {
      id: 'faq',
      label: 'FAQ',
      shortLabel: 'FAQ',
      icon: HelpCircle,
    },
  ];
}
