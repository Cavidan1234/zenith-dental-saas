/**
 * Deterministic UUIDs and Slug/ID Resolvers for Zenith Dental Studio.
 * Bridges string frontend IDs ('doc-leyla', 'srv-whitening', etc.)
 * with PostgreSQL UUID primary keys seamlessly.
 */

export const DETERMINISTIC_IDS = {
  tenant: '00000000-0000-4000-a000-000000000001',
  userLeyla: '00000000-0000-4000-a000-000000000002',
  userRashad: '00000000-0000-4000-a000-000000000003',
  doctorLeyla: '11111111-1111-4111-a111-111111111111', // 'doc-leyla'
  doctorRashad: '22222222-2222-4222-a222-222222222222', // 'doc-rashad'
  serviceCheckup: '33333333-3333-4333-a333-333333333331', // 'srv-checkup' / 'srv-consult'
  serviceWhitening: '33333333-3333-4333-a333-333333333332', // 'srv-whitening'
  serviceVeneers: '33333333-3333-4333-a333-333333333333', // 'srv-veneers'
  serviceImplant: '33333333-3333-4333-a333-333333333334', // 'srv-implant'
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(val: string): boolean {
  return UUID_REGEX.test(val);
}

export function resolveStaffId(rawIdOrSlug?: string | null): string {
  if (!rawIdOrSlug) return DETERMINISTIC_IDS.doctorLeyla;
  const s = rawIdOrSlug.toLowerCase().trim();
  if (s === 'doc-leyla' || s.includes('leyla')) return DETERMINISTIC_IDS.doctorLeyla;
  if (s === 'doc-rashad' || s.includes('rashad')) return DETERMINISTIC_IDS.doctorRashad;
  if (isUuid(s)) return s;
  return DETERMINISTIC_IDS.doctorLeyla;
}

export function resolveStaffSlug(idOrTitle?: string | null): string {
  if (!idOrTitle) return 'doc-leyla';
  const s = idOrTitle.toLowerCase().trim();
  if (s === DETERMINISTIC_IDS.doctorRashad || s.includes('rashad')) return 'doc-rashad';
  return 'doc-leyla';
}

export function resolveStaffName(idOrSlug?: string | null): string {
  if (!idOrSlug) return 'Dr. Leyla Mammadova';
  const s = idOrSlug.toLowerCase().trim();
  if (s === DETERMINISTIC_IDS.doctorRashad || s === 'doc-rashad' || s.includes('rashad')) {
    return 'Dr. Rashad Aliyev';
  }
  return 'Dr. Leyla Mammadova';
}

export function resolveServiceId(rawIdOrSlug?: string | null): string {
  if (!rawIdOrSlug) return DETERMINISTIC_IDS.serviceCheckup;
  const s = rawIdOrSlug.toLowerCase().trim();
  if (
    s === 'srv-checkup' ||
    s === 'srv-consult' ||
    s.includes('checkup') ||
    s.includes('exam') ||
    s.includes('consult') ||
    s.includes('prophylaxis')
  ) {
    return DETERMINISTIC_IDS.serviceCheckup;
  }
  if (s === 'srv-whitening' || s.includes('whitening') || s.includes('laser')) {
    return DETERMINISTIC_IDS.serviceWhitening;
  }
  if (s === 'srv-veneers' || s.includes('veneer')) {
    return DETERMINISTIC_IDS.serviceVeneers;
  }
  if (s === 'srv-implant' || s.includes('implant') || s.includes('cbct') || s.includes('surgery')) {
    return DETERMINISTIC_IDS.serviceImplant;
  }
  if (isUuid(s)) return s;
  return DETERMINISTIC_IDS.serviceCheckup;
}

export function resolveServiceSlug(idOrName?: string | null): string {
  if (!idOrName) return 'srv-checkup';
  const s = idOrName.toLowerCase().trim();
  if (s === DETERMINISTIC_IDS.serviceWhitening || s.includes('whitening')) return 'srv-whitening';
  if (s === DETERMINISTIC_IDS.serviceVeneers || s.includes('veneer')) return 'srv-veneers';
  if (s === DETERMINISTIC_IDS.serviceImplant || s.includes('implant')) return 'srv-implant';
  return 'srv-checkup';
}

export function resolveServiceName(idOrSlug?: string | null): string {
  if (!idOrSlug) return 'Comprehensive Dental Exam & 3D Scan';
  const s = idOrSlug.toLowerCase().trim();
  if (s === DETERMINISTIC_IDS.serviceWhitening || s === 'srv-whitening' || s.includes('whitening')) {
    return 'Laser Teeth Whitening (In-Office)';
  }
  if (s === DETERMINISTIC_IDS.serviceVeneers || s === 'srv-veneers' || s.includes('veneer')) {
    return 'Porcelain Veneer Smile Design Consultation';
  }
  if (s === DETERMINISTIC_IDS.serviceImplant || s === 'srv-implant' || s.includes('implant')) {
    return 'Dental Implant Consultation & 3D CBCT Scan';
  }
  return 'Comprehensive Dental Exam & 3D Scan';
}
