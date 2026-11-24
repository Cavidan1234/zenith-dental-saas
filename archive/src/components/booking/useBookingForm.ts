'use client';

import { useState, useEffect } from 'react';
import { ServiceItem, DoctorItem } from './steps/Step1ServiceDoctor';
import {
  CLINIC_SERVICES,
  CLINIC_DOCTORS,
  INITIAL_BASE_SLOTS,
} from '@/data/seedBookings';
import { useBookingPayment } from './useBookingPayment';

interface UseBookingFormOptions {
  isOpen: boolean;
  preselectedServiceId?: string | null;
  preselectedDoctorId?: string | null;
  tenantSlug?: string;
  customDoctors?: DoctorItem[];
  customServices?: ServiceItem[];
}

export function useBookingForm({
  isOpen,
  preselectedServiceId,
  preselectedDoctorId,
  tenantSlug = 'zenith-dental',
  customDoctors,
  customServices,
}: UseBookingFormOptions) {
  const doctorsList = customDoctors && customDoctors.length > 0 ? customDoctors : CLINIC_DOCTORS;
  const servicesList = customServices && customServices.length > 0 ? customServices : CLINIC_SERVICES;

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorItem | null>(null);

  // Default date: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [selectedDate, setSelectedDate] = useState<string>(
    tomorrow.toISOString().split('T')[0]
  );

  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>(INITIAL_BASE_SLOTS);
  const [selectedSlot, setSelectedSlot] = useState<string>('09:00');
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [gdprConsent, setGdprConsent] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Payment Hook
  const payment = useBookingPayment({
    selectedService,
    selectedDoctor,
    selectedDate,
    selectedSlot,
    fullName,
    email,
    phone,
    notes,
    tenantSlug,
    setStep,
    setErrorMessage,
  });

  // Handle preselection when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      if (preselectedDoctorId) {
        const doc = doctorsList.find((d) => d.id === preselectedDoctorId);
        setSelectedDoctor(doc || null);
      } else {
        setSelectedDoctor(null);
      }

      if (preselectedServiceId) {
        const srv = servicesList.find((s) => s.id === preselectedServiceId);
        setSelectedService(srv || null);
      } else {
        setSelectedService(null);
      }

      payment.setPaymentMethod('card');
      setErrorMessage('');
    }
  }, [isOpen, preselectedDoctorId, preselectedServiceId]);

  // Sync cardholder name when fullName changes
  useEffect(() => {
    if (fullName && !payment.cardHolder) {
      payment.setCardHolder(fullName);
    }
  }, [fullName, payment.cardHolder]);

  // Load slots when on Step 2
  useEffect(() => {
    if (step === 2 && isOpen && selectedDoctor && selectedService) {
      fetchSlots();
    }
  }, [step, selectedDate, selectedDoctor, selectedService, isOpen]);

  const fallbackSlots = () => {
    setAvailableSlots(INITIAL_BASE_SLOTS);
    setSelectedSlot((prev) => prev || '09:00');
  };

  const fetchSlots = async () => {
    if (!selectedDoctor || !selectedService) return;
    setLoadingSlots(true);
    setErrorMessage('');
    try {
      const res = await fetch(
        `/api/v1/availability?staffId=${selectedDoctor.id}&date=${selectedDate}&serviceId=${selectedService.id}&tenantSlug=${tenantSlug}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.slots && data.slots.length > 0) {
          setAvailableSlots(data.slots);
          const currentValid = data.slots.find((s: any) => s.time === selectedSlot && s.available);
          if (!currentValid) {
            const firstOpen = data.slots.find((s: any) => s.available);
            if (firstOpen) setSelectedSlot(firstOpen.time);
          }
        } else {
          fallbackSlots();
        }
      } else {
        fallbackSlots();
      }
    } catch {
      fallbackSlots();
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedService) {
      setErrorMessage('Please select both a specialist doctor and a treatment.');
      setStep(1);
      return;
    }
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please fill in your full name, email, and phone number.');
      return;
    }
    if (!gdprConsent) {
      setErrorMessage('Please accept the consent checkbox to continue.');
      return;
    }

    setErrorMessage('');
    setStep(4);
  };

  const canClickStep = (num: number) => {
    return (
      num === 1 ||
      (num === 2 && Boolean(selectedDoctor && selectedService)) ||
      (num === 3 && step >= 2 && Boolean(selectedSlot)) ||
      (num === 4 && Boolean(fullName && email && phone))
    );
  };

  return {
    doctorsList,
    servicesList,
    step,
    setStep,
    selectedService,
    setSelectedService,
    selectedDoctor,
    setSelectedDoctor,
    selectedDate,
    setSelectedDate,
    availableSlots,
    selectedSlot,
    setSelectedSlot,
    loadingSlots,
    fullName,
    setFullName,
    email,
    setEmail,
    phone,
    setPhone,
    notes,
    setNotes,
    gdprConsent,
    setGdprConsent,
    errorMessage,
    setErrorMessage,
    handleProceedToPayment,
    canClickStep,
    ...payment,
  };
}
