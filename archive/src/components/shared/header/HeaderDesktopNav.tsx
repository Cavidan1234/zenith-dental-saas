'use client';

import React from 'react';
import { NavItem } from './headerNav';

interface HeaderDesktopNavProps {
  navItems: NavItem[];
  activeSection: string | null;
  onScrollToSection: (e: React.MouseEvent, sectionId: string) => void;
}

export function HeaderDesktopNav({
  navItems,
  activeSection,
  onScrollToSection,
}: HeaderDesktopNavProps) {
  return (
    <nav className="hidden lg:flex items-center gap-1.5 p-1">
      {navItems.map((item) => {
        const isActive = activeSection === item.id;
        const Icon = item.icon;

        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => onScrollToSection(e, item.id)}
            className={`group relative flex items-center gap-1.5 px-3 py-2 text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
              isActive
                ? 'text-brand-600 font-black'
                : 'text-slate-600 hover:text-brand-600'
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 transition-all duration-200 transform-gpu ${
                isActive
                  ? 'scale-115 text-brand-600'
                  : 'text-slate-400 group-hover:text-brand-600 group-hover:scale-125'
              }`}
            />
            <span className="transition-colors duration-200">{item.label}</span>

            <span
              className={`absolute bottom-0.5 left-2.5 right-2.5 h-[2px] rounded-full bg-brand-600 transition-all duration-250 ease-out origin-center transform-gpu ${
                isActive
                  ? 'scale-x-100 opacity-100'
                  : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
