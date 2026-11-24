'use client';

import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { COMMON_CONDITIONS } from './intakeConstants';

interface IntakeConditionsAndSignatureSectionProps {
  selectedConditions: string[];
  onToggleCondition: (cond: string) => void;
  currentMedications: string;
  onChangeCurrentMedications: (val: string) => void;
  emergencyContact: string;
  onChangeEmergencyContact: (val: string) => void;
  signatureName: string;
  onChangeSignatureName: (val: string) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

export function IntakeConditionsAndSignatureSection({
  selectedConditions,
  onToggleCondition,
  currentMedications,
  onChangeCurrentMedications,
  emergencyContact,
  onChangeEmergencyContact,
  signatureName,
  onChangeSignatureName,
  isSubmitting,
  onClose,
}: IntakeConditionsAndSignatureSectionProps) {
  return (
    <div className="space-y-5">
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
                onClick={() => onToggleCondition(cond)}
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
          onChange={(e) => onChangeCurrentMedications(e.target.value)}
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
          onChange={(e) => onChangeEmergencyContact(e.target.value)}
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
          onChange={(e) => onChangeSignatureName(e.target.value)}
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
    </div>
  );
}
