'use client';

import { useState, useEffect } from 'react';
import {
  playHapticTick,
  playSuccessPing,
  isSoundEnabled,
  setSoundEnabled,
} from '@/lib/soundscapes';

export function useDashboardThemeSync(
  reloadBookings: () => void,
  setNotification: (msg: string | null) => void
) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [soundActive, setSoundActive] = useState<boolean>(true);
  const [isCommsOpen, setIsCommsOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [customTenants, setCustomTenants] = useState<Record<string, any>>({});
  const [_currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('dentalbook_custom_tenants') || '{}');
      setCustomTenants(stored);
    } catch (_) {}
  }, []);

  useEffect(() => {
    setSoundActive(isSoundEnabled());
  }, []);

  // Real-time ticking clock for surgery operations
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    playHapticTick();
    setIsDarkMode((prev) => !prev);
  };

  const handleToggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    setSoundEnabled(next);
    if (next) playSuccessPing();
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    playHapticTick();
    setTimeout(() => {
      reloadBookings();
      setIsSyncing(false);
      playSuccessPing();
      setNotification('Appointments, staff availability, and telemetry synchronized.');
      setTimeout(() => setNotification(null), 3500);
    }, 600);
  };

  return {
    isDarkMode,
    setIsDarkMode,
    toggleTheme,
    soundActive,
    handleToggleSound,
    isCommsOpen,
    setIsCommsOpen,
    isSyncing,
    handleManualSync,
    customTenants,
  };
}
