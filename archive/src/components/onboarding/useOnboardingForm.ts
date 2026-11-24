'use client';

import { useState } from 'react';
import { playLuxuryChime, playHapticTick, playSuccessPing } from '@/lib/soundscapes';
import { OnboardingClinicData, THEME_OPTIONS } from '@/components/onboarding/types';

export function useOnboardingForm() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const [formData, setFormData] = useState<OnboardingClinicData>({
    clinicName: 'Mayfair Esthetic Surgery & Dental',
    slug: 'mayfair-dental',
    address: '24 Berkeley Square',
    city: 'London, W1J 6HE',
    postalCode: 'W1J 6HE',
    phone: '+44 20 7946 0912',
    currency: 'GBP (£)',
    chairsCount: 3,
    bufferMinutes: 15,
    depositAmount: 50,
    cancellationCutoffHours: 24,
    primaryDoctorName: 'Dr. Alistair Sterling',
    primaryDoctorTitle: 'Lead Prosthodontist & Oral Surgeon (GDC #294012)',
    theme: 'azure',
  });

  const handleSlugify = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      clinicName: name,
      slug: handleSlugify(name),
    }));
  };

  const handleUpdateForm = (data: Partial<OnboardingClinicData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNextStep = () => {
    playHapticTick();
    setStep((s) => Math.min(5, s + 1) as any);
    if (step === 4) {
      playLuxuryChime();
      // Persist tenant configuration in localStorage and send to server API
      try {
        const existing = JSON.parse(localStorage.getItem('dentalbook_custom_tenants') || '{}');
        existing[formData.slug] = {
          ...formData,
          createdAt: new Date().toISOString(),
          isLive: true,
        };
        localStorage.setItem('dentalbook_custom_tenants', JSON.stringify(existing));

        // Attempt async sync to API backend
        fetch('/api/v1/tenants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.clinicName,
            slug: formData.slug,
            address: formData.address,
            phone: formData.phone,
            depositAmount: formData.depositAmount,
            chairsCount: formData.chairsCount,
            bufferMinutes: formData.bufferMinutes,
            theme: formData.theme,
            currency: formData.currency,
          }),
        }).catch(() => {});
      } catch (_) {}
    }
  };

  const handlePrevStep = () => {
    playHapticTick();
    setStep((s) => Math.max(1, s - 1) as any);
  };

  const handleCopyLink = () => {
    playSuccessPing();
    const url = `${window.location.origin}/b/${formData.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const currentTheme = THEME_OPTIONS.find((t) => t.id === formData.theme) || THEME_OPTIONS[0];

  return {
    step,
    formData,
    copiedLink,
    currentTheme,
    handleSlugify,
    handleNameChange,
    handleUpdateForm,
    handleNextStep,
    handlePrevStep,
    handleCopyLink,
  };
}
