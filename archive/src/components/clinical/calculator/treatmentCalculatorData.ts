export interface TreatmentOption {
  id: string;
  name: string;
  unitLabel: string;
  basePrice: number;
  minQty: number;
  maxQty: number;
  defaultQty: number;
  warranty: string;
  depositAmount: number;
}

export const TREATMENT_CALCULATOR_OPTIONS: TreatmentOption[] = [
  {
    id: 'veneers',
    name: 'Ceramic Veneers',
    unitLabel: 'Teeth (Smile Line)',
    basePrice: 750,
    minQty: 1,
    maxQty: 10,
    defaultQty: 4,
    warranty: '5-Year Ceramic Guarantee',
    depositAmount: 50,
  },
  {
    id: 'implants',
    name: 'Swiss 3D Implants',
    unitLabel: 'Implants (Titanium)',
    basePrice: 1450,
    minQty: 1,
    maxQty: 6,
    defaultQty: 1,
    warranty: 'Lifetime Osseointegration Guarantee',
    depositAmount: 100,
  },
  {
    id: 'invisalign',
    name: 'Invisalign Aligners',
    unitLabel: 'Dental Arches',
    basePrice: 1400,
    minQty: 1,
    maxQty: 2,
    defaultQty: 2,
    warranty: 'ClinCheck 3D Precision Guarantee',
    depositAmount: 50,
  },
  {
    id: 'whitening',
    name: 'Laser Whitening',
    unitLabel: 'Clinical Session',
    basePrice: 350,
    minQty: 1,
    maxQty: 2,
    defaultQty: 1,
    warranty: 'Up to 8 Shades Whiter Guarantee',
    depositAmount: 50,
  },
];

export const FINANCING_TERMS = [12, 24, 36] as const;
export type FinancingTerm = typeof FINANCING_TERMS[number];
