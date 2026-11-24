'use client';

import { useState } from 'react';
import type { TreatmentPlanItem } from './DossierTreatmentBuilderSection';
import type { BookingRecord } from '../PatientDossierDrawer';

export function useDossierTreatmentPlan(booking: BookingRecord | null) {
  const [treatmentItems, setTreatmentItems] = useState<TreatmentPlanItem[]>([
    { id: '1', tooth: 14, procedure: 'E-Max Porcelain Veneer & Shade Match', cost: 850 },
    { id: '2', tooth: 19, procedure: 'CBCT Guided Titanium Implant & Crown', cost: 2200 },
  ]);
  const [insuranceDiscount, setInsuranceDiscount] = useState<number>(0);
  const [planCopied, setPlanCopied] = useState(false);

  const handleAddTreatmentItem = (tooth: number, procedure: string, cost: number) => {
    setTreatmentItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        tooth,
        procedure,
        cost,
      },
    ]);
  };

  const handleRemoveTreatmentItem = (id: string) => {
    setTreatmentItems((prev) => prev.filter((i) => i.id !== id));
  };

  const subtotal = treatmentItems.reduce((acc, curr) => acc + curr.cost, 0);
  const discountAmount = Math.round(subtotal * (insuranceDiscount / 100));
  const finalTotal = subtotal - discountAmount;
  const monthlyEstimate = Math.round(finalTotal / 12);

  const handleCopyPlan = () => {
    if (!booking) return;
    const lines = [
      `ZENITH DENTAL & ESTHETICS — CLINICAL TREATMENT ESTIMATE`,
      `Patient: ${booking.patientName} (${booking.id})`,
      `Lead Specialist: ${booking.doctor}`,
      `Date: ${new Date().toLocaleDateString('en-GB')}`,
      `----------------------------------------------------`,
      ...treatmentItems.map(
        (t) => `Tooth #${t.tooth || 'General'}: ${t.procedure} — $${t.cost}`
      ),
      `----------------------------------------------------`,
      `Subtotal: $${subtotal}`,
      insuranceDiscount > 0 ? `Preferred Discount (${insuranceDiscount}%): -$${discountAmount}` : null,
      `Estimated Total: $${finalTotal}`,
      `0% APR Financing Option (12 Mos): ~$${monthlyEstimate}/mo`,
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(lines);
    setPlanCopied(true);
    setTimeout(() => setPlanCopied(false), 2500);
  };

  return {
    treatmentItems,
    insuranceDiscount,
    setInsuranceDiscount,
    planCopied,
    handleAddTreatmentItem,
    handleRemoveTreatmentItem,
    subtotal,
    discountAmount,
    finalTotal,
    monthlyEstimate,
    handleCopyPlan,
  };
}
