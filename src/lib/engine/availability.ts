import { and, eq, gt, lt, ne, or } from 'drizzle-orm';
import { db as defaultDb } from '../db';
import { bookings, services, staffSchedules, staff, tenants } from '../db/schema';
import { resolveStaffId, resolveServiceId } from '../db/constants';
import { PENDING_BOOKING_TTL_MINUTES, isPendingBookingExpired } from './booking';

export const DEFAULT_CLINIC_TIMEZONE = 'Asia/Baku';

export interface CalculateAvailableSlotsParams {
  tenantId: string;
  staffId: string;
  serviceId: string;
  date: string | Date; // 'YYYY-MM-DD' or Date object
  timezone?: string;   // Optional override; defaults to tenant.timezone || 'Asia/Baku'
  db?: any;
  includeUnavailable?: boolean; // If true, include unavailable slots marked isAvailable: false
  stepMinutes?: number;         // Step between candidate slot starts. Defaults to durationMinutes + bufferMinutes
}

export interface AvailableSlot {
  startTime: string; // ISO 8601 in clinic timezone (e.g. '2026-11-05T09:00:00.000+04:00')
  endTime: string;   // ISO 8601 in clinic timezone (e.g. '2026-11-05T09:45:00.000+04:00')
  isAvailable: boolean;
  reason?: string;
}

export interface ZonedDateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  dayOfWeek: number;
  dateStr: string;
  timeStr: string;
}

interface WorkingInterval {
  start: Date;
  end: Date;
}

const dtfCache = new Map<string, Intl.DateTimeFormat>();

export function resolveClinicTimeZone(timeZone?: string | null): string {
  const candidate = timeZone?.trim() || DEFAULT_CLINIC_TIMEZONE;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: candidate });
    return candidate;
  } catch {
    return DEFAULT_CLINIC_TIMEZONE;
  }
}

function getTimeZoneFormatter(timeZone: string): Intl.DateTimeFormat {
  let fmt = dtfCache.get(timeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    });
    dtfCache.set(timeZone, fmt);
  }
  return fmt;
}

/**
 * Extracts calendar and wall-clock components for an instant in the given IANA timezone,
 * completely independent of the Node process local timezone.
 */
export function getZonedParts(date: Date, timeZone: string = DEFAULT_CLINIC_TIMEZONE): ZonedDateParts {
  const tz = resolveClinicTimeZone(timeZone);
  const parts = getTimeZoneFormatter(tz).formatToParts(date);
  const lookup: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      lookup[part.type] = part.value;
    }
  }
  const year = Number(lookup.year);
  const month = Number(lookup.month);
  const day = Number(lookup.day);
  const hour = Number(lookup.hour) % 24;
  const minute = Number(lookup.minute);
  const second = Number(lookup.second);
  const dayOfWeek = new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).getUTCDay();
  const dateStr = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  return { year, month, day, hour, minute, second, dayOfWeek, dateStr, timeStr };
}

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const p = getZonedParts(date, timeZone);
  const zonedAsUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second, 0);
  const truncatedUtc = Math.floor(date.getTime() / 1000) * 1000;
  return zonedAsUtc - truncatedUtc;
}

/**
 * Converts a clinic-local wall-clock date/time into the exact UTC Date instant.
 */
export function zonedDateTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second = 0,
  ms = 0,
  timeZone: string = DEFAULT_CLINIC_TIMEZONE
): Date {
  const tz = resolveClinicTimeZone(timeZone);
  const utcGuessMs = Date.UTC(year, month - 1, day, hour, minute, second, 0);
  const offset1 = getTimeZoneOffsetMs(new Date(utcGuessMs), tz);
  let targetMs = utcGuessMs - offset1;
  const offset2 = getTimeZoneOffsetMs(new Date(targetMs), tz);
  if (offset2 !== offset1) {
    targetMs = utcGuessMs - offset2;
  }
  return new Date(targetMs + ms);
}

/**
 * Formats a UTC Date as an ISO 8601 string with the clinic timezone offset.
 */
