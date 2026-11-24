'use client';

import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { THEME_OPTIONS } from '@/components/onboarding/types';
import { Step1PracticeIdentity } from '@/components/onboarding/Step1PracticeIdentity';
import { Step2SpecialistsChairs } from '@/components/onboarding/Step2SpecialistsChairs';
import { Step3ProtocolsDeposits } from '@/components/onboarding/Step3ProtocolsDeposits';
import { Step4BrandAesthetics } from '@/components/onboarding/Step4BrandAesthetics';
import { Step5ProvisionedSuccess } from '@/components/onboarding/Step5ProvisionedSuccess';
import { MobileStorefrontSimulator } from '@/components/onboarding/MobileStorefrontSimulator';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { useOnboardingForm } from '@/components/onboarding/useOnboardingForm';

export default function ClinicOnboardingPage() {
  const {
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
  } = useOnboardingForm();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      {/* Top Navbar */}
      <OnboardingHeader step={step} />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Multi-Step Interactive Form */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden">
            {/* Ambient Aurora glow */}
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Step 1: Practice Identity */}
            {step === 1 && (
              <Step1PracticeIdentity
                formData={formData}
                onChange={handleUpdateForm}
                onNameChange={handleNameChange}
                onSlugify={handleSlugify}
              />
            )}

            {/* Step 2: Specialists & Surgery Rooms */}
            {step === 2 && (
              <Step2SpecialistsChairs
                formData={formData}
                onChange={handleUpdateForm}
              />
            )}

            {/* Step 3: Clinical Protocols & Pricing */}
            {step === 3 && (
              <Step3ProtocolsDeposits
                formData={formData}
                onChange={handleUpdateForm}
              />
            )}

            {/* Step 4: Brand Studio Styling */}
            {step === 4 && (
              <Step4BrandAesthetics
                formData={formData}
                themes={THEME_OPTIONS}
                onSelectTheme={(themeId) => handleUpdateForm({ theme: themeId })}
              />
            )}

            {/* Step 5: Provisioned Success Celebration */}
            {step === 5 && (
              <Step5ProvisionedSuccess
                formData={formData}
                copiedLink={copiedLink}
                onCopyLink={handleCopyLink}
              />
            )}

            {/* Bottom Form Navigation Buttons */}
            {step < 5 && (
              <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between">
                <button
                  type="button"
                  disabled={step === 1}
                  onClick={handlePrevStep}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 rounded-full text-xs font-extrabold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-md shadow-cyan-400/20 active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{step === 4 ? 'Launch & Publish Clinic' : 'Continue to Next Step'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Real-time Live Mobile Storefront Simulator */}
          <MobileStorefrontSimulator
            formData={formData}
            currentTheme={currentTheme}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-800/80 px-6 sm:px-10 text-center text-xs text-slate-500 font-mono">
        DentalBook.os Multi-Tenant Engine • GDC &amp; HIPAA Safe-Harbor Architecture
      </footer>
    </div>
  );
}
