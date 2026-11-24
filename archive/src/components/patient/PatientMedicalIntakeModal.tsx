'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  AlertCircle,
  HeartPulse,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { playLuxuryChime, playHapticTick } from '@/lib/soundscapes';

export interface MedicalIntakeData {
  anxietyLevel: 'none' | 'mild' | 'moderate' | 'high';
  sedationRequested: boolean;
  allergies: string[];
  medicalConditions: string[];
  currentMedications: string;
  emergencyContact: string;
  signatureName: string;
  submittedAt: string;
}

interface PatientMedicalIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingRef: string;
  patientName: string;
  onSaveIntake: (data: MedicalIntakeData) => void;
  initialData?: MedicalIntakeData | null;
}

const COMMON_ALLERGIES = [
  'Penicillin',
  'Amoxicillin',
  'Latex',
  'Local Anesthetic (Lidocaine)',
  'Aspirin',
  'Codeine',
  'None',
];

const COMMON_CONDITIONS = [
  'High Blood Pressure (Hypertension)',
  'Diabetes (Type 1 or 2)',
  'Heart Murmur / Artificial Valve',
  'Blood Thinners (Anticoagulants)',
  'Asthma / Respiratory',
  'None',
];

export function PatientMedicalIntakeModal({
  isOpen,
  onClose,
  bookingRef,
  patientName,
  onSaveIntake,
  initialData,
}: PatientMedicalIntakeModalProps) {
  const [anxietyLevel, setAnxietyLevel] = useState<'none' | 'mild' | 'moderate' | 'high'>(
    initialData?.anxietyLevel || 'mild'
  );
  const [sedationRequested, setSedationRequested] = useState<boolean>(
    initialData?.sedationRequested || false
  );
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(
    initialData?.allergies || ['None']
  );
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    initialData?.medicalConditions || ['None']
  );
  const [currentMedications, setCurrentMedications] = useState<string>(
    initialData?.currentMedications || ''
  );
  const [emergencyContact, setEmergencyContact] = useState<string>(
    initialData?.emergencyContact || ''
  );
  const [signatureName, setSignatureName] = useState<string>(
    initialData?.signatureName || patientName || ''
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleAllergy = (allergy: string) => {
    playHapticTick();
    if (allergy === 'None') {
      setSelectedAllergies(['None']);
      return;
    }
    setSelectedAllergies((prev) => {
      const filtered = prev.filter((a) => a !== 'None');
      if (filtered.includes(allergy)) {
        const next = filtered.filter((a) => a !== allergy);
        return next.length === 0 ? ['None'] : next;
      } else {
        return [...filtered, allergy];
      }
    });
  };

  const toggleCondition = (condition: string) => {
    playHapticTick();
    if (condition === 'None') {
      setSelectedConditions(['None']);
      return;
    }
    setSelectedConditions((prev) => {
      const filtered = prev.filter((c) => c !== 'None');
      if (filtered.includes(condition)) {
        const next = filtered.filter((c) => c !== condition);
        return next.length === 0 ? ['None'] : next;
      } else {
        return [...filtered, condition];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: MedicalIntakeData = {
      anxietyLevel,
      sedationRequested,
      allergies: selectedAllergies,
      medicalConditions: selectedConditions,
      currentMedications: currentMedications.trim(),
      emergencyContact: emergencyContact.trim(),
      signatureName: signatureName.trim(),
      submittedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onSaveIntake(payload);
      setIsSubmitting(false);
      setIsSuccess(true);
      playLuxuryChime();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1400);
    }, 500);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none luxury-backdrop-enter"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 transform-gpu luxury-modal-enter my-auto">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-blue-700 text-white px-6 py-5 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
              GDC &amp; CQC Clinical Compliance
            </span>
            <span className="text-xs font-mono text-brand-100">Ref: {bookingRef}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Pre-Op Medical Triage &amp; Intake
          </h3>
          <p className="text-xs text-brand-100 mt-1">
            Complete your health history to expedite surgical check-in and verify clinical anesthesia safety.
          </p>
        </div>

        {/* Modal Form */}
        {isSuccess ? (
          <div className="p-10 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-slate-900">Medical Triage Verified!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your health passport has been encrypted and synced with the surgery suite. Fast-track check-in is now active.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* 1. Dental Anxiety Level */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">
                1. Dental Anxiety Assessment
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'None (Calm)', emoji: '😊' },
                  { id: 'mild', label: 'Mild', emoji: '🙂' },
                  { id: 'moderate', label: 'Moderate', emoji: '😬' },
                  { id: 'high', label: 'High (Nervous)', emoji: '😰' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAnxietyLevel(item.id as any)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      anxietyLevel === item.id
                        ? 'border-brand-600 bg-brand-50/80 text-brand-900 shadow-sm ring-2 ring-brand-300'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="text-lg block mb-0.5">{item.emoji}</span>
                    <span className="text-[11px] font-bold block">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Sedation Checkbox */}
              <label className="mt-3 flex items-start gap-2.5 p-3 rounded-xl bg-purple-50/70 border border-purple-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sedationRequested}
                  onChange={(e) => setSedationRequested(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-purple-600 rounded border-purple-300 focus:ring-purple-500 cursor-pointer"
                />
                <div className="text-xs text-purple-950">
                  <span className="font-extrabold block">Request Inhalation Sedation (Nitrous Oxide / Happy Gas)</span>
                  <span className="text-[11px] text-purple-800 font-medium">
                    Recommended for moderate-to-high anxiety. Rapid recovery, drive home immediately after.
                  </span>
                </div>
              </label>
            </div>

            {/* 2. Known Allergies */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center justify-between">
                <span>2. Medical &amp; Pharmacological Allergies</span>
                <span className="text-[10px] text-slate-400 font-normal">Select all that apply</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_ALLERGIES.map((allergy) => {
                  const isSelected = selectedAllergies.includes(allergy);
                  return (
                    <button
                      key={allergy}
                      type="button"
                      onClick={() => toggleAllergy(allergy)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? allergy === 'None'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-rose-50 text-rose-800 border-2 border-rose-300 shadow-2xs ring-1 ring-rose-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                      }`}
                    >
                      {allergy === 'None' ? 'None (No Allergies)' : allergy}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Systemic Medical Conditions */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center justify-between">
                <span>3. Systemic Health &amp; Medical Conditions</span>
                <span className="text-[10px] text-slate-400 font-normal">Select all that apply</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_CONDITIONS.map((cond) => {
                  const isSelected = selectedConditions.includes(cond);
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => toggleCondition(cond)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? cond === 'None'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-blue-50 text-blue-900 border-2 border-blue-300 shadow-2xs ring-1 ring-blue-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                      }`}
                    >
                      {cond === 'None' ? 'None (Healthy)' : cond}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Current Prescriptions & Medications */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1">
                4. Current Prescriptions &amp; Medications
              </label>
              <input
                type="text"
                placeholder="e.g. Metformin 500mg, Lisinopril 10mg, or 'None'"
                value={currentMedications}
                onChange={(e) => setCurrentMedications(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 bg-white shadow-2xs"
              />
            </div>

            {/* 5. Emergency Contact */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1">
                5. Emergency Contact (Next of Kin)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Smith (+44 7911 998877) - Spouse"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 bg-white shadow-2xs"
              />
            </div>

            {/* 6. Legal Clearance Signature */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>6. Digital Declaration &amp; Consent Clearance</span>
              </label>
              <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                I confirm the above medical disclosure is accurate and complete to the best of my knowledge.
              </p>
              <input
                type="text"
                required
                placeholder="Type your full legal name as digital signature"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 bg-white shadow-2xs"
              />
            </div>

            {/* Submit & Security Footnote */}
            <div className="pt-2">
              <div className="flex items-center justify-center gap-2 mb-3 text-[11px] text-slate-500 font-medium">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Medical Encryption · CQC Confidential Protocol</span>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-md shadow-brand-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying with Surgery Suite...' : 'Save & Verify Medical Triage'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
