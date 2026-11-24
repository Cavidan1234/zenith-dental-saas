'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { DentalPacsViewer } from '@/components/clinical/DentalPacsViewer';
import { ClinicalSoapScribeModal } from '@/components/admin/ClinicalSoapScribeModal';
import { ClinicalTreatmentPlanModal } from '@/components/admin/ClinicalTreatmentPlanModal';
import { DossierOdontogramSection } from './dossier/DossierOdontogramSection';
import { DossierTreatmentBuilderSection } from './dossier/DossierTreatmentBuilderSection';
import { DossierMedicalTriageCard } from './dossier/DossierMedicalTriageCard';
import { DossierClinicalNotesCard } from './dossier/DossierClinicalNotesCard';
import { DossierProfileAndStatusCard } from './dossier/DossierProfileAndStatusCard';
import { DossierDepositPaymentCard } from './dossier/DossierDepositPaymentCard';
import { useDossierTreatmentPlan } from './dossier/useDossierTreatmentPlan';
import { DossierFooterActions } from './dossier/DossierFooterActions';

export interface MedicalIntake {
  anxietyLevel: 'none' | 'mild' | 'moderate' | 'high';
  sedationRequested: boolean;
  allergies: string[];
  medicalConditions: string[];
  currentMedications?: string;
  emergencyContact?: string;
  signatureName?: string;
  submittedAt?: string;
}

export interface BookingRecord {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  service: string;
  doctor: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'arrived' | 'in_surgery' | 'completed' | 'cancelled' | 'pending';
  depositStatus: 'paid' | 'unpaid';
  depositAmount: number;
  paymentMethod?: string;
  paymentLabel?: string;
  notes?: string;
  internalNotes?: string;
  isRecent?: boolean;
  medicalIntake?: MedicalIntake;
}

interface PatientDossierDrawerProps {
  booking: BookingRecord | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: BookingRecord['status']) => void;
  onSaveInternalNote: (id: string, note: string) => void;
  onOpenRxModal: (booking: BookingRecord) => void;
  odontogram: Record<number, 'sound' | 'restored' | 'surgical' | 'watch'>;
  onToggleTooth: (toothNumber: number) => void;
  onSetToothState: (toothNumber: number, state: 'sound' | 'restored' | 'surgical' | 'watch') => void;
  selectedTooth: number | null;
}

export function PatientDossierDrawer({
  booking,
  onClose,
  onUpdateStatus,
  onSaveInternalNote,
  onOpenRxModal,
  odontogram,
  onToggleTooth,
  onSetToothState,
  selectedTooth,
}: PatientDossierDrawerProps) {
  const [internalNoteDraft, setInternalNoteDraft] = useState(booking?.internalNotes || '');
  const [noteSaved, setNoteSaved] = useState(false);
  const [isSoapModalOpen, setIsSoapModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const {
    treatmentItems,
    insuranceDiscount,
    setInsuranceDiscount,
    planCopied,
    handleAddTreatmentItem,
    handleRemoveTreatmentItem,
    subtotal,
    discountAmount,
    finalTotal,
    monthlyEstimate,
    handleCopyPlan,
  } = useDossierTreatmentPlan(booking);

  if (!booking) return null;

  const handleApplySoapNote = (noteText: string) => {
    setInternalNoteDraft(noteText);
    onSaveInternalNote(booking.id, noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  const handleSaveNote = () => {
    onSaveInternalNote(booking.id, internalNoteDraft);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between transform transition-transform duration-300 ease-out animate-slide-left">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">Clinical Patient Dossier</h2>
                <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  {booking.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Zenith Medical Record &amp; Treatment Status
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Patient Profile, Session Details & Status */}
            <DossierProfileAndStatusCard
              booking={booking}
              onUpdateStatus={onUpdateStatus}
            />

            {/* Pre-Op Medical Triage & Clinical Safety Alerts */}
            <DossierMedicalTriageCard medicalIntake={booking.medicalIntake} />

            {/* Interactive 32-Tooth Odontogram Section */}
            <DossierOdontogramSection
              odontogram={odontogram}
              selectedTooth={selectedTooth}
              onToggleTooth={onToggleTooth}
              onSetToothState={onSetToothState}
            />

            {/* Clinical Treatment Plan & Financial Quote Builder Section */}
            <DossierTreatmentBuilderSection
              treatmentItems={treatmentItems}
              onAddTreatmentItem={handleAddTreatmentItem}
              onRemoveTreatmentItem={handleRemoveTreatmentItem}
              insuranceDiscount={insuranceDiscount}
              onSetInsuranceDiscount={setInsuranceDiscount}
              subtotal={subtotal}
              discountAmount={discountAmount}
              finalTotal={finalTotal}
              monthlyEstimate={monthlyEstimate}
              planCopied={planCopied}
              onCopyPlan={handleCopyPlan}
              onOpenPlanModal={() => setIsPlanModalOpen(true)}
            />

            {/* Clinical PACS Digital Radiographs (OPG Panorex & CBCT) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Dental Radiographs &amp; PACS Imaging (DICOM 3.0)
                </label>
                <span className="text-[10px] font-mono font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded">
                  High-Definition Panorex
                </span>
              </div>
              <DentalPacsViewer
                patientName={booking.patientName}
                patientId={booking.id}
                hasSensitivity={Boolean(
                  booking.notes?.toLowerCase().includes('sensitiv') || booking.patientName.includes('Emma')
                )}
              />
            </div>

            {/* Doctor Internal Medical Notes (Editable) */}
            <DossierClinicalNotesCard
              internalNoteDraft={internalNoteDraft}
              setInternalNoteDraft={setInternalNoteDraft}
              noteSaved={noteSaved}
              onSaveNote={handleSaveNote}
              onOpenSoapModal={() => setIsSoapModalOpen(true)}
            />

            {/* Payment Breakdown */}
            <DossierDepositPaymentCard booking={booking} />
          </div>

          {/* Drawer Footer Actions */}
          <DossierFooterActions
            booking={booking}
            onClose={onClose}
            onOpenRxModal={onOpenRxModal}
          />
        </div>
      </div>

      {/* AI Dental Clinical Scribe Modal */}
      <ClinicalSoapScribeModal
        isOpen={isSoapModalOpen}
        onClose={() => setIsSoapModalOpen(false)}
        patientName={booking.patientName}
        bookingRef={booking.id}
        service={booking.service}
        doctor={booking.doctor}
        odontogram={odontogram}
        medicalIntake={booking.medicalIntake}
        onApplyNote={handleApplySoapNote}
      />

      {/* Official Clinical Treatment Agreement & Financial Estimate Modal */}
      <ClinicalTreatmentPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        bookingRef={booking.id}
        patientName={booking.patientName}
        patientPhone={booking.phone}
        patientEmail={booking.email}
        doctor={booking.doctor}
        treatmentItems={treatmentItems}
        subtotal={subtotal}
        discountPct={insuranceDiscount}
        discountAmount={discountAmount}
        finalTotal={finalTotal}
        monthlyEstimate={monthlyEstimate}
        depositAmount={booking.depositAmount || 50}
      />
    </div>
  );
}