export function formatDateInTimeZoneIso(
  date: Date,
  timeZone: string = DEFAULT_CLINIC_TIMEZONE
): string {
  const tz = resolveClinicTimeZone(timeZone);
  const p = getZonedParts(date, tz);
  const ms = String(date.getUTCMilliseconds()).padStart(3, '0');
  const offsetMinutes = Math.round(getTimeZoneOffsetMs(date, tz) / 60000);
  if (offsetMinutes === 0) {
    return `${p.dateStr}T${p.timeStr}:${String(p.second).padStart(2, '0')}.${ms}Z`;
  }
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absMins = Math.abs(offsetMinutes);
  const offH = String(Math.floor(absMins / 60)).padStart(2, '0');
  const offM = String(absMins % 60).padStart(2, '0');
  return `${p.dateStr}T${p.timeStr}:${String(p.second).padStart(2, '0')}.${ms}${sign}${offH}:${offM}`;
}

function isValidCalendarYmd(year: number, month: number, day: number): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }
  const check = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return (
    !isNaN(check.getTime()) &&
    check.getUTCFullYear() === year &&
    check.getUTCMonth() === month - 1 &&
    check.getUTCDate() === day
  );
}

/**
 * Parses either (date + time) or a startTime string (offset-less strings interpreted in clinic timezone)
 * into a UTC Date plus clinic-local calendar date/time components.
 */
export function parseClinicDateTimeInput(
  input: { date?: string; time?: string; startTime?: string },
  timeZone: string = DEFAULT_CLINIC_TIMEZONE
): {
  utcDate: Date;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  dayOfWeek: number;
  dateStr: string;
  timeStr: string;
} | null {
  const tz = resolveClinicTimeZone(timeZone);

  if (input.date && input.time) {
    const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.date.trim());
    const timeMatch = /^(\d{2}):(\d{2})$/.exec(input.time.trim());
    if (!dateMatch || !timeMatch) {
      return null;
    }
    const year = Number(dateMatch[1]);
    const month = Number(dateMatch[2]);
    const day = Number(dateMatch[3]);
    const hour = Number(timeMatch[1]);
    const minute = Number(timeMatch[2]);

    if (!isValidCalendarYmd(year, month, day) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return null;
    }

    const utcDate = zonedDateTimeToUtc(year, month, day, hour, minute, 0, 0, tz);
    const roundTrip = getZonedParts(utcDate, tz);
    if (
      roundTrip.year !== year ||
      roundTrip.month !== month ||
      roundTrip.day !== day ||
      roundTrip.hour !== hour ||
      roundTrip.minute !== minute
    ) {
      return null;
    }

    if (input.startTime) {
      const parsedStart = parseClinicDateTimeInput({ startTime: input.startTime }, tz);
      if (!parsedStart || parsedStart.utcDate.getTime() !== utcDate.getTime()) {
        return null;
      }
    }

    return {
      utcDate,
      year,
      month,
      day,
      hour,
      minute,
      dayOfWeek: roundTrip.dayOfWeek,
      dateStr: roundTrip.dateStr,
      timeStr: roundTrip.timeStr,
    };
  }

  if (input.startTime) {
    const raw = input.startTime.trim();
    const hasExplicitOffset = /(Z|[+-]\d{2}:?\d{2})$/i.test(raw);
    if (hasExplicitOffset) {
      const parsed = new Date(raw);
      if (isNaN(parsed.getTime())) {
        return null;
      }
      const p = getZonedParts(parsed, tz);
      return {
        utcDate: parsed,
        year: p.year,
        month: p.month,
        day: p.day,
        hour: p.hour,
        minute: p.minute,
        dayOfWeek: p.dayOfWeek,
        dateStr: p.dateStr,
        timeStr: p.timeStr,
      };
    }

    const naiveMatch = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(raw);
    if (!naiveMatch) {
      return null;
    }
    const year = Number(naiveMatch[1]);
    const month = Number(naiveMatch[2]);
    const day = Number(naiveMatch[3]);
    const hour = Number(naiveMatch[4]);
    const minute = Number(naiveMatch[5]);
    const second = naiveMatch[6] ? Number(naiveMatch[6]) : 0;
    const ms = naiveMatch[7] ? Number(naiveMatch[7].padEnd(3, '0')) : 0;

    if (
      !isValidCalendarYmd(year, month, day) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59 ||
      second < 0 ||
      second > 59
    ) {
      return null;
    }

    const utcDate = zonedDateTimeToUtc(year, month, day, hour, minute, second, ms, tz);
    const roundTrip = getZonedParts(utcDate, tz);
    if (
      roundTrip.year !== year ||
      roundTrip.month !== month ||
      roundTrip.day !== day ||
      roundTrip.hour !== hour ||
      roundTrip.minute !== minute
    ) {
      return null;
    }

    return {
      utcDate,
      year,
      month,
      day,
      hour,
      minute,
      dayOfWeek: roundTrip.dayOfWeek,
      dateStr: roundTrip.dateStr,
      timeStr: roundTrip.timeStr,
    };
  }

  return null;
}

