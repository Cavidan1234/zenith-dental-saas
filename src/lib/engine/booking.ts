import crypto from 'crypto';
import { and, eq, ne, or, sql, lt, gt } from 'drizzle-orm';
import { db as defaultDb } from '../db';
import { bookings, services, staff, type Booking, type NewBooking } from '../db/schema';
import { resolveStaffId, resolveServiceId } from '../db/constants';

/**
 * Unpaid pending bookings older than this TTL no longer hold an appointment slot.
 */
export const PENDING_BOOKING_TTL_MINUTES = 15;

const MAX_BOOKING_CODE_RETRIES = 5;

/**
 * Generates a cryptographically random booking confirmation code (e.g. "ZD-A3F91C04B2").
 */
export function generateBookingCode(): string {
  return `ZD-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
}

/**
 * Determines whether a booking is an expired unpaid pending reservation past TTL.
 */
export function isPendingBookingExpired(
  booking: {
    status?: string | null;
    paymentStatus?: string | null;
    createdAt?: Date | string | null;
  },
  referenceNow: Date = new Date()
): boolean {
  if (booking.status !== 'pending' || booking.paymentStatus !== 'unpaid') {
    return false;
  }
  if (!booking.createdAt) {
    return false;
  }
  const createdAtMs = new Date(booking.createdAt).getTime();
  if (isNaN(createdAtMs)) {
    return false;
  }
  return referenceNow.getTime() - createdAtMs >= PENDING_BOOKING_TTL_MINUTES * 60 * 1000;
}

class BookingCodeCollisionError extends Error {
  constructor(code: string) {
    super(`Booking code collision detected for ${code}`);
    this.name = 'BookingCodeCollisionError';
  }
}

function isUniqueViolationError(err: unknown): boolean {
  if (!err || typeof err !== 'object') {
    return false;
  }
  const e = err as {
    code?: unknown;
    constraint?: unknown;
    cause?: { code?: unknown; constraint?: unknown };
    message?: unknown;
  };
  const code = e.code ?? e.cause?.code;
  const constraint = String(e.constraint ?? e.cause?.constraint ?? '').toLowerCase();
  if (code === '23505') {
    return !constraint || constraint.includes('booking_code') || constraint.includes('bookings_code');
  }
  const msg = String(e.message || '').toLowerCase();
  return msg.includes('23505') || msg.includes('duplicate key value') || msg.includes('unique constraint');
}

export class BookingConflictError extends Error {
  readonly statusCode: number = 409;

  constructor(message = '409 Conflict: Slot already reserved') {
    super(message);
    this.name = 'BookingConflictError';
  }
}

export interface CreateBookingWithLockParams {
  tenantId: string;
  staffId: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  startTime: Date | string;
  endTime?: Date | string;
  notes?: string | null;
  internalNotes?: string | null;
  bookingCode?: string | null;
  stripePaymentIntentId?: string | null;
  paymentMethod?: string | null;
  paymentLabel?: string | null;
  depositAmountCents?: number | null;
  paymentStatus?: 'unpaid' | 'deposit_paid' | 'fully_paid' | 'refunded';
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'in_surgery';
  db?: any;
  bufferMinutes?: number;
  bypassProcessMutex?: boolean;
}

export interface CheckSlotConflictParams {
  tx: any;
  tenantId: string;
  staffId: string;
  startDate: Date;
  endDate: Date;
  bufferMinutes: number;
  excludeBookingId?: string;
}

/**
 * Acquires a row-level lock on the staff record (`SELECT ... FOR UPDATE`)
 * and verifies that no active (or unexpired pending) booking overlaps the requested window + sterilization buffer.
 */
export async function lockStaffAndCheckSlotConflict(
  params: CheckSlotConflictParams
): Promise<void> {
  const { tx, tenantId, staffId, startDate, endDate, bufferMinutes, excludeBookingId } = params;

  await tx.execute(sql`SELECT id FROM staff WHERE id = ${staffId} FOR UPDATE`);

  const now = new Date();
  const pendingCutoff = new Date(now.getTime() - PENDING_BOOKING_TTL_MINUTES * 60 * 1000);
  const requestedStartMs = startDate.getTime();
  const requestedEffectiveEndMs = endDate.getTime() + bufferMinutes * 60 * 1000;
  const requestedEffectiveEnd = new Date(requestedEffectiveEndMs);
  const searchFloor = new Date(requestedStartMs - 24 * 60 * 60 * 1000);

  const candidateBookings = await tx.query.bookings.findMany({
    where: and(
      eq(bookings.staffId, staffId),
      eq(bookings.tenantId, tenantId),
      ne(bookings.status, 'cancelled'),
      lt(bookings.startTime, requestedEffectiveEnd),
      gt(bookings.endTime, searchFloor),
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

  const existingConflicting = candidateBookings.filter((b: any) => {
    if (excludeBookingId && b.id === excludeBookingId) {
      return false;
    }
    if (isPendingBookingExpired(b, now)) {
      return false;
    }
    const existingStartMs = new Date(b.startTime).getTime();
    const existingEndMs = new Date(b.endTime).getTime();
    const existingBufferMinutes = b.service?.bufferMinutes ?? bufferMinutes;
    const existingEffectiveEndMs = existingEndMs + existingBufferMinutes * 60 * 1000;
    return existingStartMs < requestedEffectiveEndMs && existingEffectiveEndMs > requestedStartMs;
  });

  if (existingConflicting.length > 0) {
    throw new BookingConflictError('409 Conflict: Slot already reserved or within sterilization buffer');
  }
}

/**
 * Keyed FIFO Async Mutex:
 * Serializes parallel promises per staffId within the Node process,
 * ensuring clean queue execution and preventing connection pool starvation,
 * while the underlying database transaction enforces row-level locks
 * (SELECT ... FOR UPDATE) across processes.
 */
class StaffLockQueue {
  private queues = new Map<string, Promise<any>>();

  async runExclusive<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const previous = this.queues.get(key) || Promise.resolve();
    let resolveCurrent!: () => void;
    const current = new Promise<void>((resolve) => {
      resolveCurrent = resolve;
    });

    this.queues.set(key, current);

    // Wait for prior operations on this staff to settle
    await previous.catch(() => {});

    try {
      return await fn();
    } finally {
      resolveCurrent();
      if (this.queues.get(key) === current) {
        this.queues.delete(key);
      }
    }
  }
}

const staffLock = new StaffLockQueue();

/**
 * Concurrency-Safe Booking Creator:
 * 1. Acquires a lock on the doctor's schedule.
 * 2. Starts an atomic transaction with `SELECT ... FOR UPDATE` on the staff record.
 * 3. Verifies staff exists and is active.
 * 4. Resolves service duration & end time if not specified.
 * 5. Queries for any overlapping non-cancelled bookings.
 * 6. If an overlap is detected, aborts transaction and raises 409 Conflict.
 * 7. If slot is free, inserts booking atomically and returns created record.
 */
export async function createBookingWithConcurrencyLock(
  params: CreateBookingWithLockParams
): Promise<Booking> {
  const {
    tenantId,
    customerName,
    customerEmail,
    customerPhone = null,
    notes = null,
    internalNotes = null,
    stripePaymentIntentId = null,
    paymentStatus = 'unpaid',
    status = 'pending',
    paymentMethod = null,
    paymentLabel = null,
    depositAmountCents = null,
    db = defaultDb,
    bypassProcessMutex = false,
  } = params;

  const staffId = resolveStaffId(params.staffId);
  const serviceId = resolveServiceId(params.serviceId);

  const startDate = new Date(params.startTime);
  if (isNaN(startDate.getTime())) {
    throw new Error('Invalid startTime provided');
  }

  const runInLock = async (): Promise<Booking> => {
    let activeBookingCode = params.bookingCode?.trim() || generateBookingCode();

    for (let attempt = 0; attempt < MAX_BOOKING_CODE_RETRIES; attempt++) {
      try {
        return await db.transaction(async (tx: any) => {
          // 1. Database-level row lock on the staff record
          // Let DB errors propagate cleanly so the transaction rolls back instead of entering 25P02 aborted state.
          await tx.execute(sql`SELECT id FROM staff WHERE id = ${staffId} FOR UPDATE`);

          // 2. Verify staff exists and is active
          const staffMember = await tx.query.staff.findFirst({
            where: and(eq(staff.id, staffId), eq(staff.tenantId, tenantId)),
          });

          if (!staffMember) {
            throw new Error(`Staff member with ID ${staffId} not found`);
          }
          if (!staffMember.isActive) {
            throw new Error(`Staff member with ID ${staffId} is currently inactive`);
          }

          // 3. Resolve service duration & calculate endTime if not provided
          const serviceRecord = await tx.query.services.findFirst({
            where: and(eq(services.id, serviceId), eq(services.tenantId, tenantId)),
          });

          if (!serviceRecord) {
            throw new Error(`Service with ID ${serviceId} not found`);
          }

          const durationMinutes = serviceRecord.durationMinutes ?? 45;
          const bufferMinutes = params.bufferMinutes ?? serviceRecord.bufferMinutes ?? 15;

          const endDate = params.endTime
            ? new Date(params.endTime)
            : new Date(startDate.getTime() + durationMinutes * 60 * 1000);

          if (isNaN(endDate.getTime()) || endDate <= startDate) {
            throw new Error('Invalid endTime: must be greater than startTime');
          }

          // 4. Overlap Check (enforcing sterilization buffers & expiring unpaid pending holds past TTL)
          await lockStaffAndCheckSlotConflict({
            tx,
            tenantId,
            staffId,
            startDate,
            endDate,
            bufferMinutes,
          });

          // Guard against bookingCode collisions even when DB lacks a UNIQUE constraint on booking_code
          if (typeof tx.query?.bookings?.findFirst === 'function') {
            const existingCode = await tx.query.bookings.findFirst({
              columns: { id: true },
              where: eq(bookings.bookingCode, activeBookingCode),
            });
            if (existingCode) {
              throw new BookingCodeCollisionError(activeBookingCode);
            }
          }

          // 5. Insert new booking atomically
          const defaultDeposit = paymentStatus === 'deposit_paid' ? (serviceRecord.depositCents ?? 2500) : 0;
          const newBookingData: NewBooking = {
            tenantId,
            staffId,
            serviceId,
            bookingCode: activeBookingCode,
            customerName,
            customerEmail,
            customerPhone,
            startTime: startDate,
            endTime: endDate,
            status,
            stripePaymentIntentId,
            paymentStatus,
            paymentMethod,
            paymentLabel,
            depositAmountCents: depositAmountCents ?? defaultDeposit,
            notes,
            internalNotes,
          };

          const [inserted] = await tx.insert(bookings).values(newBookingData).returning();

          return inserted;
        });
      } catch (err) {
        const shouldRetry =
          (err instanceof BookingCodeCollisionError || isUniqueViolationError(err)) &&
          attempt < MAX_BOOKING_CODE_RETRIES - 1;
        if (shouldRetry) {
          activeBookingCode = generateBookingCode();
          continue;
        }
        throw err;
      }
    }

    throw new Error('Failed to generate a unique bookingCode after retries');
  };

  return bypassProcessMutex ? runInLock() : staffLock.runExclusive(staffId, runInLock);
}
