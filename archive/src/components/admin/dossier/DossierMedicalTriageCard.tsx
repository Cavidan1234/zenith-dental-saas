'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { MedicalIntake } from '../PatientDossierDrawer';

interface DossierMedicalTriageCardProps {
  medicalIntake?: MedicalIntake;
}

export function DossierMedicalTriageCard({ medicalIntake }: DossierMedicalTriageCardProps) {
  if (!medicalIntake) {
    return (
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-slate-400" />
          <span>Medical triage not yet submitted by patient</span>
        </div>
        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          Pending
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-300 shadow-sm space-y-2.5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          Pre-Op Medical Triage Verified
        </span>
        <span className="text-[10px] font-mono text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full font-bold border border-amber-300">
          Clearance Signed
        </span>
      </div>

      {/* Allergies Alerts */}
      {medicalIntake.allergies &&
        medicalIntake.allergies.length > 0 &&
        !medicalIntake.allergies.includes('None') && (
          <div>
            <span className="text-[10px] font-bold text-rose-800 uppercase block mb-1">
              Critical Pharmacological Allergies:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {medicalIntake.allergies.map((allergy) => (
                <span
                  key={allergy}
                  className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs"
                >
                  ⚠️ {allergy}
                </span>
              ))}
            </div>
          </div>
        )}

      {/* Medical Conditions */}
      {medicalIntake.medicalConditions &&
        medicalIntake.medicalConditions.length > 0 &&
        !medicalIntake.medicalConditions.includes('None') && (
          <div>
            <span className="text-[10px] font-bold text-slate-700 uppercase block mb-1">
              Systemic Medical Conditions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {medicalIntake.medicalConditions.map((cond) => (
                <span
                  key={cond}
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200"
                >
                  🩺 {cond}
                </span>
              ))}
            </div>
          </div>
        )}

      {/* Anxiety & Sedation */}
      <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px]">
        <span className="text-slate-600 font-semibold">Dental Anxiety:</span>
        <span
          className={`font-black uppercase px-2 py-0.5 rounded text-[10px] ${
            medicalIntake.anxietyLevel === 'high'
              ? 'bg-purple-100 text-purple-900 border border-purple-300'
              : medicalIntake.anxietyLevel === 'moderate'
              ? 'bg-amber-100 text-amber-900'
              : 'bg-emerald-100 text-emerald-900'
          }`}
        >
          {medicalIntake.anxietyLevel}
        </span>
        {medicalIntake.sedationRequested && (
          <span className="font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded border border-purple-300 text-[10px]">
            Nitrous Oxide Sedation Requested
          </span>
        )}
      </div>

      {medicalIntake.currentMedications && (
        <div className="text-[11px] text-slate-600 pt-1 border-t border-amber-200/80">
          <span className="font-semibold text-slate-700">Prescriptions:</span>{' '}
          {medicalIntake.currentMedications}
        </div>
      )}

      {medicalIntake.emergencyContact && (
        <div className="text-[11px] text-slate-600 pt-1 border-t border-amber-200/80">
          <span className="font-semibold text-slate-700">Emergency Contact:</span>{' '}
          {medicalIntake.emergencyContact}
        </div>
      )}
    </div>
  );
}
