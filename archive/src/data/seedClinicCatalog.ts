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
