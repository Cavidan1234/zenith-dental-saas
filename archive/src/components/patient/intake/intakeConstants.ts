export interface MedicalIntakeData {
  anxietyLevel: 'none' | 'mild' | 'moderate' | 'high';
  sedationRequested: boolean;
  allergies: string[];
  medicalConditions: string[];
  currentMedications: string;
  emergencyContact: string;
  signatureName: string;
  submittedAt: string;
}

export const COMMON_ALLERGIES = [
  'Penicillin',
  'Amoxicillin',
  'Latex',
  'Local Anesthetic (Lidocaine)',
  'Aspirin',
  'Codeine',
  'None',
];

export const COMMON_CONDITIONS = [
  'High Blood Pressure (Hypertension)',
  'Diabetes (Type 1 or 2)',
  'Heart Murmur / Artificial Valve',
  'Blood Thinners (Anticoagulants)',
  'Asthma / Respiratory',
  'None',
];
