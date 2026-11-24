import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { and, eq, or, desc } from 'drizzle-orm';
import { db, ensureSeeded } from '@/lib/db';
import { bookings, services, staff, staffSchedules, tenants } from '@/lib/db/schema';
import {
  createBookingWithConcurrencyLock,
  BookingConflictError,
  generateBookingCode,
} from '@/lib/engine/booking';
import {
  calculateAvailableSlots,
  getZonedParts,
  parseClinicDateTimeInput,
  resolveClinicTimeZone,
  zonedDateTimeToUtc,
} from '@/lib/engine/availability';
import {
  resolveStaffId,
  resolveStaffName,
  resolveStaffSlug,
  resolveServiceId,
  resolveServiceName,
  resolveServiceSlug,
  isUuid,
  DETERMINISTIC_IDS,
} from '@/lib/db/constants';
import { sendBookingConfirmationEmail } from '@/lib/email/sender';
import { verifyEmailDomainCanReceiveMail } from '@/lib/security/emailDomainCheck';
import {
  checkRateLimit,
  createRateLimitResponse,
  BOOKING_POST_LIMIT,
} from '@/lib/security/rateLimiter';
import {
  sanitizeText,
  sanitizePatientName,
  sanitizeEmail,
} from '@/lib/security/sanitizer';
import { requireAuth, CLINICAL_STAFF_ROLES } from '@/lib/auth/guard';

export const dynamic = 'force-dynamic';

// SEC-09: Client-supplied depositAmount, status, paymentStatus, and internalNotes
// are omitted from the schema so Zod strips them and server policy enforces authoritative values.
const bookingPostSchema = z
  .object({
    tenantSlug: z.string().default('zenith-dental'),
    serviceId: z.string().min(1),
    staffId: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    startTime: z.string().min(1).optional(),
    customerName: z.string().min(1),
    customerEmail: z.string().email().optional().or(z.literal('')).nullable(),
    customerPhone: z.string().min(1),
    notes: z.string().optional().nullable(),
    paymentMethod: z.string().optional().nullable(),
    paymentLabel: z.string().optional().nullable(),
  })
  .refine((data) => Boolean((data.date && data.time) || data.startTime), {
    message: 'Either date and time or startTime must be provided.',
  });

const bookingPatchSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['pending', 'confirmed', 'in_surgery', 'completed', 'cancelled']).optional(),
  notes: z.string().optional().nullable(),
  internalNotes: z.string().optional().nullable(),
});

