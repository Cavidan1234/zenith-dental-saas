export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  bufferMinutes: number;
  priceCents: number;
  depositCents: number;
  description: string;
}

export interface DoctorItem {
  id: string;
  name: string;
  title: string;
  specialization: string;
  avatarUrl: string;
}

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

export const SERVICE_ID_ALIASES: Record<string, string> = {
  'srv-checkup': 'srv-consult',
};

export function formatLocalYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
