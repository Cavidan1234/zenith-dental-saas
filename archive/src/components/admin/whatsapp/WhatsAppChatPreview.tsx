'use client';

import React from 'react';
import {
  Check,
  CheckCheck,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface WhatsAppChatPreviewProps {
  clinicName: string;
  messageBody: string;
  deliveryStatus: 'sending' | 'sent' | 'delivered' | 'read';
}

export function WhatsAppChatPreview({
  clinicName,
  messageBody,
  deliveryStatus,
}: WhatsAppChatPreviewProps) {
  return (
    <div className="p-5 flex-1 overflow-y-auto bg-[#efeae2]/80 space-y-4 text-xs">
      {/* Security Banner */}
      <div className="flex items-center justify-center">
        <div className="bg-[#ffeecd] text-[#54656f] text-[10px] font-medium px-3 py-1.5 rounded-lg shadow-2xs flex items-center gap-1.5 border border-[#e2d5b6] text-center max-w-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00a884] shrink-0" />
          <span>Messages are end-to-end encrypted under UK GDPR &amp; HIPAA standards.</span>
        </div>
      </div>

      {/* Chat Bubble */}
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-[#d9fdd3] text-[#111b21] p-3.5 rounded-2xl rounded-tr-xs shadow-sm border border-[#c1e9be] space-y-2 relative">
          <div className="font-semibold text-[11px] text-[#075e54] flex items-center gap-1 border-b border-emerald-200/60 pb-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>{clinicName} Surgery Dispatch</span>
          </div>

          <div className="whitespace-pre-line text-[11px] leading-relaxed">
            {messageBody}
          </div>

          {/* Delivery Metadata */}
          <div className="flex items-center justify-end gap-1 text-[10px] text-[#667781] pt-1">
            <span>Just now</span>
            {deliveryStatus === 'sending' && <Clock className="w-3 h-3 animate-spin text-slate-400" />}
            {deliveryStatus === 'sent' && <Check className="w-3.5 h-3.5 text-slate-400" />}
            {deliveryStatus === 'delivered' && <CheckCheck className="w-3.5 h-3.5 text-slate-400" />}
            {deliveryStatus === 'read' && (
              <CheckCheck className="w-3.5 h-3.5 text-sky-500 font-bold" />
            )}
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex justify-center">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${
            deliveryStatus === 'read'
              ? 'bg-sky-100 text-sky-800 border border-sky-300'
              : deliveryStatus === 'delivered'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              deliveryStatus === 'read'
                ? 'bg-sky-500'
                : deliveryStatus === 'delivered'
                ? 'bg-emerald-500'
                : 'bg-amber-500 animate-pulse'
            }`}
          />
          {deliveryStatus === 'read'
            ? 'Receipt Verified (Read ✓✓)'
            : deliveryStatus === 'delivered'
            ? 'Delivered to Handset (✓✓)'
            : 'Routing via Meta Cloud API...'}
        </span>
      </div>
    </div>
  );
}
