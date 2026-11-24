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

import { BookingRecord } from '@/components/admin/PatientDossierDrawer';

export const DEFAULT_SEED_BOOKINGS: BookingRecord[] = [
  {
    id: 'ZD-829104',
    patientName: 'Arthur Pendelton',
    email: 'a.pendelton@gmail.com',
    phone: '+44 7891 112233',
    service: 'Porcelain Veneer Smile Design',
    doctor: 'Dr. Leyla Mammadova',
    date: '2026-11-20',
    time: '11:45',
    duration: 45,
    status: 'confirmed',
    depositStatus: 'paid',
    depositAmount: 50,
    paymentMethod: 'google_pay',
    paymentLabel: 'Google Pay (TEST Sandbox)',
    notes: 'Patient requested numbing gel ahead of time due to mild sensitivity.',
    internalNotes: 'Pre-op photographs taken. Gingival contouring scheduled.',
  },
  {
    id: 'ZD-829105',
    patientName: 'Victoria Sterling',
    email: 'v.sterling@luxury.co.uk',
    phone: '+44 7891 445566',
    service: 'Comprehensive 3D Scan & Hygiene',
    doctor: 'Dr. Rashad Aliyev',
    date: '2026-11-20',
    time: '14:00',
    duration: 45,
    status: 'in_surgery',
    depositStatus: 'paid',
    depositAmount: 50,
    paymentMethod: 'apple_pay',
    paymentLabel: 'Apple Pay (Biometric Touch)',
    notes: 'Executive patient arriving via Mayfair chauffeur. Prioritize room 2.',
    internalNotes: 'In-chair since 14:02. Cavitron ultrasonic clean underway.',
  },
  {
    id: 'ZD-829106',
    patientName: 'Oliver Vance',
    email: 'oliver.vance@tech.co.uk',
    phone: '+44 7891 667788',
    service: 'Guided Dental Implant Placement',
    doctor: 'Dr. Rashad Aliyev',
    date: '2026-11-20',
    time: '10:00',
    duration: 60,
    status: 'completed',
    depositStatus: 'paid',
    depositAmount: 50,
    paymentMethod: 'card',
    paymentLabel: 'Card (•••• 4242)',
    notes: 'Replacing lower left first molar (#36). Nobel Biocare titanium post.',
    internalNotes: 'Surgery concluded successfully. 35 Ncm primary stability achieved.',
  },
  {
    id: 'ZD-829107',
    patientName: 'Emma Richardson',
    email: 'emma.r@richardson.org',
    phone: '+44 7891 990011',
    service: 'In-Office Diode Laser Whitening',
    doctor: 'Dr. Leyla Mammadova',
    date: '2026-11-20',
    time: '09:00',
    duration: 60,
    status: 'completed',
    depositStatus: 'paid',
    depositAmount: 50,
    paymentMethod: 'card',
    paymentLabel: 'Card (•••• 4242)',
    notes: 'Wedding next Saturday. Desires maximum safe shade lifting.',
    internalNotes: 'Shade lifted from A3.5 to B1. Fluoride remineralization applied.',
  },
];

import { RecallRecord } from '@/components/admin/DashboardRecallTab';

export interface RecallPatientData {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  lastVisitDate: string;
  treatment: string;
  doctor: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  recommendedService: string;
  recommendedDuration: number;
}

export interface VipSlot {
  id: string;
  date: string;
  dayLabel: string;
  time: string;
  period: string;
}

