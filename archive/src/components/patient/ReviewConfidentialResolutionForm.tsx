'use client';

import React from 'react';
import { AlertCircle, Send, CheckCircle2 } from 'lucide-react';

interface ReviewConfidentialResolutionFormProps {
  submitted: boolean;
  onSubmit: (e: React.FormEvent) => void;
  wantsCallback: boolean;
  setWantsCallback: (val: boolean) => void;
}

export function ReviewConfidentialResolutionForm({
  submitted,
  onSubmit,
  wantsCallback,
  setWantsCallback,
}: ReviewConfidentialResolutionFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="p-5 sm:p-6 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-left space-y-4 animate-scale-in"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40 shrink-0">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Confidential Practice Director Resolution
          </h3>
          <p className="text-[11px] text-rose-200 mt-0.5">
            We apologize your visit did not meet perfection. Clinical Director Dr. Rashad Aliyev will review this privately.
          </p>
        </div>
      </div>

      {!submitted ? (
        <>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Please tell us what went wrong:
            </label>
            <textarea
              rows={3}
              required
              placeholder="Please describe your discomfort, waiting time, or any questions regarding your post-op care..."
              className="w-full p-3 bg-slate-950/80 border border-rose-500/30 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="callback"
              checked={wantsCallback}
              onChange={(e) => setWantsCallback(e.target.checked)}
              className="rounded border-slate-700 text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="callback" className="text-xs text-slate-300 cursor-pointer">
              Request an urgent telephone call from Practice Management today
            </label>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Confidential Resolution Ticket</span>
            </button>
          </div>
        </>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Resolution Ticket Dispatched to Practice Director</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Dr. Rashad Aliyev has been notified directly on priority pager. We will contact you at your registered phone number shortly.
          </p>
        </div>
      )}
    </form>
  );
}
