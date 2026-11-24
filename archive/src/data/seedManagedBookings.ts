import { MedicalIntakeData } from '@/components/patient/PatientMedicalIntakeModal';
import { InsurancePolicy } from '@/components/patient/InsuranceVerificationModal';

export interface ManagedBooking {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  service: string;
  doctor: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'in_surgery';
  depositStatus: 'paid' | 'unpaid';
  depositAmount: number;
  paymentMethod?: string;
  paymentLabel?: string;
  notes?: string;
  internalNotes?: string;
  medicalIntake?: MedicalIntakeData;
  insurancePolicy?: InsurancePolicy;
}

export const DEFAULT_MANAGED_BOOKINGS: Record<string, ManagedBooking> = {
  'ZD-829104': {
    id: 'ZD-829104',
    patientName: 'Emma Richardson',
    email: 'emma.r@example.co.uk',
    phone: '+44 7700 900123',
    service: 'Laser Teeth Whitening (In-Office)',
    doctor: 'Dr. Leyla Mammadova',
    date: '2026-11-09',
    time: '09:00',
    duration: 60,
    status: 'confirmed',
    depositStatus: 'paid',
    depositAmount: 50,
    notes: 'Həssas diş mina təbəqəsi; zərif rejim tətbiqi xahiş olunur.',
    medicalIntake: {
      anxietyLevel: 'mild',
      sedationRequested: false,
      allergies: ['Penicillin'],
      medicalConditions: ['None'],
      currentMedications: 'None',
      emergencyContact: 'David Richardson (+44 7700 900555) - Spouse',
      signatureName: 'Emma Richardson',
      submittedAt: '2026-11-08T10:00:00Z',
    },
  },
  'ZD-829105': {
    id: 'ZD-829105',
    patientName: 'Oliver Vance',
    email: 'oliver.vance@company.com',
    phone: '+44 7700 900456',
    service: 'Dental Implant Consultation & 3D CBCT',
    doctor: 'Dr. Rashad Aliyev',
    date: '2026-11-10',
    time: '10:00',
    duration: 60,
    status: 'confirmed',
    depositStatus: 'paid',
    depositAmount: 50,
  },
  'ZD-829106': {
    id: 'ZD-829106',
    patientName: 'Sophia Chen',
    email: 'sophia.chen@design.org',
    phone: '+44 7700 900789',
    service: 'Porcelain Veneer Smile Design',
    doctor: 'Dr. Leyla Mammadova',
    date: '2026-11-12',
    time: '11:45',
    duration: 45,
    status: 'confirmed',
    depositStatus: 'paid',
    depositAmount: 50,
    notes: 'Toy mərasimi öncəsi təbii rəng tonu (BL2/BL3) üzrə konsultasiya.',
  },
};

export const RESCHEDULE_OPTIONS = [
  { date: '2026-11-12', time: '10:30', day: 'Thursday, 12 Nov' },
  { date: '2026-11-13', time: '14:00', day: 'Friday, 13 Nov' },
  { date: '2026-11-16', time: '09:30', day: 'Monday, 16 Nov' },
  { date: '2026-11-17', time: '11:15', day: 'Tuesday, 17 Nov' },
];
