'use client';

import React from 'react';
import { Sparkles, Check } from 'lucide-react';

interface DossierClinicalNotesCardProps {
  internalNoteDraft: string;
  setInternalNoteDraft: (val: string) => void;
  noteSaved: boolean;
  onSaveNote: () => void;
  onOpenSoapModal: () => void;
}

export function DossierClinicalNotesCard({
  internalNoteDraft,
  setInternalNoteDraft,
  noteSaved,
  onSaveNote,
  onOpenSoapModal,
}: DossierClinicalNotesCardProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Internal Clinical Notes (Doctor / Admin Only)
        </label>
        <button
          type="button"
          onClick={onOpenSoapModal}
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
        >
          <Sparkles className="w-3 h-3 text-brand-600" />
          <span>AI SOAP Scribe</span>
        </button>
      </div>
      <textarea
        rows={3}
        value={internalNoteDraft}
        onChange={(e) => setInternalNoteDraft(e.target.value)}
        placeholder="Enter clinical notes, anesthesia observations, or post-op instructions..."
        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all placeholder-slate-400 resize-none shadow-2xs"
      />
      <button
        type="button"
        onClick={onSaveNote}
        className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
          noteSaved ? 'bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
        }`}
      >
        {noteSaved ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Clinical Note Saved!</span>
          </>
        ) : (
          <span>Save Clinical Note</span>
        )}
      </button>
    </div>
  );
}
