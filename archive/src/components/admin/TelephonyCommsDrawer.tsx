'use client';

import React, { useState } from 'react';
import {
  Radio,
  X,
  Send,
} from 'lucide-react';
import { playLuxuryChime } from '@/lib/soundscapes';

interface TelephonyCommsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatchPing: () => void;
}

export function TelephonyCommsDrawer({
  isOpen,
  onClose,
  onDispatchPing,
}: TelephonyCommsDrawerProps) {
  const [commsFilter, setCommsFilter] = useState<'all' | 'sms' | 'email' | 'webhook'>('all');

  if (!isOpen) return null;

  const events = [
    {
      id: 'evt-1',
      type: 'sms',
      recipient: 'Arthur Pendelton (+44 7891 112233)',
      msg: '6-Month Oral Health Recall with VIP booking link (dentalbook.co/recall?token=zd_rec-1)',
      sid: 'Twilio SID: SM9821034',
      time: '2 mins ago',
      status: 'DELIVERED',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'evt-2',
      type: 'email',
      recipient: 'Emma Richardson (emma.r@example.co.uk)',
      msg: 'Surgery Pass, Google Calendar invite & 48h Whitening Pre-Op Instructions',
      sid: 'SendGrid ID: sg_msg_829104',
      time: '18 mins ago',
      status: 'OPENED',
      badge: 'bg-brand-50 text-brand-700 border-brand-200',
    },
    {
      id: 'evt-3',
      type: 'sms',
      recipient: 'Oliver Vance (+44 7700 900456)',
      msg: '24-Hour Pre-Op Fasting & Sterilization Room Buffer Notice for Dental Implant CBCT',
      sid: 'Twilio SID: SM7719201',
      time: '1 hr ago',
      status: 'DELIVERED',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'evt-4',
      type: 'webhook',
      recipient: 'Stripe Payment Gateway Hook',
      msg: 'Prepaid deposit capture $50.00 USD for Booking Ref ZD-829104 (evt_3Mv8291)',
      sid: 'Webhook Ref: evt_3Mv8291',
      time: '2 hrs ago',
      status: 'PROCESSED (200 OK)',
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'evt-5',
      type: 'sms',
      recipient: 'Sophia Chen (+44 7700 900789)',
      msg: 'Porcelain Veneer Smile Design Consultation confirmed with Dr. Leyla Mammadova',
      sid: 'Twilio SID: SM6619028',
      time: 'Yesterday',
      status: 'DELIVERED',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'evt-6',
      type: 'email',
      recipient: 'James Montgomery (j.montgomery@outlook.com)',
      msg: 'Pre-registration medical dossier verification & Digital Surgery Pass',
      sid: 'SendGrid ID: sg_msg_829107',
      time: 'Yesterday',
      status: 'DELIVERED',
      badge: 'bg-brand-50 text-brand-700 border-brand-200',
    },
  ];

  const filteredEvents = commsFilter === 'all' ? events : events.filter((e) => e.type === commsFilter);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between transform transition-transform duration-300 ease-out animate-slide-left">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-950 to-brand-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-xs">
                <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-white">Telephony &amp; Comms Radar</h2>
                  <span className="text-[10px] font-mono font-bold bg-cyan-500/30 text-cyan-200 px-2 py-0.5 rounded border border-cyan-400/30">
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Twilio SMS, SendGrid Email &amp; Webhook Audit Ledger
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Gateway KPI Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Delivery Rate</span>
                <span className="text-lg font-black text-emerald-600">99.4%</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Outbound SMS</span>
                <span className="text-lg font-black text-brand-600">142 Pings</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Emails Opened</span>
                <span className="text-lg font-black text-cyan-600">88 Reads</span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              {[
                { id: 'all', label: 'All Events (6)' },
                { id: 'sms', label: 'Twilio SMS (3)' },
                { id: 'email', label: 'SendGrid (2)' },
                { id: 'webhook', label: 'Webhooks (1)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCommsFilter(tab.id as any)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-center text-[11px] font-bold transition-all cursor-pointer ${
                    commsFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Comms Event Ledger */}
            <div className="space-y-3">
              {filteredEvents.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900">{item.recipient}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${item.badge}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{item.msg}</p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{item.sid}</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                playLuxuryChime();
                onDispatchPing();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Telephony Health Check</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
