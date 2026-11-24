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
