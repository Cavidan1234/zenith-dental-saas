'use client';

import React from 'react';

interface ExpressWalletButtonsProps {
  isSubmitting: boolean;
  onExpressPayment: (method: 'google_pay' | 'apple_pay') => void;
}

export function ExpressWalletButtons({
  isSubmitting,
  onExpressPayment,
}: ExpressWalletButtonsProps) {
  return (
    <>
      {/* Express Checkout Options (Google Pay TEST & Apple Pay) */}
      <div>
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
          Express Checkout
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Google Pay Button (TEST Mode) */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onExpressPayment('google_pay')}
            className="h-12 rounded-xl bg-slate-950 hover:bg-black active:scale-95 text-white flex items-center justify-center gap-2 font-bold text-sm shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Pay with GPay (TEST)</span>
          </button>

          {/* Apple Pay Button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onExpressPayment('apple_pay')}
            className="h-12 rounded-xl bg-black hover:bg-slate-900 active:scale-95 text-white flex items-center justify-center gap-2 font-bold text-sm shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5 shrink-0 fill-current" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.58-7.77-11.67-14.19-6.09-9.57-10.9-20.2-14.42-31.91-3.52-11.71-5.28-23.01-5.28-33.89 0-14.82 3.69-27.18 11.08-37.07 7.38-9.9 16.71-14.93 27.99-15.11 4.71 0 10.11 1.34 16.2 4.02 6.09 2.68 10.15 4.06 12.18 4.12 1.57 0 5.68-1.39 12.33-4.17 6.64-2.78 11.97-4.04 15.99-3.79 12.44.82 22.37 5.48 29.8 13.98-10.88 6.58-16.2 15.63-15.96 27.16.24 9.07 3.73 16.75 10.47 23.05 6.74 6.3 14.86 10.02 24.36 11.16-2.09 6.24-4.52 12.56-7.29 18.96zM119.22 33.15c0-7.38 2.65-14.35 7.95-20.91 5.3-6.56 11.83-10.64 19.59-12.24.16 1.09.24 2.18.24 3.28 0 7.38-2.73 14.38-8.2 21-5.46 6.62-12.04 10.74-19.74 12.36-.16-1.18-.24-2.34-.24-3.49z" />
            </svg>
            <span>Apple Pay</span>
          </button>
        </div>
      </div>

      {/* Clean Minimalist Divider */}
      <div className="relative my-2 flex items-center justify-center">
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
          or pay with credit / debit card
        </span>
        <div className="border-t border-slate-200 w-full" />
      </div>
    </>
  );
}
