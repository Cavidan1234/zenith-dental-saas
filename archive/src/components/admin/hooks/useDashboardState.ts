'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  playHapticTick,
  playSuccessPing,
  isSoundEnabled,
  setSoundEnabled,
} from '@/lib/soundscapes';
import { exportBookingsToCSV } from '@/lib/csvExport';
import { DEFAULT_SEED_BOOKINGS } from '@/data/seedBookings';
import type { BookingRecord } from '@/components/admin/PatientDossierDrawer';
import type { DashboardTabType } from '@/components/admin/DashboardTabsNav';
import { useDashboardOdontogram } from './useDashboardOdontogram';
import { useDashboardRecalls } from './useDashboardRecalls';
import { useDashboardModals } from './useDashboardModals';

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

export function useDashboardState() {
  const [activeTab, setActiveTab] = useState<DashboardTabType>('calendar');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [_currentTime, setCurrentTime] = useState<string>('');

  // Practice Settings & Configuration State
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<PracticeSettings>({
    clinicName: 'Zenith Dental & Esthetics',
    address: '14 Harley Street, Marylebone, London W1G 9PR',
    phone: '+44 20 7946 0991',
    email: 'concierge@zenithdental.co.uk',
    bufferMinutes: 15,
    depositAmount: 50,
    cancellationWindowHours: 24,
    recallIntervalDays: 180,
  });

  // Theme & Comms state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [soundActive, setSoundActive] = useState<boolean>(true);
  const [isCommsOpen, setIsCommsOpen] = useState<boolean>(false);

  // Multi-Tenant Switcher State
  const [customTenants, setCustomTenants] = useState<Record<string, any>>({});

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('dentalbook_custom_tenants') || '{}');
      setCustomTenants(stored);
    } catch (_) {}
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

  // Bookings state & localStorage reload
  const [bookings, setBookings] = useState<BookingRecord[]>(DEFAULT_SEED_BOOKINGS);

  const reloadBookings = () => {
    try {
      const stored = localStorage.getItem('dentalbook_custom_bookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBookings((prev) => {
            const combined = [...parsed];
            prev.forEach((item) => {
              if (!combined.some((b) => b.id === item.id)) {
                combined.push(item);
              }
            });
            return combined;
          });
        }
      }
    } catch (_) {}
  };

  useEffect(() => {
    reloadBookings();
    setSoundActive(isSoundEnabled());

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dentalbook_custom_bookings') {
        reloadBookings();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Theme & Sound Toggle
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

  // Modular Hook: Modals, Drawers & Walk-in
  const modals = useDashboardModals(setBookings, setNotification);

  // Modular Hook: 6-Month Recalls
  const recallState = useDashboardRecalls(selectedDoctorFilter, setNotification);

  // Modular Hook: 32-Tooth Odontogram
  const odontogramState = useDashboardOdontogram();

  // Filter bookings by doctor & search query
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchDoc =
        selectedDoctorFilter === 'all'
          ? true
          : selectedDoctorFilter === 'doc-leyla'
          ? b.doctor.includes('Leyla')
          : b.doctor.includes('Rashad');

      if (!matchDoc) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        b.patientName.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.service.toLowerCase().includes(q)
      );
    });
  }, [bookings, selectedDoctorFilter, searchQuery]);

  const handleExportCSV = () => {
    exportBookingsToCSV(filteredBookings);
    playSuccessPing();
    setNotification('Official bookings audit ledger exported to CSV successfully.');
    setTimeout(() => setNotification(null), 3500);
  };

  const handleUpdateStatus = (
    id: string,
    newStatus: 'confirmed' | 'arrived' | 'in_surgery' | 'completed' | 'cancelled' | 'pending'
  ) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    if (modals.selectedBooking && modals.selectedBooking.id === id) {
      modals.setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      const stored = localStorage.getItem('dentalbook_custom_bookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = parsed.map((b: any) =>
          b.id === id ? { ...b, status: newStatus } : b
        );
        localStorage.setItem('dentalbook_custom_bookings', JSON.stringify(updated));
      }
    } catch (_) {}

    const statusLabels: Record<string, string> = {
      confirmed: 'Təsdiqləndi (Confirmed)',
      arrived: 'Gözləmə Zalında (In Waiting Lounge)',
      in_surgery: 'Cərrahiyyə Otağında (In Surgery)',
      completed: 'Tamamlandı (Completed)',
      cancelled: 'Ləğv edildi (Cancelled)',
      pending: 'Gözləmədə (Pending)',
    };
    setNotification(`Appointment ${id} status changed to "${statusLabels[newStatus] || newStatus}".`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSaveInternalNote = (id: string, noteText: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, internalNotes: noteText.trim() } : b))
    );
    if (modals.selectedBooking && modals.selectedBooking.id === id) {
      modals.setSelectedBooking((prev) =>
        prev ? { ...prev, internalNotes: noteText.trim() } : null
      );
    }
    setNotification('Internal clinical note saved successfully.');
    setTimeout(() => setNotification(null), 3000);
  };

  // Dynamic calculated metrics
  const totalDepositSum = useMemo(() => {
    const customSum = bookings.reduce((sum, b) => sum + (Number(b.depositAmount) || 0), 0);
    return 6700 + customSum;
  }, [bookings]);

  const totalAppointmentsCount = useMemo(() => {
    return 140 + bookings.length;
  }, [bookings]);

  return {
    // Nav & Filter state
    activeTab,
    setActiveTab,
    selectedDoctorFilter,
    setSelectedDoctorFilter,
    searchQuery,
    setSearchQuery,
    notification,
    setNotification,
    isSyncing,
    handleManualSync,

    // Settings & Theme
    isSettingsOpen,
    setIsSettingsOpen,
    settings,
    setSettings,
    isDarkMode,
    toggleTheme,
    soundActive,
    handleToggleSound,
    isCommsOpen,
    setIsCommsOpen,
    customTenants,

    // Bookings & Metrics
    bookings,
    filteredBookings,
    totalDepositSum,
    totalAppointmentsCount,
    handleUpdateStatus,
    handleSaveInternalNote,
    handleExportCSV,

    // Modals & Drawers
    ...modals,

    // Recalls
    ...recallState,

    // Odontogram
    ...odontogramState,
  };
}