/**
 * Parses a date input into year, month, day components reliably in the clinic timezone.
 */
function parseDateParts(
  dateInput: string | Date,
  timeZone: string
): { year: number; month: number; day: number; dayOfWeek: number } {
  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
    if (dateOnlyMatch) {
      const year = parseInt(dateOnlyMatch[1], 10);
      const month = parseInt(dateOnlyMatch[2], 10);
      const day = parseInt(dateOnlyMatch[3], 10);
      if (!isValidCalendarYmd(year, month, day)) {
        throw new Error(`Invalid date provided: ${dateInput}`);
      }
      const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
      return { year, month, day, dayOfWeek: d.getUTCDay() };
    }

    const naiveMatch = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(trimmed);
    if (naiveMatch && !/(Z|[+-]\d{2}:?\d{2})$/i.test(trimmed)) {
      const year = parseInt(naiveMatch[1], 10);
      const month = parseInt(naiveMatch[2], 10);
      const day = parseInt(naiveMatch[3], 10);
      if (!isValidCalendarYmd(year, month, day)) {
        throw new Error(`Invalid date provided: ${dateInput}`);
      }
      const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
      return { year, month, day, dayOfWeek: d.getUTCDay() };
    }
  }

  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date provided: ${String(dateInput)}`);
  }
  const p = getZonedParts(d, timeZone);
  return {
    year: p.year,
    month: p.month,
    day: p.day,
    dayOfWeek: p.dayOfWeek,
  };
}

/**
 * Converts "HH:MM" string on a given clinic-local date to a UTC Date object.
 */
function timeStringToDate(
  year: number,
  month: number,
  day: number,
  timeStr: string,
  timeZone: string
): Date {
  const [hours, minutes] = timeStr.split(':').map((v) => parseInt(v, 10));
  return zonedDateTimeToUtc(year, month, day, hours, minutes, 0, 0, timeZone);
}

/**
 * Calculates available booking slots for a given staff, service, and date.
 * Accurately accounts for clinic timezone, staff working hours, lunch breaks,
 * active (non-expired) bookings, and service buffer (sanitization/turnaround) times.
 */
export async function calculateAvailableSlots(
  params: CalculateAvailableSlotsParams
): Promise<AvailableSlot[]> {
  const {
    tenantId,
    date,
    db = defaultDb,
    includeUnavailable = false,
  } = params;

  const staffId = resolveStaffId(params.staffId);
  const serviceId = resolveServiceId(params.serviceId);

  let clinicTimeZone = params.timezone;
  if (!clinicTimeZone && typeof db.query?.tenants?.findFirst === 'function') {
    const tenantRecord = await db.query.tenants.findFirst({
      where: eq(tenants.id, tenantId),
    });
    clinicTimeZone = tenantRecord?.timezone || undefined;
  }
  clinicTimeZone = resolveClinicTimeZone(clinicTimeZone);

  const { year, month, day, dayOfWeek } = parseDateParts(date, clinicTimeZone);

  // 1. Check if staff exists and is active
  const staffMember = await db.query.staff.findFirst({
    where: and(eq(staff.id, staffId), eq(staff.tenantId, tenantId)),
  });

  if (!staffMember || !staffMember.isActive) {
    return [];
  }

  // 2. Fetch staff schedule for this day of week
  const schedule = await db.query.staffSchedules.findFirst({
    where: and(
      eq(staffSchedules.staffId, staffId),
      eq(staffSchedules.dayOfWeek, dayOfWeek),
      eq(staffSchedules.isActive, true)
    ),
  });

  if (!schedule) {
    // Staff does not work on this day
    return [];
  }

  // 3. Fetch service details (duration & buffer)
  const service = await db.query.services.findFirst({
    where: and(
      eq(services.id, serviceId),
      eq(services.tenantId, tenantId),
      eq(services.isActive, true)
    ),
  });

  if (!service) {
    throw new Error(`Service with ID ${serviceId} not found or inactive`);
  }

  const durationMinutes = service.durationMinutes ?? 45;
  const bufferMinutes = service.bufferMinutes ?? 15;
  const stepMinutes = params.stepMinutes ?? (durationMinutes + bufferMinutes);

  // 4. Compute working intervals in clinic timezone: [Work Start, Break Start] & [Break End, Work End]
  const intervals: WorkingInterval[] = [];

  const workStart = timeStringToDate(year, month, day, schedule.startTime, clinicTimeZone);
  const workEnd = timeStringToDate(year, month, day, schedule.endTime, clinicTimeZone);

  if (schedule.breakStart && schedule.breakEnd) {
    const breakStart = timeStringToDate(year, month, day, schedule.breakStart, clinicTimeZone);
    const breakEnd = timeStringToDate(year, month, day, schedule.breakEnd, clinicTimeZone);

    if (breakStart > workStart) {
      intervals.push({ start: workStart, end: breakStart });
    }
    if (workEnd > breakEnd) {
      intervals.push({ start: breakEnd, end: workEnd });
    }
  } else {
    intervals.push({ start: workStart, end: workEnd });
  }

  // 5. Fetch existing active bookings for this staff overlapping this clinic day
  const dayStart = zonedDateTimeToUtc(year, month, day, 0, 0, 0, 0, clinicTimeZone);
  const dayEnd = zonedDateTimeToUtc(year, month, day, 23, 59, 59, 999, clinicTimeZone);
  const now = new Date();
  const pendingCutoff = new Date(now.getTime() - PENDING_BOOKING_TTL_MINUTES * 60 * 1000);

  const existingBookings = await db.query.bookings.findMany({
    where: and(
      eq(bookings.staffId, staffId),
      eq(bookings.tenantId, tenantId),
      ne(bookings.status, 'cancelled'),
      lt(bookings.startTime, dayEnd),
      gt(bookings.endTime, new Date(dayStart.getTime() - 24 * 60 * 60 * 1000)),
      or(
        ne(bookings.status, 'pending'),
        ne(bookings.paymentStatus, 'unpaid'),
        gt(bookings.createdAt, pendingCutoff)
      )
    ),
    with: {
      service: true,
    },
  });

  // Map active (non-expired) bookings to their effective busy windows (including buffer)
  const busyWindows = existingBookings
    .filter((b: any) => !isPendingBookingExpired(b, now))
    .map((b: any) => {
      const bookingStart = new Date(b.startTime).getTime();
      const bookingEnd = new Date(b.endTime).getTime();
      const existingBuffer = (b.service?.bufferMinutes ?? bufferMinutes) * 60 * 1000;
      return {
        start: bookingStart,
        end: bookingEnd,
        effectiveEnd: bookingEnd + existingBuffer,
      };
    });

  // 6. Generate candidate slots
  const allSlots: AvailableSlot[] = [];

  const durationMs = durationMinutes * 60 * 1000;
  const bufferMs = bufferMinutes * 60 * 1000;
  const stepMs = stepMinutes * 60 * 1000;

  for (const interval of intervals) {
    let currentStartMs = interval.start.getTime();
    const intervalEndMs = interval.end.getTime();

    while (currentStartMs + durationMs <= intervalEndMs) {
      const slotStartMs = currentStartMs;
      const slotEndMs = slotStartMs + durationMs;
      const slotEffectiveEndMs = slotEndMs + bufferMs;

      // Check if slot overlaps with any existing booking or its buffer
      let isAvailable = true;
      let conflictReason: string | undefined = undefined;

      for (const busy of busyWindows) {
        const overlaps = slotStartMs < busy.effectiveEnd && slotEffectiveEndMs > busy.start;

        if (overlaps) {
          isAvailable = false;
          conflictReason = 'Existing booking overlap or sanitization buffer conflict';
          break;
        }
      }

      const slot: AvailableSlot = {
        startTime: formatDateInTimeZoneIso(new Date(slotStartMs), clinicTimeZone),
        endTime: formatDateInTimeZoneIso(new Date(slotEndMs), clinicTimeZone),
        isAvailable,
        ...(conflictReason && { reason: conflictReason }),
      };

      if (isAvailable || includeUnavailable) {
        allSlots.push(slot);
      }

      currentStartMs += stepMs;
    }
  }

  return allSlots;
}
