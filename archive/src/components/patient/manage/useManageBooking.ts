'use client';

import { useState, useEffect } from 'react';
import { playSuccessPing, playHapticTick } from '@/lib/soundscapes';
import { openGoogleCalendar, downloadIcsFile } from '@/lib/calendarExport';
import { MedicalIntakeData } from '@/components/patient/PatientMedicalIntakeModal';
import { InsurancePolicy } from '@/components/patient/InsuranceVerificationModal';
import {
  ManagedBooking,
  DEFAULT_MANAGED_BOOKINGS,
  RESCHEDULE_OPTIONS,
} from '@/data/seedBookings';

export function useManageBooking(initialRef: string) {
  const [searchRef, setSearchRef] = useState<string>(initialRef);
  const [activeBooking, setActiveBooking] = useState<ManagedBooking | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isRescheduling, setIsRescheduling] = useState<boolean>(false);
  const [selectedReschedule, setSelectedReschedule] = useState<number>(0);
  const [cancelModal, setCancelModal] = useState<boolean>(false);
  const [isIntakeOpen, setIsIntakeOpen] = useState<boolean>(false);
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [isInsuranceOpen, setIsInsuranceOpen] = useState<boolean>(false);

  const handleApplyInsurance = (policy: InsurancePolicy) => {
    if (!activeBooking) return;
    const updatedBooking: ManagedBooking = {
      ...activeBooking,
      insurancePolicy: policy,
    };
    setActiveBooking(updatedBooking);

    try {
      const stored = JSON.parse(localStorage.getItem('dentalbook_custom_bookings') || '[]');
      const filtered = stored.filter((b: any) => b.id !== activeBooking.id);
      filtered.unshift(updatedBooking);
      localStorage.setItem('dentalbook_custom_bookings', JSON.stringify(filtered));
    } catch (_) {}

    setNotification(
      `Private Insurance Pre-Authorisation verified (${policy.providerName}). Auth Ref: ${policy.preAuthCode}`
    );
    playSuccessPing();
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSaveIntake = (intakeData: MedicalIntakeData) => {
    if (!activeBooking) return;
    const updatedBooking: ManagedBooking = {
      ...activeBooking,
      medicalIntake: intakeData,
    };
    setActiveBooking(updatedBooking);

    try {
      const stored = JSON.parse(localStorage.getItem('dentalbook_custom_bookings') || '[]');
      const filtered = stored.filter((b: any) => b.id !== activeBooking.id);
      filtered.unshift(updatedBooking);
      localStorage.setItem('dentalbook_custom_bookings', JSON.stringify(filtered));
    } catch (_) {}

    setNotification('Pre-Op Medical Triage & Clinical Clearance verified successfully.');
    playSuccessPing();
    setTimeout(() => setNotification(null), 4000);
  };

  // Load booking from localStorage or demo defaults
  const findBooking = (refToFind: string) => {
    const cleanRef = refToFind.trim().toUpperCase();
    try {
      const stored = localStorage.getItem('dentalbook_custom_bookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const match = parsed.find(
            (b: ManagedBooking) =>
              b.id.toUpperCase() === cleanRef ||
              (b.phone && b.phone.replace(/[^0-9]/g, '').includes(cleanRef.replace(/[^0-9]/g, '')))
          );
          if (match) {
            setActiveBooking(match);
            return;
          }
        }
      }
    } catch (_) {}

    // Fallback to default records
    if (DEFAULT_MANAGED_BOOKINGS[cleanRef]) {
      setActiveBooking(DEFAULT_MANAGED_BOOKINGS[cleanRef]);
    } else {
      const fallback = Object.values(DEFAULT_MANAGED_BOOKINGS).find(
        (b) => b.id.toUpperCase() === cleanRef || b.phone.includes(cleanRef)
      );
      if (fallback) {
        setActiveBooking(fallback);
      } else {
        setActiveBooking(null);
        setNotification(`No appointment found matching "${refToFind}". Please verify your reference ID.`);
        setTimeout(() => setNotification(null), 4000);
      }
    }
  };

  useEffect(() => {
    if (initialRef) {
      findBooking(initialRef);
    }
  }, [initialRef]);

  // Handle Reschedule
  const handleConfirmReschedule = () => {
    if (!activeBooking) return;
    const option = RESCHEDULE_OPTIONS[selectedReschedule];

    const updatedBooking: ManagedBooking = {
      ...activeBooking,
      date: option.date,
      time: option.time,
      notes: activeBooking.notes
        ? `${activeBooking.notes} [Rescheduled by patient to ${option.day} @ ${option.time}]`
        : `[Rescheduled by patient to ${option.day} @ ${option.time}]`,
    };

    setActiveBooking(updatedBooking);

    try {
      const stored = JSON.parse(localStorage.getItem('dentalbook_custom_bookings') || '[]');
      const filtered = stored.filter((b: any) => b.id !== activeBooking.id);
      filtered.unshift(updatedBooking);
      localStorage.setItem('dentalbook_custom_bookings', JSON.stringify(filtered));
    } catch (_) {}

    setIsRescheduling(false);
    playSuccessPing();
    setNotification(`Appointment successfully rescheduled to ${option.day} at ${option.time}.`);
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle Cancellation
  const handleConfirmCancel = () => {
    if (!activeBooking) return;

    const cancelledBooking: ManagedBooking = {
      ...activeBooking,
      status: 'cancelled',
      notes: activeBooking.notes
        ? `${activeBooking.notes} [Cancelled via Patient Portal - Full deposit refund initiated]`
        : `[Cancelled via Patient Portal - Full deposit refund initiated]`,
    };

    setActiveBooking(cancelledBooking);

    try {
      const stored = JSON.parse(localStorage.getItem('dentalbook_custom_bookings') || '[]');
      const filtered = stored.filter((b: any) => b.id !== activeBooking.id);
      filtered.unshift(cancelledBooking);
      localStorage.setItem('dentalbook_custom_bookings', JSON.stringify(filtered));
    } catch (_) {}

    setCancelModal(false);
    setNotification('Appointment cancelled. Deposit refund credited back to your original payment card within 2-3 business days.');
    setTimeout(() => setNotification(null), 6000);
  };

  // Google Calendar Integration
  const handleOpenGoogleCalendar = () => {
    if (!activeBooking) return;
    openGoogleCalendar({
      refId: activeBooking.id,
      serviceName: activeBooking.service,
      doctorName: activeBooking.doctor,
      patientName: activeBooking.patientName,
      date: activeBooking.date,
      time: activeBooking.time,
      durationMinutes: activeBooking.duration,
      notes: activeBooking.notes,
    });
  };

  // Download iCal (.ics)
  const handleDownloadICS = () => {
    if (!activeBooking) return;
    playHapticTick();
    downloadIcsFile({
      refId: activeBooking.id,
      serviceName: activeBooking.service,
      doctorName: activeBooking.doctor,
      patientName: activeBooking.patientName,
      date: activeBooking.date,
      time: activeBooking.time,
      durationMinutes: activeBooking.duration,
      notes: activeBooking.notes,
    });
  };

  return {
    searchRef,
    setSearchRef,
    activeBooking,
    notification,
    setNotification,
    findBooking,
    isRescheduling,
    setIsRescheduling,
    selectedReschedule,
    setSelectedReschedule,
    handleConfirmReschedule,
    cancelModal,
    setCancelModal,
    handleConfirmCancel,
    isIntakeOpen,
    setIsIntakeOpen,
    handleSaveIntake,
    isWalletOpen,
    setIsWalletOpen,
    isInsuranceOpen,
    setIsInsuranceOpen,
    handleApplyInsurance,
    handleOpenGoogleCalendar,
    handleDownloadICS,
  };
}