export const DEFAULT_SEED_RECALLS: RecallRecord[] = [
  {
    id: 'rec-1',
    patientName: 'Arthur Pendelton',
    email: 'a.pendelton@gmail.com',
    phone: '+44 7891 112233',
    lastVisitDate: '2026-05-02',
    recallDueDate: '2026-11-02 (Due Today)',
    treatment: 'Porcelain Veneers Follow-up',
    doctor: 'Dr. Leyla Mammadova',
    status: 'Due Now',
    contacted: false,
  },
  {
    id: 'rec-2',
    patientName: 'Victoria Sterling',
    email: 'v.sterling@luxury.co.uk',
    phone: '+44 7891 445566',
    lastVisitDate: '2026-05-10',
    recallDueDate: '2026-11-10',
    treatment: 'Routine Prophylaxis & 3D Scan',
    doctor: 'Dr. Rashad Aliyev',
    status: 'Scheduled',
    contacted: true,
  },
  {
    id: 'rec-3',
    patientName: 'Marcus Aurel',
    email: 'marcus@aurel.io',
    phone: '+44 7891 778899',
    lastVisitDate: '2026-05-15',
    recallDueDate: '2026-11-15',
    treatment: 'Implant Screw Torque Check',
    doctor: 'Dr. Rashad Aliyev',
    status: 'Scheduled',
    contacted: false,
  },
];

export const KNOWN_RECALLS: Record<string, RecallPatientData> = {
  'zd_rec-1': {
    id: 'rec-1',
    patientName: 'Arthur Pendelton',
    email: 'a.pendelton@gmail.com',
    phone: '+44 7891 112233',
    lastVisitDate: '2 May 2026',
    treatment: 'Porcelain Veneers Follow-up & Polish',
    doctor: 'Dr. Leyla Mammadova',
    doctorSpecialty: 'Lead Aesthetic Ceramist & Smile Architect',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    recommendedService: 'Comprehensive 3D Exam & Prophylaxis',
    recommendedDuration: 45,
  },
  'zd_rec-2': {
    id: 'rec-2',
    patientName: 'Victoria Sterling',
    email: 'v.sterling@luxury.co.uk',
    phone: '+44 7891 445566',
    lastVisitDate: '10 May 2026',
    treatment: 'Routine Prophylaxis & 3D Scan',
    doctor: 'Dr. Rashad Aliyev',
    doctorSpecialty: 'Lead Implantologist & Reconstructive Surgeon',
    doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    recommendedService: 'Comprehensive 3D Exam & Prophylaxis',
    recommendedDuration: 45,
  },
  'zd_rec-3': {
    id: 'rec-3',
    patientName: 'Marcus Aurel',
    email: 'marcus@aurel.io',
    phone: '+44 7891 778899',
    lastVisitDate: '15 May 2026',
    treatment: 'Implant Screw Torque Check & Perio Scan',
    doctor: 'Dr. Rashad Aliyev',
    doctorSpecialty: 'Lead Implantologist & Reconstructive Surgeon',
    doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    recommendedService: 'Dental Implant Consultation & 3D CBCT',
    recommendedDuration: 60,
  },
};

export const DEFAULT_PATIENT: RecallPatientData = {
  id: 'rec-1',
  patientName: 'Arthur Pendelton',
  email: 'a.pendelton@gmail.com',
  phone: '+44 7891 112233',
  lastVisitDate: '2 May 2026',
  treatment: 'Porcelain Veneers Follow-up & Polish',
  doctor: 'Dr. Leyla Mammadova',
  doctorSpecialty: 'Lead Aesthetic Ceramist & Smile Architect',
  doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
  recommendedService: 'Comprehensive 3D Exam & Prophylaxis',
  recommendedDuration: 45,
};

export const VIP_SLOTS: VipSlot[] = [
  { id: 'slot-1', date: '2026-11-09', dayLabel: 'Monday, 9 Nov', time: '10:30', period: 'Morning VIP' },
  { id: 'slot-2', date: '2026-11-11', dayLabel: 'Wednesday, 11 Nov', time: '14:15', period: 'Afternoon Reserved' },
  { id: 'slot-3', date: '2026-11-14', dayLabel: 'Saturday, 14 Nov', time: '11:00', period: 'Weekend Priority' },
];

import { ServiceItem, DoctorItem } from '@/components/booking/steps/Step1ServiceDoctor';
import { ScheduleSlot } from '@/components/admin/DashboardCalendarTab';