// ---------------------------------------------------------------------------
// GET /api/v1/bookings
// Queries real database bookings joined with staff and service entities.
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request, CLINICAL_STAFF_ROLES);
    if (!auth.authenticated) {
      return auth.response;
    }

    const sessionTenantId = auth.user.tenantId;
    if (!sessionTenantId) {
      return NextResponse.json({ error: 'Tenant context missing in session.' }, { status: 403 });
    }

    await ensureSeeded();

    const { searchParams } = new URL(request.url);
    const doctorFilter = searchParams.get('doctor');
    const dateFilter = searchParams.get('date');

    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, sessionTenantId),
    });
    const clinicTimeZone = resolveClinicTimeZone(tenant?.timezone);

    const rawBookings = await db.query.bookings.findMany({
      where: eq(bookings.tenantId, sessionTenantId),
      orderBy: [desc(bookings.startTime)],
      with: {
        staff: {
          with: {
            user: true,
          },
        },
        service: true,
      },
    });

    const formattedBookings = rawBookings.map((b: any) => {
      const startD = new Date(b.startTime);
      const endD = new Date(b.endTime);
      const startParts = getZonedParts(startD, clinicTimeZone);
      const date = startParts.dateStr;
      const time = startParts.timeStr;
      const duration =
        b.service?.durationMinutes ?? Math.max(15, Math.round((endD.getTime() - startD.getTime()) / 60000));

      const doctorName = b.staff?.user?.name || resolveStaffName(b.staffId);
      const doctorSlug = resolveStaffSlug(b.staffId);
      const serviceName = b.service?.name || resolveServiceName(b.serviceId);
      const serviceSlug = resolveServiceSlug(b.serviceId);

      const depositDollars =
        typeof b.depositAmountCents === 'number' && b.depositAmountCents > 0
          ? b.depositAmountCents / 100
          : typeof b.service?.depositCents === 'number'
          ? b.service.depositCents / 100
          : 50;

      return {
        id: b.bookingCode || b.id,
        dbId: b.id,
        bookingCode: b.bookingCode || b.id,
        patientName: b.customerName,
        email: b.customerEmail,
        phone: b.customerPhone || '',
        service: serviceName,
        serviceId: serviceSlug,
        doctor: doctorName,
        doctorId: doctorSlug,
        date,
        time,
        duration,
        status: b.status,
        depositStatus: b.paymentStatus === 'unpaid' ? 'unpaid' : 'paid',
        depositAmount: depositDollars,
        paymentMethod: b.paymentMethod || 'card',
        paymentLabel: b.paymentLabel || (b.paymentMethod === 'google_pay' ? 'Google Pay (TEST)' : 'Credit Card'),
        notes: b.notes || '',
        internalNotes: b.internalNotes || '',
        createdAt: b.createdAt ? new Date(b.createdAt).toISOString() : new Date().toISOString(),
      };
    });

    // Optional query filtering
    let filtered = formattedBookings;
    if (doctorFilter && doctorFilter !== 'all') {
      const targetSlug = resolveStaffSlug(doctorFilter);
      filtered = filtered.filter((b: any) => b.doctorId === targetSlug);
    }
    if (dateFilter) {
      filtered = filtered.filter((b: any) => b.date === dateFilter);
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      bookings: filtered,
    });
  } catch (error) {
    console.error('[GET /api/v1/bookings Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/v1/bookings
// Atomic, concurrency-safe booking insertion into PostgreSQL/PGlite.
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // Rate limit check: Anti-slot hoarding & denial-of-inventory defense
    const rateLimit = checkRateLimit(request, BOOKING_POST_LIMIT);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit);
    }

    await ensureSeeded();

    const body = await request.json();
    const validated = bookingPostSchema.parse(body);

    // Sanitize user-provided fields
    const sanitizedCustomerName = sanitizePatientName(validated.customerName);
    const sanitizedEmail = validated.customerEmail ? sanitizeEmail(validated.customerEmail) : '';
    const sanitizedPhone = sanitizeText(validated.customerPhone, 40);
    const sanitizedNotes = validated.notes ? sanitizeText(validated.notes, 500) : null;
    const sanitizedPaymentMethod = validated.paymentMethod
      ? sanitizeText(validated.paymentMethod, 40) || 'card'
      : 'card';
    const sanitizedPaymentLabel = validated.paymentLabel
      ? sanitizeText(validated.paymentLabel, 80) || 'Credit Card'
      : 'Credit Card';

    if (!sanitizedCustomerName) {
      return NextResponse.json(
        { error: 'A valid patient name is required.' },
        { status: 400 }
      );
    }

    if (!sanitizedPhone) {
      return NextResponse.json(
        { error: 'A valid phone number is required.' },
        { status: 400 }
      );
    }

    // Validate patient email domain (syntax, typo check, and DNS MX check) when email is provided
    if (sanitizedEmail) {
      const emailDomainCheck = await verifyEmailDomainCanReceiveMail(sanitizedEmail);
      if (!emailDomainCheck.valid) {
        return NextResponse.json(
          {
            error: emailDomainCheck.error || 'Please enter a valid email address with an active mail domain.',
            code: emailDomainCheck.code || 'INVALID_EMAIL_DOMAIN',
            ...(emailDomainCheck.suggestedEmail
              ? { suggestedEmail: emailDomainCheck.suggestedEmail }
              : {}),
          },
          { status: 400 }
        );
      }
    }

    // Resolve tenant and clinic timezone before parsing/validating date & time
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.slug, validated.tenantSlug),
    });
    if (!tenant && validated.tenantSlug !== 'zenith-dental') {
      return NextResponse.json({ error: 'Clinic tenant not found.' }, { status: 404 });
    }
    const tenantId = tenant ? tenant.id : DETERMINISTIC_IDS.tenant;
    const clinicTimeZone = resolveClinicTimeZone(tenant?.timezone);

    // Parse date/time (or offset-less startTime) in clinic/tenant timezone
    const parsedDateTime = parseClinicDateTimeInput(
      {
        date: validated.date,
        time: validated.time,
        startTime: validated.startTime,
      },
      clinicTimeZone
    );

    if (!parsedDateTime) {
      return NextResponse.json(
        { error: 'Invalid date or time provided.' },
        { status: 400 }
      );
    }

    const reqDate = parsedDateTime.utcDate;
    const reqDateStr = parsedDateTime.dateStr;
    const reqTimeStr = parsedDateTime.timeStr;

    // Validate 7-day advance booking window and past clock times in clinic timezone
    const now = new Date();
    const todayParts = getZonedParts(now, clinicTimeZone);
    const todayStart = zonedDateTimeToUtc(
      todayParts.year,
      todayParts.month,
      todayParts.day,
      0,
      0,
      0,
      0,
      clinicTimeZone
    );
    const maxCal = new Date(Date.UTC(todayParts.year, todayParts.month - 1, todayParts.day + 7, 12, 0, 0));
    const maxDateStr = maxCal.toISOString().split('T')[0];
    const maxDateEnd = zonedDateTimeToUtc(
      maxCal.getUTCFullYear(),
      maxCal.getUTCMonth() + 1,
      maxCal.getUTCDate(),
      23,
      59,
      59,
      999,
      clinicTimeZone
    );

    if (reqDate < todayStart || reqDate > maxDateEnd) {
      return NextResponse.json(
        {
          error: 'Reservations can only be made up to 7 days in advance.',
          code: 'DATE_EXCEEDS_7_DAYS',
          maxBookingDate: maxDateStr,
        },
        { status: 400 }
      );
    }

    if (reqDate.getTime() < now.getTime()) {
      return NextResponse.json(
        {
          error: 'Cannot book an appointment slot in the past.',
          code: 'PAST_TIME_SLOT',
        },
        { status: 400 }
      );
    }

    const staffId = resolveStaffId(validated.staffId);
    const serviceId = resolveServiceId(validated.serviceId);

    // Verify specialist exists and is active for this tenant
    const staffMember = await db.query.staff.findFirst({
      where: and(
        eq(staff.id, staffId),
        eq(staff.tenantId, tenantId),
        eq(staff.isActive, true)
      ),
    });

    if (!staffMember) {
      return NextResponse.json(
        { error: 'Selected specialist not found or inactive.' },
        { status: 404 }
      );
    }

    // Fetch authoritative service info from DB (never trust client pricing/duration)
    const service = await db.query.services.findFirst({
      where: and(
        eq(services.id, serviceId),
        eq(services.tenantId, tenantId),
        eq(services.isActive, true)
      ),
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Selected service not found or inactive.' },
        { status: 404 }
      );
    }

    const durationMinutes = service.durationMinutes ?? 45;
    const bufferMinutes = service.bufferMinutes ?? 15;
    const endTime = new Date(reqDate.getTime() + durationMinutes * 60 * 1000);

    // Server-side validation of clinic working hours & closed days
    const schedule = await db.query.staffSchedules.findFirst({
      where: and(
        eq(staffSchedules.staffId, staffId),
        eq(staffSchedules.dayOfWeek, parsedDateTime.dayOfWeek),
        eq(staffSchedules.isActive, true)
      ),
    });

    if (!schedule) {
      return NextResponse.json(
        {
          error: 'Clinic is closed or specialist is not scheduled on this day.',
          code: 'CLINIC_CLOSED',
        },
        { status: 400 }
      );
    }

    const [wsHour, wsMin] = schedule.startTime.split(':').map(Number);
    const [weHour, weMin] = schedule.endTime.split(':').map(Number);
    const workStart = zonedDateTimeToUtc(
      parsedDateTime.year,
      parsedDateTime.month,
      parsedDateTime.day,
      wsHour,
      wsMin,
      0,
      0,
      clinicTimeZone
    );
    const workEnd = zonedDateTimeToUtc(
      parsedDateTime.year,
      parsedDateTime.month,
      parsedDateTime.day,
      weHour,
      weMin,
      0,
      0,
      clinicTimeZone
    );

    if (reqDate < workStart || endTime > workEnd) {
      return NextResponse.json(
        {
          error: 'Requested time is outside clinic working hours.',
          code: 'OUTSIDE_WORKING_HOURS',
        },
        { status: 400 }
      );
    }

    if (schedule.breakStart && schedule.breakEnd) {
      const [bsHour, bsMin] = schedule.breakStart.split(':').map(Number);
      const [beHour, beMin] = schedule.breakEnd.split(':').map(Number);
      const breakStart = zonedDateTimeToUtc(
        parsedDateTime.year,
        parsedDateTime.month,
        parsedDateTime.day,
        bsHour,
        bsMin,
        0,
        0,
        clinicTimeZone
      );
      const breakEnd = zonedDateTimeToUtc(
        parsedDateTime.year,
        parsedDateTime.month,
        parsedDateTime.day,
        beHour,
        beMin,
        0,
        0,
        clinicTimeZone
      );

      if (reqDate < breakEnd && endTime > breakStart) {
        return NextResponse.json(
          {
            error: 'Requested time overlaps with the specialist lunch break.',
            code: 'OUTSIDE_WORKING_HOURS',
          },
          { status: 400 }
        );
      }
    }

    // Verify compatibility with the availability engine's slot schedule
    const daySlots = await calculateAvailableSlots({
      tenantId,
      staffId,
      serviceId,
      date: reqDateStr,
      timezone: clinicTimeZone,
      includeUnavailable: true,
    });

    const matchingSlot = daySlots.find(
      (slot) => new Date(slot.startTime).getTime() === reqDate.getTime()
    );

    if (!matchingSlot) {
      return NextResponse.json(
        {
          error: 'Requested time does not match a valid appointment slot for this service.',
          code: 'INVALID_TIME_SLOT',
        },
        { status: 400 }
      );
    }

    const depositAmountCents = service.depositCents ?? 0;
    const depositAmountDollars = depositAmountCents / 100;
    const totalPriceDollars = (service.priceCents ?? 0) / 100;

    const bookingCode = generateBookingCode();

    try {
      const createdBooking = await createBookingWithConcurrencyLock({
        tenantId,
        staffId,
        serviceId,
        bookingCode,
        customerName: sanitizedCustomerName,
        customerEmail: sanitizedEmail || 'patient-direct@zenithdental.com',
        customerPhone: sanitizedPhone,
        startTime: reqDate,
        endTime,
        status: 'pending',
        paymentStatus: 'unpaid',
        paymentMethod: sanitizedPaymentMethod,
        paymentLabel: sanitizedPaymentLabel,
        depositAmountCents,
        notes: sanitizedNotes,
        internalNotes: null,
        bufferMinutes,
      });

      // Dispatch clinical confirmation email if email was provided
      if (sanitizedEmail) {
        try {
          const isRashad = staffId === DETERMINISTIC_IDS.doctorRashad;
          const emailResult = await sendBookingConfirmationEmail({
            bookingCode: createdBooking.bookingCode || `ZD-${createdBooking.id.substring(0, 6)}`,
            patientName: sanitizedCustomerName,
            patientEmail: sanitizedEmail,
            doctorName: resolveStaffName(staffId),
            doctorTitle: isRashad
              ? 'Oral & Maxillofacial Surgeon'
              : 'Lead Aesthetic Dentist & Orthodontist',
            doctorSuite: isRashad
              ? 'Harley Street Suite B (Floor 2)'
              : 'Harley Street Suite A (Floor 2)',
            serviceName: service.name || resolveServiceName(serviceId),
            serviceCategory: service.category || 'Diagnostic & Preventive',
            durationMinutes,
            dateFormatted: reqDateStr,
            timeFormatted: reqTimeStr,
            depositAmount: depositAmountDollars,
            totalPrice: totalPriceDollars,
            paymentMethod: sanitizedPaymentMethod,
            startUtc: reqDate,
            endUtc: endTime,
          });
          console.log(`[BOOKING EMAIL DISPATCHED]: success=${emailResult.success}, provider=${emailResult.provider}, id=${emailResult.messageId}`);
        } catch (emailErr) {
          console.error('[BOOKING EMAIL NOTICE]:', emailErr);
        }
      }

      return NextResponse.json(
        {
          success: true,
          bookingId: createdBooking.bookingCode || createdBooking.id,
          message: 'Appointment reservation created and pending confirmation.',
          booking: {
            id: createdBooking.bookingCode || createdBooking.id,
            dbId: createdBooking.id,
            bookingCode: createdBooking.bookingCode,
            customerName: createdBooking.customerName,
            status: createdBooking.status,
            paymentStatus: createdBooking.paymentStatus,
            depositAmountCents: createdBooking.depositAmountCents,
            startTime: createdBooking.startTime,
            endTime: createdBooking.endTime,
          },
          details: {
            slotKey: `${validated.tenantSlug}:${validated.staffId}:${reqDateStr}:${reqTimeStr}`,
            patientName: sanitizedCustomerName,
            date: reqDateStr,
            time: reqTimeStr,
            timezone: clinicTimeZone,
            depositStatus: createdBooking.paymentStatus,
            paymentMethod: sanitizedPaymentMethod,
            depositAmount: depositAmountDollars,
            sterilizationBufferMinutes: bufferMinutes,
          },
        },
        { status: 201 }
      );
    } catch (lockError: any) {
      if (
        lockError instanceof BookingConflictError ||
        lockError.statusCode === 409 ||
        String(lockError.message).includes('409') ||
        String(lockError.message).includes('already reserved')
      ) {
        return NextResponse.json(
          {
            error: 'Slot conflict: This appointment time was already reserved by another patient.',
            code: 'SLOT_ALREADY_BOOKED',
          },
          { status: 409 }
        );
      }
      throw lockError;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues || error.format() },
        { status: 400 }
      );
    }
    console.error('[POST /api/v1/bookings Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/v1/bookings
// Updates status, notes, or internal clinical notes for a booking.
// ---------------------------------------------------------------------------
export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAuth(request, CLINICAL_STAFF_ROLES);
    if (!auth.authenticated) {
      return auth.response;
    }

    const sessionTenantId = auth.user.tenantId;
    if (!sessionTenantId) {
      return NextResponse.json({ error: 'Tenant context missing in session.' }, { status: 403 });
    }

    await ensureSeeded();

    const body = await request.json();
    const validated = bookingPatchSchema.parse(body);

    // Locate booking by UUID or bookingCode safely
    const isTargetUuid = isUuid(validated.id);
    const existing = await db.query.bookings.findFirst({
      where: isTargetUuid
        ? or(eq(bookings.id, validated.id), eq(bookings.bookingCode, validated.id))
        : eq(bookings.bookingCode, validated.id),
    });

    if (!existing) {
      return NextResponse.json({ error: `Booking with ID "${validated.id}" not found.` }, { status: 404 });
    }

    if (existing.tenantId !== sessionTenantId) {
      return NextResponse.json({ error: 'Forbidden: Booking belongs to another clinic.' }, { status: 403 });
    }

    const updates: Record<string, unknown> = {};
    if (validated.status !== undefined) updates.status = validated.status;
    if (validated.notes !== undefined) {
      updates.notes = validated.notes ? sanitizeText(validated.notes, 500) : null;
    }
    if (validated.internalNotes !== undefined) {
      updates.internalNotes = validated.internalNotes ? sanitizeText(validated.internalNotes, 1000) : null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'At least one updatable field (status, notes, internalNotes) is required.' },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(bookings)
      .set(updates)
      .where(and(eq(bookings.id, existing.id), eq(bookings.tenantId, sessionTenantId)))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully.',
      booking: {
        id: updated.bookingCode || updated.id,
        dbId: updated.id,
        bookingCode: updated.bookingCode,
        status: updated.status,
        notes: updated.notes,
        internalNotes: updated.internalNotes,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues || error.format() },
        { status: 400 }
      );
    }
    console.error('[PATCH /api/v1/bookings Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/v1/bookings
// Cancels or deletes a specific booking by explicit ID.
// ---------------------------------------------------------------------------
export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAuth(request, CLINICAL_STAFF_ROLES);
    if (!auth.authenticated) {
      return auth.response;
    }

    const sessionTenantId = auth.user.tenantId;
    if (!sessionTenantId) {
      return NextResponse.json({ error: 'Tenant context missing in session.' }, { status: 403 });
    }

    await ensureSeeded();

    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get('id')?.trim();

    if (!targetId) {
      return NextResponse.json(
        { error: 'Query parameter "id" is required to cancel or delete a booking.' },
        { status: 400 }
      );
    }

    const isTargetUuid = isUuid(targetId);
    const existing = await db.query.bookings.findFirst({
      where: isTargetUuid
        ? or(eq(bookings.id, targetId), eq(bookings.bookingCode, targetId))
        : eq(bookings.bookingCode, targetId),
    });

    if (!existing) {
      return NextResponse.json({ error: `Booking "${targetId}" not found.` }, { status: 404 });
    }

    if (existing.tenantId !== sessionTenantId) {
      return NextResponse.json({ error: 'Forbidden: Booking belongs to another clinic.' }, { status: 403 });
    }

    if (searchParams.get('hard') === 'true') {
      await db
        .delete(bookings)
        .where(and(eq(bookings.id, existing.id), eq(bookings.tenantId, sessionTenantId)));
      return NextResponse.json({
        success: true,
        message: `Booking ${targetId} permanently deleted.`,
      });
    }

    await db
      .update(bookings)
      .set({ status: 'cancelled' })
      .where(and(eq(bookings.id, existing.id), eq(bookings.tenantId, sessionTenantId)));

    return NextResponse.json({
      success: true,
      message: `Booking ${targetId} cancelled successfully.`,
    });
  } catch (error) {
    console.error('[DELETE /api/v1/bookings Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
