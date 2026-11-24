import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db, ensureSeeded } from '@/lib/db';
import { staffSchedules, services, tenants } from '@/lib/db/schema';
import { resolveStaffId, resolveServiceId, DETERMINISTIC_IDS } from '@/lib/db/constants';
import { calculateAvailableSlots } from '@/lib/engine/availability';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await ensureSeeded();

    const { searchParams } = new URL(request.url);
    const rawStaffId = searchParams.get('staffId');
    const date = searchParams.get('date');
    const rawServiceId = searchParams.get('serviceId');
    const tenantSlug = searchParams.get('tenantSlug') || 'zenith-dental';

    if (!date) {
      return NextResponse.json({ error: 'Date is required (YYYY-MM-DD)' }, { status: 400 });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Invalid date format (expected YYYY-MM-DD)' }, { status: 400 });
    }

    const [reqYear, reqMonth, reqDay] = date.split('-').map(Number);
    const reqDate = new Date(Date.UTC(reqYear, reqMonth - 1, reqDay, 12, 0, 0));
    const isValidCalendarDate =
      !isNaN(reqDate.getTime()) &&
      reqDate.getUTCFullYear() === reqYear &&
      reqDate.getUTCMonth() === reqMonth - 1 &&
      reqDate.getUTCDate() === reqDay;

    if (!isValidCalendarDate) {
      return NextResponse.json({ error: 'Invalid calendar date provided' }, { status: 400 });
    }

    // Enforce strict 7-day advance booking limit (policy requirement)
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const maxDate = new Date(today);
    maxDate.setUTCDate(maxDate.getUTCDate() + 7);
    maxDate.setUTCHours(23, 59, 59, 999);

    if (reqDate < today || reqDate > maxDate) {
      return NextResponse.json(
        {
          error: 'Appointments can only be booked within a 7-day advance window.',
          code: 'DATE_OUT_OF_WINDOW',
          maxBookingDate: maxDate.toISOString().split('T')[0],
          slots: [],
        },
        { status: 400 }
      );
    }

    // Resolve tenant, staff, and service
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.slug, tenantSlug),
    });
    const tenantId = tenant ? tenant.id : DETERMINISTIC_IDS.tenant;

    const staffId = resolveStaffId(rawStaffId);
    const serviceId = resolveServiceId(rawServiceId);

    // Fetch staff schedule for this day of week (0 = Sun, 1 = Mon, ... 6 = Sat)
    const dayOfWeek = reqDate.getUTCDay();

    const schedule = await db.query.staffSchedules.findFirst({
      where: and(
        eq(staffSchedules.staffId, staffId),
        eq(staffSchedules.dayOfWeek, dayOfWeek),
        eq(staffSchedules.isActive, true)
      ),
    });

    if (!schedule) {
      // Specialist is closed/off on this day (e.g. Sunday)
      return NextResponse.json({
        tenantSlug,
        staffId: rawStaffId || 'doc-leyla',
        date,
        slots: [],
        meta: {
          isClosed: true,
          message: 'Clinic is closed or specialist not available on this day.',
        },
      });
    }

    // Fetch service parameters (duration and buffer)
    const service = await db.query.services.findFirst({
      where: and(
        eq(services.id, serviceId),
        eq(services.tenantId, tenantId),
        eq(services.isActive, true)
      ),
    });

    if (!service) {
      return NextResponse.json({ error: 'Selected service not found or inactive.' }, { status: 404 });
    }

    const bufferMinutes = service.bufferMinutes ?? 15;

    // Single source of truth: delegate slot calculation to core availability engine
    const engineSlots = await calculateAvailableSlots({
      tenantId,
      staffId,
      serviceId,
      date,
      includeUnavailable: true,
    });

    const slots = engineSlots.map((slot) => ({
      time: slot.startTime.slice(11, 16),
      available: slot.isAvailable,
      bufferMinutes,
    }));

    return NextResponse.json({
      tenantSlug,
      staffId: rawStaffId || 'doc-leyla',
      date,
      slots,
      meta: {
        workingHours: { start: schedule.startTime, end: schedule.endTime },
        breakTime: schedule.breakStart ? { start: schedule.breakStart, end: schedule.breakEnd } : null,
        sterilizationBufferMinutes: bufferMinutes,
        maxAdvanceDays: 7,
      },
    });
  } catch (error) {
    console.error('[API Availability Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
