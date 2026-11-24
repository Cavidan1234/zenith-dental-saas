'use client';

import React from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  Send,
} from 'lucide-react';

interface WhatsAppModalFooterProps {
  copied: boolean;
  dispatched: boolean;
  onCopy: () => void;
  onExternalWhatsApp: () => void;
  onConfirmDispatch: () => void;
}

export function WhatsAppModalFooter({
  copied,
  dispatched,
  onCopy,
  onExternalWhatsApp,
  onConfirmDispatch,
}: WhatsAppModalFooterProps) {
  return (
    <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCopy}
          className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy Text'}</span>
        </button>

        <button
          type="button"
          onClick={onExternalWhatsApp}
          className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
        >
          <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
          <span>Open in WhatsApp</span>
        </button>
      </div>

      <button
        type="button"
        disabled={dispatched}
        onClick={onConfirmDispatch}
        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer ${
          dispatched
            ? 'bg-emerald-600 text-white cursor-default'
            : 'bg-gradient-to-r from-[#075e54] to-[#128c7e] hover:from-[#0b6b60] hover:to-[#17a090] text-white shadow-emerald-900/10'
        }`}
      >
        {dispatched ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Dispatched to Patient!</span>
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            <span>Confirm Outbound Dispatch</span>
          </>
        )}
      </button>
    </div>
  );
}
