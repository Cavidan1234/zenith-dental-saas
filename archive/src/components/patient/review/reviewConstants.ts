export interface ReviewBooking {
  id: string;
  patientName: string;
  service: string;
  doctor: string;
  date: string;
}

export const DEFAULT_BOOKINGS: Record<string, ReviewBooking> = {
  'ZD-829104': {
    id: 'ZD-829104',
    patientName: 'Emma Richardson',
    service: 'Laser Teeth Whitening (In-Office)',
    doctor: 'Dr. Leyla Mammadova',
    date: '2026-11-09',
  },
  'ZD-829105': {
    id: 'ZD-829105',
    patientName: 'Oliver Vance',
    service: 'Dental Implant Consultation & 3D CBCT',
    doctor: 'Dr. Rashad Aliyev',
    date: '2026-11-10',
  },
  'ZD-829106': {
    id: 'ZD-829106',
    patientName: 'Sophia Chen',
    service: 'Porcelain Veneer Smile Design',
    doctor: 'Dr. Leyla Mammadova',
    date: '2026-11-12',
  },
};

export const HIGHLIGHT_TAGS = [
  'Painless & Gentle',
  'Zero Wait Time',
  'Instant Shade Lift',
  'Luxury Harley St Ambiance',
  'Clear Medical Explanation',
  'Attentive Reception Team',
  'High-Tech 3D Imaging',
  'Felt In Safe Hands',
];
