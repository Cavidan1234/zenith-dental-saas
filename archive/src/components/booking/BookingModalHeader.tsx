'use client';

import React from 'react';
import { X } from 'lucide-react';

interface BookingModalHeaderProps {
  step: 1 | 2 | 3 | 4 | 5;
  onClose: () => void;
  onSelectStep: (step: 1 | 2 | 3 | 4) => void;
  canClickStep: (step: number) => boolean;
}

const STEP_LABELS = [
  { num: 1, label: 'Treatment & Doctor' },
  { num: 2, label: 'Date & Time' },
  { num: 3, label: 'Patient Info' },
  { num: 4, label: 'Deposit Payment' },
];

export function BookingModalHeader({
  step,
  onClose,
  onSelectStep,
  canClickStep,
}: BookingModalHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 text-white px-6 py-5 sm:px-7 sm:py-5 relative shrink-0">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white pr-10">
        {step === 1 && 'Step 1: Choose Treatment & Specialist'}
        {step === 2 && 'Step 2: Select Date & Available Time Slot'}
        {step === 3 && 'Step 3: Patient Information'}
        {step === 4 && 'Step 4: Secure Deposit Payment'}
        {step === 5 && 'Appointment Confirmed!'}
      </h3>

      <p className="text-xs text-brand-100 mt-1">
        {step === 1 && 'Select a clinical procedure and certified specialist'}
        {step === 2 && 'Real-time schedule with 15-minute room sterilization buffers'}
        {step === 3 && 'Confidential patient records & direct consultation notes'}
        {step === 4 && 'Encrypted deposit reservation · Zero PHI stored'}
        {step === 5 && 'Your appointment is officially registered in our system'}
      </p>

      {/* Interactive Stepper Indicator - 4 Distinct Steps */}
      {step < 5 && (
        <div className="flex items-center gap-2 mt-4">
          {STEP_LABELS.map(({ num, label }) => {
            const isActive = num === step;
            const isPassed = num < step;
            const canClick = canClickStep(num);

            return (
              <button
                key={num}
                type="button"
                disabled={!canClick}
                onClick={() => {
                  if (canClick) {
                    onSelectStep(num as 1 | 2 | 3 | 4);
                  }
                }}
                title={`Go to Step ${num}: ${label}`}
                className={`h-2 rounded-full transition-all duration-300 relative ${
                  canClick ? 'cursor-pointer hover:opacity-90' : 'cursor-default opacity-40'
                } ${
                  isActive
                    ? 'w-10 bg-white shadow-xs'
                    : isPassed
                    ? 'w-7 bg-white/70'
                    : 'w-5 bg-white/30'
                }`}
              />
            );
          })}
          <span className="text-xs font-bold text-white/90 ml-auto tracking-wide">
            Step {step} of 4
          </span>
        </div>
      )}
    </div>
  );
}
