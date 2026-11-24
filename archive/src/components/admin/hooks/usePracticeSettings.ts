'use client';

import { useState } from 'react';

export interface PracticeSettings {
  clinicName: string;
  address: string;
  phone: string;
  email: string;
  bufferMinutes: number;
  depositAmount: number;
  cancellationWindowHours: number;
  recallIntervalDays: number;
}

export const DEFAULT_PRACTICE_SETTINGS: PracticeSettings = {
  clinicName: 'Zenith Dental & Esthetics',
  address: '14 Harley Street, Marylebone, London W1G 9PR',
  phone: '+44 20 7946 0991',
  email: 'concierge@zenithdental.co.uk',
  bufferMinutes: 15,
  depositAmount: 50,
  cancellationWindowHours: 24,
  recallIntervalDays: 180,
};

export function usePracticeSettings() {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<PracticeSettings>(DEFAULT_PRACTICE_SETTINGS);

  return {
    isSettingsOpen,
    setIsSettingsOpen,
    settings,
    setSettings,
  };
}
