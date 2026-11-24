'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ZenithLogo } from '@/components/shared/ZenithLogo';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { playLuxuryChime } from '@/lib/soundscapes';
import {
  KNOWN_RECALLS,
  DEFAULT_PATIENT,
  VIP_SLOTS,
  VipSlot,
} from '@/data/seedBookings';
import { RecallConfirmedReceipt } from '@/components/patient/RecallConfirmedReceipt';
import { RecallPrescriptionCard } from '@/components/patient/recall/RecallPrescriptionCard';
import { RecallSlotSelector } from '@/components/patient/recall/RecallSlotSelector';

function RecallContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || 'zd_rec-1';
  const patientData = KNOWN_RECALLS[token] || DEFAULT_PATIENT;

  const [selectedSlot, setSelectedSlot] = useState<string>('slot-1');
  const [patientNotes, setPatientNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    id: string;
    slot: VipSlot;
  } | null>(null);

  const activeSlot = VIP_SLOTS.find((s) => s.id === selectedSlot) || VIP_SLOTS[0];

  const handleClaimSlot = () => {
    setIsSubmitting(true);
    const bookingId = `ZD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking = {
      id: bookingId,
      patientName: patientData.patientName,
      email: patientData.email,
      phone: patientData.phone,
      service: `${patientData.recommendedService} (6-Mo Recall)`,
      doctor: patientData.doctor,
      date: activeSlot.date,
      time: activeSlot.time,
      duration: patientData.recommendedDuration,
      status: 'confirmed',
      depositStatus: 'paid',
      depositAmount: 50,
      paymentMethod: 'recall_vip_pass',
      paymentLabel: '6-Mo Recall Loyalty Pass ($50 Waived)',
      notes: patientNotes
        ? `[6-Month Recall Automated Booking] Patient note: ${patientNotes}`
        : `[6-Month Recall Automated Booking] Returning patient for ${patientData.treatment}.`,
      internalNotes: `Recall Token: ${token}. Previous treatment: ${patientData.treatment} on ${patientData.lastVisitDate}. VIP Priority applied.`,
      isRecent: true,
    };

    // Save to localStorage so admin surgery radar immediately updates
    try {
      const stored = JSON.parse(localStorage.getItem('dentalbook_custom_bookings') || '[]');
      stored.unshift(newBooking);
      localStorage.setItem('dentalbook_custom_bookings', JSON.stringify(stored));
    } catch (_) {}

    setTimeout(() => {
      setIsSubmitting(false);
      playLuxuryChime();
      setConfirmedBooking({
        id: bookingId,
        slot: activeSlot,
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/b/zenith-dental" className="flex items-center gap-2 group">
            <ZenithLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight block">ZENITH DENTAL</span>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Harley Street Studio</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Priority Recall Radar</span>
            </span>

            <Link
              href="/dashboard"
              className="text-xs text-slate-400 hover:text-white transition-colors underline font-medium hidden sm:inline"
            >
              Surgery Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col justify-center">
        {!confirmedBooking ? (
          <div className="space-y-8 animate-fade-in">
            {/* Header / Intro */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Patient Recall · Loyalty Pass Active</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome back, {patientData.patientName}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                It has been 6 months since your last visit on <strong className="text-white">{patientData.lastVisitDate}</strong>.
                Your personal dental surgeon <strong className="text-brand-400">{patientData.doctor}</strong> has
                reserved priority surgery slots for your routine oral health and hygiene maintenance.
              </p>
            </div>

            {/* Doctor & Recall Prescription Card */}
            <RecallPrescriptionCard patientData={patientData} />

            {/* Step 2: Choose from 3 VIP Reserved Slots */}
            <RecallSlotSelector
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
              recommendedDuration={patientData.recommendedDuration}
            />

            {/* Special Requests Note */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Any specific tooth sensitivity, cosmetic requests or updates since your last visit? (Optional)
              </label>
              <textarea
                rows={2}
                value={patientNotes}
                onChange={(e) => setPatientNotes(e.target.value)}
                placeholder="e.g., Minor sensitivity on upper right molar; would like quick veneer polish..."
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-xs text-white placeholder-slate-500 transition-all resize-none"
              />
            </div>

            {/* 1-Click Confirmation CTA */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleClaimSlot}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-blue-600 to-brand-500 hover:from-brand-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-brand-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Reserving Surgery Chair...</span>
                ) : (
                  <>
                    <span>Confirm 6-Month Recall ({activeSlot.dayLabel} @ {activeSlot.time})</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2.5">
                Immediate confirmation. Free reschedule available up to 24 hours prior.
              </p>
            </div>
          </div>
        ) : (
          <RecallConfirmedReceipt
            patientData={patientData}
            confirmedBooking={confirmedBooking}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Zenith Dental &amp; Esthetics. All rights reserved. 14 Harley Street, Marylebone, London.</p>
      </footer>
    </div>
  );
}

export default function RecallPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs font-mono">
          Loading Priority Recall Portal...
        </div>
      }
    >
      <RecallContent />
    </Suspense>
  );
}
