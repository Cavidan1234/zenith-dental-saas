'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar as CalendarIcon } from 'lucide-react';
import { playHapticTick } from '@/lib/soundscapes';
import { DigitalSurgeryPassCard } from '@/components/patient/DigitalSurgeryPassCard';
import { PatientClearanceAndInsuranceBar } from '@/components/patient/PatientClearanceAndInsuranceBar';
import { ManageHeaderAndSearch } from '@/components/patient/manage/ManageHeaderAndSearch';
import { ManageModalsContainer } from '@/components/patient/manage/ManageModalsContainer';
import { useManageBooking } from '@/components/patient/manage/useManageBooking';

function ManagePortalContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || 'ZD-829104';

  const {
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
  } = useManageBooking(initialRef);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white relative overflow-hidden">
      {/* Background ambient aurora */}
      <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[700px] h-[350px] bg-brand-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <main className="flex-1 relative z-10 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        {/* Top Navbar, Notification & Search Bar */}
        <ManageHeaderAndSearch
          notification={notification}
          onDismissNotification={() => setNotification(null)}
          searchRef={searchRef}
          onSearchRefChange={setSearchRef}
          onSearch={findBooking}
        />

        {/* Active Booking Card / Boarding Pass */}
        {activeBooking ? (
          <div className="space-y-6 animate-fade-in">
            {/* Surgery Digital Pass (Boarding Pass Card) */}
            <DigitalSurgeryPassCard
              booking={activeBooking}
              onOpenWallet={() => {
                playHapticTick();
                setIsWalletOpen(true);
              }}
            />

            {/* Clinical Clearance, Insurance & Surgery Actions */}
            <PatientClearanceAndInsuranceBar
              booking={activeBooking}
              onOpenIntake={() => setIsIntakeOpen(true)}
              onOpenInsurance={() => setIsInsuranceOpen(true)}
              onOpenGoogleCalendar={handleOpenGoogleCalendar}
              onDownloadIcs={handleDownloadICS}
              onOpenReschedule={() => setIsRescheduling(true)}
              onOpenCancel={() => setCancelModal(true)}
            />
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-3">
            <CalendarIcon className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No Booking Loaded</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Please enter your Booking Reference (e.g., ZD-829104) in the search field above to view your surgery pass and manage your appointment.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Zenith Dental &amp; Esthetics · 14 Harley Street, London W1G 9PR · +44 20 7946 0991</p>
      </footer>

      {activeBooking && (
        <ManageModalsContainer
          activeBooking={activeBooking}
          isRescheduling={isRescheduling}
          onCloseReschedule={() => setIsRescheduling(false)}
          selectedReschedule={selectedReschedule}
          onSelectRescheduleIndex={setSelectedReschedule}
          onConfirmReschedule={handleConfirmReschedule}
          cancelModal={cancelModal}
          onCloseCancel={() => setCancelModal(false)}
          onConfirmCancel={handleConfirmCancel}
          isIntakeOpen={isIntakeOpen}
          onCloseIntake={() => setIsIntakeOpen(false)}
          onSaveIntake={handleSaveIntake}
          isWalletOpen={isWalletOpen}
          onCloseWallet={() => setIsWalletOpen(false)}
          isInsuranceOpen={isInsuranceOpen}
          onCloseInsurance={() => setIsInsuranceOpen(false)}
          onApplyInsurance={handleApplyInsurance}
        />
      )}
    </div>
  );
}

export default function ManagePortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs font-mono">
          Loading Patient Concierge Portal...
        </div>
      }
    >
      <ManagePortalContent />
    </Suspense>
  );
}
