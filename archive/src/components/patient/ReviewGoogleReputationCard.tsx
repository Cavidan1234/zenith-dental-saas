'use client';

import React from 'react';
import { Star, Check, Copy, ExternalLink, Sparkles } from 'lucide-react';

interface ReviewGoogleReputationCardProps {
  comment: string;
  setComment: (val: string) => void;
  copied: boolean;
  onCopy: () => void;
  onOpenGoogle: () => void;
}

export function ReviewGoogleReputationCard({
  comment,
  setComment,
  copied,
  onCopy,
  onOpenGoogle,
}: ReviewGoogleReputationCardProps) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 text-left space-y-4 animate-scale-in">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Thank You For Your Glowing Recommendation!
          </h3>
          <p className="text-[11px] text-emerald-200 mt-0.5">
            As an independent surgery, your Google Review supports our clinical team immensely.
          </p>
        </div>
      </div>

      {/* Editable Comment Box */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
          Review Text Preview (Ready to Paste):
        </label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 bg-slate-950/80 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-all resize-none leading-relaxed"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        <button
          type="button"
          onClick={onCopy}
          className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-white/10 hover:bg-white/15 border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Review!' : 'Copy Review Text'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenGoogle}
          className="px-4 py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-300 to-yellow-400 hover:from-amber-200 hover:to-yellow-300 shadow-lg shadow-amber-400/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ml-auto"
        >
          <Star className="w-3.5 h-3.5 fill-slate-950" />
          <span>Post to Google Maps (5★)</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