export const DEFAULT_SCHEDULE_SLOTS: ScheduleSlot[] = [
  { time: '09:00', defaultLeyla: 'Emma Richardson · Whitening (60m)', defaultRashad: 'Available for Surgery', isPast: true },
  { time: '10:00', defaultLeyla: 'Sterilization Buffer (15m)', defaultRashad: 'Oliver Vance · Implant CBCT (60m)', isPast: true },
  { time: '11:00', defaultLeyla: 'Available Slot', defaultRashad: 'Sterilization Buffer (15m)', isCurrent: true },
  { time: '11:45', defaultLeyla: 'Sophia Chen · Veneer Consult (45m)', defaultRashad: 'Available Slot' },
  { time: '13:00', defaultLeyla: '— Clinic Lunch & Sterilization Break —', defaultRashad: '— Clinic Lunch & Sterilization Break —', isBreak: true },
  { time: '14:00', defaultLeyla: 'Available Slot', defaultRashad: 'James Montgomery · 3D Exam (45m)' },
  { time: '15:30', defaultLeyla: 'Available Slot', defaultRashad: 'Available Slot' },
  { time: '16:45', defaultLeyla: 'Available Slot', defaultRashad: 'Available Slot' },
];

export const CLINIC_SERVICES: ServiceItem[] = [
  {
    id: 'srv-consult',
    name: 'Comprehensive Dental Exam & 3D Scan',
    category: 'Preventive',
    durationMinutes: 45,
    bufferMinutes: 15,
    priceCents: 8000,
    depositCents: 2500,
    description: 'Digital intraoral 3D scan, periodontal health check, oral cancer screening, and custom treatment plan.',
  },
  {
    id: 'srv-whitening',
    name: 'Laser Teeth Whitening (In-Office)',
    category: 'Cosmetic',
    durationMinutes: 60,
    bufferMinutes: 15,
    priceCents: 25000,
    depositCents: 5000,
    description: 'Advanced blue-light diode laser activation. Up to 8 shades whiter with zero dentin sensitivity.',
  },
  {
    id: 'srv-veneers',
    name: 'Porcelain Veneer Smile Design Consultation',
    category: 'Aesthetic',
    durationMinutes: 45,
    bufferMinutes: 15,
    priceCents: 12000,
    depositCents: 3000,
    description: 'Digital Smile Design (DSD), facial harmony assessment, and ultra-thin ceramic veneer planning.',
  },
  {
    id: 'srv-implant',
    name: 'Dental Implant Consultation & 3D CBCT Scan',
    category: 'Surgical',
    durationMinutes: 60,
    bufferMinutes: 15,
    priceCents: 15000,
    depositCents: 5000,
    description: 'High-resolution bone scan, 3D computer-guided placement simulation, and implant roadmap.',
  },
];

export const CLINIC_DOCTORS: DoctorItem[] = [
  {
    id: 'doc-leyla',
    name: 'Dr. Leyla Mammadova',
    title: 'Lead Aesthetic Dentist & Orthodontist',
    specialization: 'Invisalign & Cosmetic Veneers · 12 Yrs Exp',
    avatarUrl: '/images/dental/doctor-leyla.jpg',
  },
  {
    id: 'doc-rashad',
    name: 'Dr. Rashad Aliyev',
    title: 'Oral & Maxillofacial Surgeon',
    specialization: 'Guided Implants & Bone Grafting · 14 Yrs Exp',
    avatarUrl: '/images/dental/doctor-rashad.jpg',
  },
];

export const INITIAL_BASE_SLOTS = [
  { time: '09:00', available: true },
  { time: '09:45', available: true },
  { time: '10:30', available: true },
  { time: '11:15', available: true },
  { time: '12:00', available: true },
  { time: '14:00', available: true },
  { time: '14:45', available: true },
  { time: '15:30', available: true },
  { time: '16:15', available: true },
  { time: '17:00', available: true },
];
