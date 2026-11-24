'use client';

import React from 'react';
import { CreditCard, Lock, ChevronLeft, Clock } from 'lucide-react';
import { ServiceItem, DoctorItem } from './Step1ServiceDoctor';
import { ExpressWalletButtons } from './ExpressWalletButtons';

interface Step4PaymentDepositProps {
  selectedService: ServiceItem | null;
  selectedDoctor: DoctorItem | null;
  selectedDate: string;
  selectedSlot: string | null;
  isSubmitting: boolean;
  paymentProcessingLabel: string;
  cardHolder: string;
  onChangeCardHolder: (value: string) => void;
  cardNumber: string;
  onChangeCardNumber: (value: string) => void;
  cardExpiry: string;
  onChangeCardExpiry: (value: string) => void;
  cardCvc: string;
  onChangeCardCvc: (value: string) => void;
  cardBrand: 'visa' | 'mastercard' | 'amex' | 'generic';
  onFillTestCard: () => void;
  onExpressPayment: (method: 'google_pay' | 'apple_pay') => void;
  onCardPayment: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function Step4PaymentDeposit({
  selectedService,
  selectedDoctor,
  selectedDate,
  selectedSlot,
  isSubmitting,
  paymentProcessingLabel,
  cardHolder,
  onChangeCardHolder,
  cardNumber,
  onChangeCardNumber,
  cardExpiry,
  onChangeCardExpiry,
  cardCvc,
  onChangeCardCvc,
  cardBrand,
  onFillTestCard,
  onExpressPayment,
  onCardPayment,
  onBack,
}: Step4PaymentDepositProps) {
  return (
    <div className="space-y-4 step-view-enter">
      {/* Confirmed Slot & Deposit Summary */}
      <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Reserved Consultation Slot
          </span>
          <p className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
            {selectedService?.name} with {selectedDoctor?.name}
          </p>
          <p className="text-[11px] text-slate-600 font-medium">
            {selectedDate} at {selectedSlot}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-semibold text-slate-500 block">Total Due Now</span>
          <p className="text-lg sm:text-xl font-black text-brand-700">
            ${selectedService ? selectedService.depositCents / 100 : 50} USD
          </p>
          <span className="text-[10px] text-emerald-600 font-bold block">
            Refundable up to 24h prior
          </span>
        </div>
      </div>

      {/* Express Checkout Options (Google Pay TEST & Apple Pay) */}
      <ExpressWalletButtons
        isSubmitting={isSubmitting}
        onExpressPayment={onExpressPayment}
      />

      {/* Manual Card Form */}
      <form onSubmit={onCardPayment} className="space-y-2.5">
        {/* Cardholder Name */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            required
            placeholder="Name as on card"
            value={cardHolder}
            onChange={(e) => onChangeCardHolder(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 bg-white shadow-2xs"
          />
        </div>

        {/* Card Number Input with Dynamic Card Brand Detection */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Card Number
            </label>
            <button
              type="button"
              onClick={onFillTestCard}
              className="text-[11px] font-bold text-brand-600 hover:text-brand-800 hover:underline cursor-pointer"
            >
              Fill Stripe sandbox test card (4242)
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="4242 •••• •••• ••••"
              value={cardNumber}
              onChange={(e) => onChangeCardNumber(e.target.value)}
              className="w-full h-11 pl-3.5 pr-12 rounded-xl border border-slate-300 text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 bg-white shadow-2xs"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
              {cardBrand === 'visa' && (
                <span className="text-[11px] font-black text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  VISA
                </span>
              )}
              {cardBrand === 'mastercard' && (
                <span className="text-[11px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  MC
                </span>
              )}
              {cardBrand === 'amex' && (
                <span className="text-[11px] font-black text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">
                  AMEX
                </span>
              )}
              {cardBrand === 'generic' && <CreditCard className="w-5 h-5 text-slate-400" />}
            </div>
          </div>
        </div>

        {/* Expiry & CVC Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              required
              placeholder="MM / YY"
              value={cardExpiry}
              onChange={(e) => onChangeCardExpiry(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 bg-white shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Security Code (CVC)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                maxLength={4}
                placeholder="123"
                value={cardCvc}
                onChange={(e) => onChangeCardCvc(e.target.value)}
                className="w-full h-11 pl-3.5 pr-8 rounded-xl border border-slate-300 text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 bg-white shadow-2xs"
              />
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Security Trust Note */}
        <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-500 font-medium">
          <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>256-Bit SSL Encrypted · PCI-DSS Compliant · Zero PHI stored</span>
        </div>

        {/* Submit & Back Action Row */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="group/back inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group/pay inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-md shadow-brand-600/30 hover:shadow-lg disabled:opacity-50 transition-all duration-200 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Clock className="w-4 h-4 animate-spin text-white" />
                <span>{paymentProcessingLabel}</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-white" />
                <span>
                  Pay ${selectedService ? selectedService.depositCents / 100 : 50} Deposit & Confirm
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
