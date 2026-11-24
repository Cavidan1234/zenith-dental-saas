'use client';

import { useState } from 'react';
import type { BookingRecord } from '@/components/admin/PatientDossierDrawer';

export function useDashboardModals(
  setBookings: React.Dispatch<React.SetStateAction<BookingRecord[]>>,
  setNotification: (msg: string | null) => void
) {
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [whatsAppModalBooking, setWhatsAppModalBooking] = useState<BookingRecord | null>(null);
  const [rxModal, setRxModal] = useState<BookingRecord | null>(null);
  const [walkInModal, setWalkInModal] = useState<{ time: string; doctor: string } | null>(null);
  const [walkInForm, setWalkInForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Laser Teeth Whitening (In-Office)',
    notes: '',
  });

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInForm.name.trim() || !walkInModal) return;

    const newRef = `ZD-WALK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: BookingRecord = {
      id: newRef,
      patientName: walkInForm.name.trim(),
      email: walkInForm.email.trim() || 'walkin@zenithdental.com',
      phone: walkInForm.phone.trim() || '+44 7700 900000',
      service: walkInForm.service,
      doctor: walkInModal.doctor,
      date: new Date().toISOString().split('T')[0],
      time: walkInModal.time,
      duration: 45,
      status: 'confirmed',
      depositStatus: 'paid',
      depositAmount: 50,
      paymentMethod: 'in_clinic',
      paymentLabel: 'In-Clinic Cash/Card',
      notes: walkInForm.notes.trim() || 'Walk-in emergency / priority consultation',
      isRecent: true,
    };

    setBookings((prev) => [newBooking, ...prev]);

    try {
      const stored = JSON.parse(localStorage.getItem('dentalbook_custom_bookings') || '[]');
      stored.unshift(newBooking);
      localStorage.setItem('dentalbook_custom_bookings', JSON.stringify(stored));
    } catch (_) {}

    setWalkInModal(null);
    setWalkInForm({
      name: '',
      phone: '',
      email: '',
      service: 'Laser Teeth Whitening (In-Office)',
      notes: '',
    });
    setNotification(`Walk-in appointment registered for ${newBooking.patientName} at ${newBooking.time}!`);
    setTimeout(() => setNotification(null), 4000);
  };

  return {
    selectedBooking,
    setSelectedBooking,
    whatsAppModalBooking,
    setWhatsAppModalBooking,
    rxModal,
    setRxModal,
    walkInModal,
    setWalkInModal,
    walkInForm,
    setWalkInForm,
    handleCreateWalkIn,
  };
}
