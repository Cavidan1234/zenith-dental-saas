'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  CheckCheck,
  Copy,
  ExternalLink,
  ShieldCheck,
  Send,
  Clock,
  Sparkles,
} from 'lucide-react';

interface WhatsAppReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    id: string;
    patientName: string;
    phone: string;
    service: string;
    doctor: string;
    date: string;
    time: string;
    depositAmount: number;
  } | null;
  clinicName?: string;
}

export function WhatsAppReminderModal({
  isOpen,
  onClose,
  patient,
  clinicName = 'Zenith Dental & Esthetics',
}: WhatsAppReminderModalProps) {
  const [deliveryStatus, setDeliveryStatus] = useState<'sending' | 'sent' | 'delivered' | 'read'>('sending');
  const [copied, setCopied] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  // Play subtle sound using Web Audio API
  const playChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // AudioContext unavailable or blocked by autoplay policy
    }
  };

  useEffect(() => {
    if (!isOpen || !patient) {
      setDeliveryStatus('sending');
      setCopied(false);
      setDispatched(false);
      return;
    }

    // Realistic delivery progression: Sending -> Sent -> Delivered -> Read
    setDeliveryStatus('sending');
    const t1 = setTimeout(() => setDeliveryStatus('sent'), 450);
    const t2 = setTimeout(() => setDeliveryStatus('delivered'), 1000);
    const t3 = setTimeout(() => {
      setDeliveryStatus('read');
      playChime();
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, patient]);

  if (!isOpen || !patient) return null;

  const rawPhone = patient.phone.replace(/[^0-9]/g, '');
  const messageBody = `Hello ${patient.patientName},\n\nThis is a priority appointment reminder from ${clinicName} (14 Harley St, London).\n\n📅 Date: ${patient.date}\n⏰ Time: ${patient.time}\n🩺 Specialist: ${patient.doctor}\n🦷 Procedure: ${patient.service}\n💳 Prepaid Deposit: $${patient.depositAmount} (Confirmed)\n\n🔑 View your Digital Surgery Pass or reschedule:\nhttps://dentalbook.co/manage?ref=${patient.id}\n\nPlease arrive 10 minutes prior for room prep.\n\nWarm regards,\nZenith Dental Surgical Team`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExternalWhatsApp = () => {
    const encoded = encodeURIComponent(messageBody);
    window.open(`https://wa.me/${rawPhone}?text=${encoded}`, '_blank');
  };

  const handleConfirmDispatch = () => {
    setDispatched(true);
    playChime();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header - WhatsApp Green Theme */}
        <div className="bg-[#075e54] text-white px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-700 border-2 border-emerald-400/40 flex items-center justify-center font-bold text-white text-sm shadow-inner">
                {patient.patientName.slice(0, 2).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#075e54]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-white">{patient.patientName}</span>
                <span className="text-[10px] bg-emerald-800/80 text-emerald-200 px-1.5 py-0.5 rounded font-mono">
                  {patient.phone}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online · Verified Patient</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Chat Area */}
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

        {/* Action Controls */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={handleExternalWhatsApp}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
              <span>Open in WhatsApp</span>
            </button>
          </div>

          <button
            type="button"
            disabled={dispatched}
            onClick={handleConfirmDispatch}
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
      </div>
    </div>
  );
}
