'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { ZenithLogo } from '@/components/shared/ZenithLogo';
import { playSuccessPing, playLuxuryChime, playHapticTick } from '@/lib/soundscapes';
import { ReviewGoogleReputationCard } from '@/components/patient/ReviewGoogleReputationCard';
import { ReviewConfidentialResolutionForm } from '@/components/patient/ReviewConfidentialResolutionForm';
import { ReviewStarRatingSelector } from '@/components/patient/review/ReviewStarRatingSelector';
import {
  ReviewBooking,
  DEFAULT_BOOKINGS,
} from '@/components/patient/review/reviewConstants';

function ReviewPortalContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || 'ZD-829104';

  const [booking, setBooking] = useState<ReviewBooking>(() => {
    return DEFAULT_BOOKINGS[ref] || DEFAULT_BOOKINGS['ZD-829104'];
  });

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Painless & Gentle',
    'Instant Shade Lift',
    'Luxury Harley St Ambiance',
  ]);
  const [comment, setComment] = useState<string>(
    'Dr. Leyla and the Zenith team made my laser whitening procedure completely seamless and pain-free. The clinic on Harley Street feels like a five-star hotel. 6 shades brighter in one hour!'
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [wantsCallback, setWantsCallback] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('dentalbook_custom_bookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const match = parsed.find((b: any) => b.id.toUpperCase() === ref.toUpperCase());
          if (match) {
            setBooking(match);
          }
        }
      }
    } catch (_) {}
  }, [ref]);

  const handleSelectRating = (stars: number) => {
    playHapticTick();
    setRating(stars);
    if (stars >= 4) {
      playLuxuryChime();
    }
  };

  const toggleTag = (tag: string) => {
    playHapticTick();
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCopyReview = () => {
    playHapticTick();
    navigator.clipboard.writeText(comment);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenGoogleMaps = () => {
    playSuccessPing();
    handleCopyReview();
    window.open(
      'https://www.google.com/search?q=Zenith+Dental+14+Harley+Street+London+Reviews',
      '_blank'
    );
  };

  const handleSubmitPrivateFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessPing();
    setSubmitted(true);
  };

  const isPositive = rating >= 4;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <ZenithLogo className="w-7 h-7 text-brand-400 group-hover:scale-105 transition-transform" />
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">
                Zenith Dental &amp; Esthetics
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                Patient Experience &amp; Reputation
              </span>
            </div>
          </Link>

          <Link
            href={`/manage?ref=${booking.id}`}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Digital Surgery Pass</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-2xl w-full mx-auto px-4 py-8 sm:py-12 space-y-6">
        {/* Patient & Clinic Hero Card */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Post-Discharge Care Review</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            How was your treatment today?
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Hi <span className="text-white font-bold">{booking.patientName}</span>, your feedback helps
            {' '}<span className="text-brand-300 font-semibold">{booking.doctor}</span> maintain the gold
            standard of Harley Street dental excellence.
          </p>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono pt-1">
            <span>Ref: {booking.id}</span>
            <span>·</span>
            <span>{booking.service}</span>
          </div>
        </div>

        {/* INTERACTIVE 5-STAR RATING SELECTOR */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 shadow-2xl backdrop-blur-md space-y-6 text-center">
          <ReviewStarRatingSelector
            rating={rating}
            hoverRating={hoverRating}
            onHoverRating={setHoverRating}
            onSelectRating={handleSelectRating}
            selectedTags={selectedTags}
            onToggleTag={toggleTag}
          />

          {/* DYNAMIC BRANCH: 4-5 STARS (PUBLIC GOOGLE REPUTATION FUNNEL) */}
          {isPositive ? (
            <ReviewGoogleReputationCard
              comment={comment}
              setComment={setComment}
              copied={copied}
              onCopy={handleCopyReview}
              onOpenGoogle={handleOpenGoogleMaps}
            />
          ) : (
            <ReviewConfidentialResolutionForm
              submitted={submitted}
              onSubmit={handleSubmitPrivateFeedback}
              wantsCallback={wantsCallback}
              setWantsCallback={setWantsCallback}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Zenith Dental &amp; Esthetics · 14 Harley Street, London W1G 9PR · +44 20 7946 0991</p>
      </footer>
    </div>
  );
}

export default function ReviewPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs font-mono">
          Loading Patient Care Review Portal...
        </div>
      }
    >
      <ReviewPortalContent />
    </Suspense>
  );
}
