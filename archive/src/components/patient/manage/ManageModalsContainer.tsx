'use client';

import React from 'react';
import { ManagedBooking, RESCHEDULE_OPTIONS } from '@/data/seedBookings';
import { PatientRescheduleModal } from '@/components/patient/PatientRescheduleModal';
import { PatientCancelModal } from '@/components/patient/PatientCancelModal';
import { PatientMedicalIntakeModal, MedicalIntakeData } from '@/components/patient/PatientMedicalIntakeModal';
import { DigitalWalletPassModal } from '@/components/patient/DigitalWalletPassModal';
import { InsuranceVerificationModal, InsurancePolicy } from '@/components/patient/InsuranceVerificationModal';

interface ManageModalsContainerProps {
  activeBooking: ManagedBooking;
  isRescheduling: boolean;
  onCloseReschedule: () => void;
  selectedReschedule: number;
  onSelectRescheduleIndex: (idx: number) => void;
  onConfirmReschedule: () => void;
  cancelModal: boolean;
  onCloseCancel: () => void;
  onConfirmCancel: () => void;
  isIntakeOpen: boolean;
  onCloseIntake: () => void;
  onSaveIntake: (data: MedicalIntakeData) => void;
  isWalletOpen: boolean;
  onCloseWallet: () => void;
  isInsuranceOpen: boolean;
  onCloseInsurance: () => void;
  onApplyInsurance: (policy: InsurancePolicy) => void;
}

export function ManageModalsContainer({
  activeBooking,
  isRescheduling,
  onCloseReschedule,
  selectedReschedule,
  onSelectRescheduleIndex,
  onConfirmReschedule,
  cancelModal,
  onCloseCancel,
  onConfirmCancel,
  isIntakeOpen,
  onCloseIntake,
  onSaveIntake,
  isWalletOpen,
  onCloseWallet,
  isInsuranceOpen,
  onCloseInsurance,
  onApplyInsurance,
}: ManageModalsContainerProps) {
  return (
    <>
      {/* Reschedule Modal / Slide-out */}
      <PatientRescheduleModal
        isOpen={isRescheduling}
        onClose={onCloseReschedule}
        options={RESCHEDULE_OPTIONS}
        selectedIndex={selectedReschedule}
        onSelectIndex={onSelectRescheduleIndex}
        doctorName={activeBooking.doctor}
        onConfirm={onConfirmReschedule}
      />

      {/* Cancel Confirmation Dialog */}
      <PatientCancelModal
        isOpen={cancelModal}
        onClose={onCloseCancel}
        depositAmount={activeBooking.depositAmount}
        onConfirmCancel={onConfirmCancel}
      />

      {/* Medical Intake & Pre-Op Triage Modal */}
      <PatientMedicalIntakeModal
        isOpen={isIntakeOpen}
        onClose={onCloseIntake}
        bookingRef={activeBooking.id}
        patientName={activeBooking.patientName}
        onSaveIntake={onSaveIntake}
        initialData={activeBooking.medicalIntake}
      />

      {/* Luxury Digital Wallet Pass Modal (Apple / Google Wallet) */}
      <DigitalWalletPassModal
        isOpen={isWalletOpen}
        onClose={onCloseWallet}
        patientName={activeBooking.patientName}
        bookingRef={activeBooking.id}
        service={activeBooking.service}
        doctor={activeBooking.doctor}
        date={activeBooking.date}
        time={activeBooking.time}
      />

      {/* Private Dental Insurance Verification Modal */}
      <InsuranceVerificationModal
        isOpen={isInsuranceOpen}
        onClose={onCloseInsurance}
        patientName={activeBooking.patientName}
        bookingRef={activeBooking.id}
        serviceName={activeBooking.service}
        estimatedFee={activeBooking.service.includes('Whitening') ? 450 : 250}
        onApplyInsurance={onApplyInsurance}
        existingPolicy={activeBooking.insurancePolicy}
      />
    </>
  );
}
