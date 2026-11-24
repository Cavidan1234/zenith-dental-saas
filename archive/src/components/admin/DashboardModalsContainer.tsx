'use client';

import React from 'react';
import { TelephonyCommsDrawer } from '@/components/admin/TelephonyCommsDrawer';
import { PatientDossierDrawer, BookingRecord } from '@/components/admin/PatientDossierDrawer';
import { WalkInRegistrationModal } from '@/components/admin/WalkInRegistrationModal';
import { RecallPreviewModal } from '@/components/admin/RecallPreviewModal';
import { ClinicalRxModal } from '@/components/admin/ClinicalRxModal';
import { PracticeSettingsModal, PracticeSettings } from '@/components/admin/PracticeSettingsModal';
import { WhatsAppReminderModal } from '@/components/admin/WhatsAppReminderModal';
import type { RecallRecord } from '@/components/admin/DashboardRecallTab';

interface DashboardModalsContainerProps {
  // Comms Drawer
  isCommsOpen: boolean;
  onCloseComms: () => void;
  onDispatchCommsPing: () => void;

  // Patient Dossier
  selectedBooking: BookingRecord | null;
  onCloseBookingDrawer: () => void;
  onUpdateStatus: (
    id: string,
    newStatus: 'confirmed' | 'arrived' | 'in_surgery' | 'completed' | 'cancelled' | 'pending'
  ) => void;
  onSaveInternalNote: (id: string, noteText: string) => void;
  onOpenRxModal: (b: BookingRecord) => void;
  odontogram: Record<number, 'sound' | 'restored' | 'surgical' | 'watch'>;
  onToggleTooth: (toothNumber: number) => void;
  onSetToothState: (
    toothNumber: number,
    state: 'sound' | 'restored' | 'surgical' | 'watch'
  ) => void;
  selectedTooth: number | null;

  // Walk-In Modal
  walkInModal: { time: string; doctor: string } | null;
  onCloseWalkIn: () => void;
  walkInForm: {
    name: string;
    phone: string;
    email: string;
    service: string;
    notes: string;
  };
  onChangeWalkInForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      phone: string;
      email: string;
      service: string;
      notes: string;
    }>
  >;
  onSubmitWalkIn: (e: React.FormEvent) => void;

  // Recall Preview
  previewRecall: RecallRecord | null;
  onClosePreviewRecall: () => void;
  onDispatchRecall: (patientName: string, id: string) => void;
  dispatchedRecalls: Record<string, boolean>;

  // Clinical Rx
  rxModal: BookingRecord | null;
  onCloseRxModal: () => void;
  onRxDispatched: (email: string) => void;

  // Practice Settings
  isSettingsOpen: boolean;
  onCloseSettings: () => void;
  settings: PracticeSettings;
  onSaveSettings: (newSettings: PracticeSettings) => void;

  // WhatsApp Simulator
  whatsAppModalBooking: BookingRecord | null;
  onCloseWhatsAppModal: () => void;
}

export function DashboardModalsContainer({
  isCommsOpen,
  onCloseComms,
  onDispatchCommsPing,
  selectedBooking,
  onCloseBookingDrawer,
  onUpdateStatus,
  onSaveInternalNote,
  onOpenRxModal,
  odontogram,
  onToggleTooth,
  onSetToothState,
  selectedTooth,
  walkInModal,
  onCloseWalkIn,
  walkInForm,
  onChangeWalkInForm,
  onSubmitWalkIn,
  previewRecall,
  onClosePreviewRecall,
  onDispatchRecall,
  dispatchedRecalls,
  rxModal,
  onCloseRxModal,
  onRxDispatched,
  isSettingsOpen,
  onCloseSettings,
  settings,
  onSaveSettings,
  whatsAppModalBooking,
  onCloseWhatsAppModal,
}: DashboardModalsContainerProps) {
  return (
    <>
      {/* TELEPHONY & OUTBOUND COMMS RADAR DRAWER */}
      <TelephonyCommsDrawer
        isOpen={isCommsOpen}
        onClose={onCloseComms}
        onDispatchPing={onDispatchCommsPing}
      />

      {/* PATIENT CLINICAL DOSSIER & TREATMENT PLAN DRAWER */}
      {selectedBooking && (
        <PatientDossierDrawer
          booking={selectedBooking}
          onClose={onCloseBookingDrawer}
          onUpdateStatus={onUpdateStatus}
          onSaveInternalNote={onSaveInternalNote}
          onOpenRxModal={onOpenRxModal}
          odontogram={odontogram}
          onToggleTooth={onToggleTooth}
          onSetToothState={onSetToothState}
          selectedTooth={selectedTooth}
        />
      )}

      {/* QUICK WALK-IN REGISTRATION MODAL */}
      <WalkInRegistrationModal
        isOpen={!!walkInModal}
        onClose={onCloseWalkIn}
        walkInModal={walkInModal}
        form={walkInForm}
        onChangeForm={onChangeWalkInForm}
        onSubmit={onSubmitWalkIn}
      />

      {/* AUTOMATED RECALL PREVIEW MODAL */}
      <RecallPreviewModal
        previewRecall={previewRecall}
        onClose={onClosePreviewRecall}
        onDispatch={onDispatchRecall}
        isDispatched={!!(previewRecall && dispatchedRecalls[previewRecall.id])}
      />

      {/* CLINICAL DISCHARGE & RX PRESCRIPTION MODAL */}
      {rxModal && (
        <ClinicalRxModal
          booking={rxModal}
          onClose={onCloseRxModal}
          onDispatched={onRxDispatched}
        />
      )}

      {/* PRACTICE CONFIGURATION & PROTOCOLS MODAL */}
      {isSettingsOpen && (
        <PracticeSettingsModal
          isOpen={isSettingsOpen}
          onClose={onCloseSettings}
          settings={settings}
          onSave={onSaveSettings}
        />
      )}

      {/* OUTBOUND WHATSAPP REMINDER SIMULATOR */}
      {whatsAppModalBooking && (
        <WhatsAppReminderModal
          isOpen={!!whatsAppModalBooking}
          onClose={onCloseWhatsAppModal}
          patient={{
            id: whatsAppModalBooking.id,
            patientName: whatsAppModalBooking.patientName,
            phone: whatsAppModalBooking.phone || '+44 7700 900077',
            service: whatsAppModalBooking.service,
            doctor: whatsAppModalBooking.doctor,
            date: whatsAppModalBooking.date,
            time: whatsAppModalBooking.time,
            depositAmount: whatsAppModalBooking.depositAmount || 50,
          }}
          clinicName={settings.clinicName}
        />
      )}
    </>
  );
}
