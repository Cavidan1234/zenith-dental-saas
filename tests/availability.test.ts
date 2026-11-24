import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { db, ensureInitialized } from '../src/lib/db';
import { bookings, tenants } from '../src/lib/db/schema';
import {
  calculateAvailableSlots,
  getZonedParts,
  parseClinicDateTimeInput,
  zonedDateTimeToUtc,
} from '../src/lib/engine/availability';
import {
  createBookingWithConcurrencyLock,
  generateBookingCode,
  PENDING_BOOKING_TTL_MINUTES,
} from '../src/lib/engine/booking';
import { seed } from '../src/lib/db/seed';
import { GET as getAvailabilityRoute } from '../src/app/api/v1/availability/route';
import {
  GET as getBookingsRoute,
  POST as postBookingsRoute,
  PATCH as patchBookingsRoute,
  DELETE as deleteBookingsRoute,
} from '../src/app/api/v1/bookings/route';
import { resetRateLimits } from '../src/lib/security/rateLimiter';
import { SESSION_COOKIE_NAME, signSessionToken } from '../src/lib/auth/session';
import { DETERMINISTIC_IDS } from '../src/lib/db/constants';

function getDayWithinWindowInZone(
  timeZone: string,
  predicate: (dayOfWeek: number) => boolean
): string {
  const todayParts = getZonedParts(new Date(), timeZone);
  for (let offset = 1; offset <= 7; offset++) {
    const candidate = new Date(
      Date.UTC(todayParts.year, todayParts.month - 1, todayParts.day + offset, 12, 0, 0)
    );
    if (predicate(candidate.getUTCDay())) {
      return candidate.toISOString().split('T')[0];
    }
  }
  const fallback = new Date(
    Date.UTC(todayParts.year, todayParts.month - 1, todayParts.day + 1, 12, 0, 0)
  );
  return fallback.toISOString().split('T')[0];
}

function getFutureOpenDayWithinWindow(): string {
  // Pick a Mon-Fri weekday inside the 7-day booking window (skip Saturday/Sunday for uniform 8-slot check)
  return getDayWithinWindowInZone('Asia/Baku', (day) => day >= 1 && day <= 5);
}

async function runAvailabilityTests() {
  console.log('===============================================================');
  console.log('🧪 Availability Engine & Route Comprehensive Verification');
  console.log('===============================================================\n');

  await ensureInitialized();
  const seedResult = await seed();
  const tenant = seedResult.tenant;
  const doctor = seedResult.doctorLeyla;
  const serviceCheckup = seedResult.services[0]; // 45m duration, 15m buffer
  const serviceWhitening = seedResult.services[1]; // 60m duration, 15m buffer

  // Test 1: Weekday Availability (clean baseline with zero bookings)
  const mondayDate = '2026-11-23';
  await db.delete(bookings).where(eq(bookings.staffId, doctor.id));
  const mondaySlots = await calculateAvailableSlots({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: serviceCheckup.id,
    date: mondayDate,
  });

  console.log(`📅 Monday (${mondayDate}) 45m+15m slots count:`, mondaySlots.length);
  mondaySlots.forEach((s) => console.log(`   🕒 ${s.startTime.slice(11, 16)} - ${s.endTime.slice(11, 16)} (Available: ${s.isAvailable})`));

  if (mondaySlots.length !== 8) {
    throw new Error(`Expected 8 slots on standard Monday, got ${mondaySlots.length}`);
  }

  for (const s of mondaySlots) {
    const startHour = parseInt(s.startTime.slice(11, 13), 10);
    if (startHour === 13) {
      throw new Error(`Slot scheduled during lunch break 13:00-14:00! Slot: ${s.startTime}`);
    }
  }
  console.log('✅ Lunch break (13:00-14:00) respected correctly.');

  // Test 2: Saturday Availability (2026-11-28 is an open Saturday: 10:00 - 15:00)
  const saturdayDate = '2026-11-28';
  const saturdaySlots = await calculateAvailableSlots({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: serviceCheckup.id,
    date: saturdayDate,
  });

  console.log(`\n📅 Saturday (${saturdayDate}) slots count:`, saturdaySlots.length);
  saturdaySlots.forEach((s) => console.log(`   🕒 ${s.startTime.slice(11, 16)} - ${s.endTime.slice(11, 16)}`));

  if (saturdaySlots.length !== 5) {
    throw new Error(`Expected 5 slots on Saturday, got ${saturdaySlots.length}`);
  }
  console.log('✅ Saturday custom operating hours (10:00-15:00) verified.');

  // Test 3: Sunday (Closed) (2026-11-29 is Sunday)
  const sundayDate = '2026-11-29';
  const sundaySlots = await calculateAvailableSlots({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: serviceCheckup.id,
    date: sundayDate,
  });

  console.log(`\n📅 Sunday (${sundayDate}) slots count:`, sundaySlots.length);
  if (sundaySlots.length !== 0) {
    throw new Error(`Expected 0 slots on Sunday, got ${sundaySlots.length}`);
  }
  console.log('✅ Clinic closure on Sunday verified (0 slots generated).');

  // Test 4: 60-min service step spacing (60m + 15m buffer = 75m steps)
  const whiteningSlots = await calculateAvailableSlots({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: serviceWhitening.id,
    date: mondayDate,
  });
  const whiteningTimes = whiteningSlots.map((s) => s.startTime.slice(11, 16));
  const expectedWhiteningTimes = ['09:00', '10:15', '11:30', '14:00', '15:15', '16:30'];
  if (JSON.stringify(whiteningTimes) !== JSON.stringify(expectedWhiteningTimes)) {
    throw new Error(
      `Expected 60m+15m whitening slots ${expectedWhiteningTimes.join(',')}, got ${whiteningTimes.join(',')}`
    );
  }
  console.log(`✅ 60m+15m service step spacing verified: ${whiteningTimes.join(', ')}`);

  // Test 5: Booking conflict + sterilization buffer blocks slots in availability engine (in clinic timezone)
  const clinicTz = tenant.timezone || 'Asia/Baku';
  await createBookingWithConcurrencyLock({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: serviceCheckup.id,
    customerName: 'Availability Buffer Test Patient',
    customerEmail: 'avail.buffer@example.com',
    startTime: zonedDateTimeToUtc(2026, 11, 23, 10, 30, 0, 0, clinicTz),
    endTime: zonedDateTimeToUtc(2026, 11, 23, 11, 15, 0, 0, clinicTz),
  });

  const mondayWithBooking = await calculateAvailableSlots({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: serviceCheckup.id,
    date: mondayDate,
    includeUnavailable: true,
  });
  const slot1000 = mondayWithBooking.find((s) => s.startTime.slice(11, 16) === '10:00');
  const slot1100 = mondayWithBooking.find((s) => s.startTime.slice(11, 16) === '11:00');
  const slot1200 = mondayWithBooking.find((s) => s.startTime.slice(11, 16) === '12:00');

  if (!slot1000 || slot1000.isAvailable !== false) {
    throw new Error('Expected 10:00 slot to be unavailable due to 10:30-11:15 booking');
  }
  if (!slot1100 || slot1100.isAvailable !== false) {
    throw new Error('Expected 11:00 slot to be unavailable due to 10:30-11:15 + 15m buffer until 11:30');
  }
  if (!slot1200 || slot1200.isAvailable !== true) {
    throw new Error('Expected 12:00 slot to remain available');
  }
  console.log('✅ Sterilization buffer blocking in availability engine verified.');

  // Test 6: ENG-01 Single Source of Truth on /api/v1/availability route handler
  const futureDate = getFutureOpenDayWithinWindow();
  const routeReq = new NextRequest(
    `http://localhost:3000/api/v1/availability?staffId=doc-leyla&serviceId=srv-whitening&date=${futureDate}&tenantSlug=zenith-dental`
  );
  const routeRes = await getAvailabilityRoute(routeReq);
  if (routeRes.status !== 200) {
    throw new Error(`Expected /api/v1/availability status 200, got ${routeRes.status}`);
  }
  const routeBody = await routeRes.json();
  const engineCompare = await calculateAvailableSlots({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: serviceWhitening.id,
    date: futureDate,
    includeUnavailable: true,
  });

  const routeTimes = (routeBody.slots || []).map((s: any) => s.time);
  const engineTimes = engineCompare.map((s) => s.startTime.slice(11, 16));
  if (JSON.stringify(routeTimes) !== JSON.stringify(engineTimes)) {
    throw new Error(
      `Route slots (${routeTimes.join(',')}) diverged from core engine (${engineTimes.join(',')})`
    );
  }
  console.log(`✅ ENG-01 route/engine parity verified for ${futureDate}: ${routeTimes.join(', ')}`);

  // Test 7: Invalid date returns 400 safely
  const invalidRes = await getAvailabilityRoute(
    new NextRequest('http://localhost:3000/api/v1/availability?date=2026-02-31')
  );
  if (invalidRes.status !== 400) {
    throw new Error(`Expected 400 on invalid calendar date, got ${invalidRes.status}`);
  }
  console.log('✅ Invalid calendar date rejected cleanly with HTTP 400.');

  // Test 8: Expired pending (unpaid) booking past TTL does NOT block availability slots
  await db.delete(bookings).where(eq(bookings.staffId, doctor.id));
  const expiredHoldStart = zonedDateTimeToUtc(2026, 11, 23, 12, 0, 0, 0, clinicTz);
  const expiredHoldEnd = zonedDateTimeToUtc(2026, 11, 23, 12, 45, 0, 0, clinicTz);
  await db.insert(bookings).values({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: serviceCheckup.id,
    bookingCode: generateBookingCode(),
    customerName: 'Expired Availability Hold',
    customerEmail: 'expired.avail@example.com',
    startTime: expiredHoldStart,
    endTime: expiredHoldEnd,
    status: 'pending',
    paymentStatus: 'unpaid',
    createdAt: new Date(Date.now() - (PENDING_BOOKING_TTL_MINUTES + 5) * 60 * 1000),
  });

  const activeHoldStart = zonedDateTimeToUtc(2026, 11, 23, 14, 0, 0, 0, clinicTz);
  const activeHoldEnd = zonedDateTimeToUtc(2026, 11, 23, 14, 45, 0, 0, clinicTz);
  await db.insert(bookings).values({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: serviceCheckup.id,
    bookingCode: generateBookingCode(),
    customerName: 'Active Availability Hold',
    customerEmail: 'active.avail@example.com',
    startTime: activeHoldStart,
    endTime: activeHoldEnd,
    status: 'pending',
    paymentStatus: 'unpaid',
    createdAt: new Date(),
  });

  const mondayAfterTtlCheck = await calculateAvailableSlots({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: serviceCheckup.id,
    date: mondayDate,
    includeUnavailable: true,
  });
  const slot1200AfterTtl = mondayAfterTtlCheck.find((s) => s.startTime.slice(11, 16) === '12:00');
  const slot1400Active = mondayAfterTtlCheck.find((s) => s.startTime.slice(11, 16) === '14:00');
  assert.equal(slot1200AfterTtl?.isAvailable, true, 'Expired pending/unpaid hold at 12:00 must NOT block slot');
  assert.equal(slot1400Active?.isAvailable, false, 'Fresh pending/unpaid hold at 14:00 MUST block slot');
  console.log('✅ Pending unpaid TTL expiration verified in availability engine.');

  // Test 9: Clinic-timezone parsing independence regardless of process.env.TZ
  const originalTz = process.env.TZ;
  try {
    const parsedResults: string[] = [];
    const offsetLessResults: string[] = [];
    const slotStartUtcResults: string[] = [];

    for (const tz of ['UTC', 'America/New_York', 'Asia/Tokyo']) {
      process.env.TZ = tz;
      const p1 = parseClinicDateTimeInput({ date: mondayDate, time: '09:00' }, clinicTz);
      const p2 = parseClinicDateTimeInput({ startTime: `${mondayDate}T09:00:00` }, clinicTz);
      assert.ok(p1 && p2, `Expected clinic parsing to succeed under TZ=${tz}`);
      parsedResults.push(p1.utcDate.toISOString());
      offsetLessResults.push(p2.utcDate.toISOString());

      const tzSlots = await calculateAvailableSlots({
        tenantId: tenant.id,
        staffId: doctor.id,
        serviceId: serviceCheckup.id,
        date: mondayDate,
      });
      slotStartUtcResults.push(new Date(tzSlots[0].startTime).toISOString());
    }

    assert.deepEqual(
      parsedResults,
      ['2026-11-23T09:00:00.000Z', '2026-11-23T09:00:00.000Z', '2026-11-23T09:00:00.000Z'],
      'date+time must always resolve to 09:00Z for 09:00 Europe/London regardless of process.env.TZ'
    );
    assert.deepEqual(
      offsetLessResults,
      ['2026-11-23T09:00:00.000Z', '2026-11-23T09:00:00.000Z', '2026-11-23T09:00:00.000Z'],
      'offset-less startTime must always resolve in clinic timezone regardless of process.env.TZ'
    );
    assert.deepEqual(
      slotStartUtcResults,
      ['2026-11-23T09:00:00.000Z', '2026-11-23T09:00:00.000Z', '2026-11-23T09:00:00.000Z'],
      'calculateAvailableSlots instants must be invariant to process.env.TZ'
    );
    console.log('✅ Clinic-timezone parsing independence verified across UTC, America/New_York, Asia/Tokyo.');
  } finally {
    if (originalTz === undefined) {
      delete process.env.TZ;
    } else {
      process.env.TZ = originalTz;
    }
  }

  // Test 10: POST /api/v1/bookings server-side validation (past time, closed day, outside hours, off-grid, valid)
  resetRateLimits();
  const todayInBaku = getZonedParts(new Date(), clinicTz).dateStr;
  const closedSunday = getDayWithinWindowInZone(clinicTz, (d) => d === 0);

  const makePostReq = (payload: Record<string, unknown>) =>
    new NextRequest('http://localhost:3000/api/v1/bookings', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

  // 10a. Past clock time today (00:00 in Asia/Baku is always <= now on todayInBaku)
  const pastTimeRes = await postBookingsRoute(
    makePostReq({
      tenantSlug: 'zenith-dental',
      serviceId: 'srv-checkup',
      staffId: 'doc-leyla',
      date: todayInBaku,
      time: '00:00',
      customerName: 'Past Time Patient',
      customerEmail: 'past.time@example.com',
      customerPhone: '+994 50 111 0001',
    })
  );
  assert.equal(pastTimeRes.status, 400, 'POST must reject past clock time today with HTTP 400');
  const pastTimeBody = await pastTimeRes.json();
  assert.equal(pastTimeBody.code, 'PAST_TIME_SLOT');

  // 10b. Closed day (Sunday within 7-day window)
  const closedDayRes = await postBookingsRoute(
    makePostReq({
      tenantSlug: 'zenith-dental',
      serviceId: 'srv-checkup',
      staffId: 'doc-leyla',
      date: closedSunday,
      time: '10:00',
      customerName: 'Sunday Patient',
      customerEmail: 'sunday@example.com',
      customerPhone: '+994 50 111 0002',
    })
  );
  assert.equal(closedDayRes.status, 400, 'POST must reject closed Sunday with HTTP 400');
  const closedDayBody = await closedDayRes.json();
  assert.equal(closedDayBody.code, 'CLINIC_CLOSED');

  // 10c. Outside working hours (07:00 before 09:00 open, and 13:00 during lunch break)
  const earlyRes = await postBookingsRoute(
    makePostReq({
      tenantSlug: 'zenith-dental',
      serviceId: 'srv-checkup',
      staffId: 'doc-leyla',
      date: futureDate,
      time: '07:00',
      customerName: 'Early Bird Patient',
      customerEmail: 'early@example.com',
      customerPhone: '+994 50 111 0003',
    })
  );
  assert.equal(earlyRes.status, 400, 'POST must reject 07:00 outside working hours');
  assert.equal((await earlyRes.json()).code, 'OUTSIDE_WORKING_HOURS');

  const lunchRes = await postBookingsRoute(
    makePostReq({
      tenantSlug: 'zenith-dental',
      serviceId: 'srv-checkup',
      staffId: 'doc-leyla',
      date: futureDate,
      time: '13:00',
      customerName: 'Lunch Break Patient',
      customerEmail: 'lunch@example.com',
      customerPhone: '+994 50 111 0004',
    })
  );
  assert.equal(lunchRes.status, 400, 'POST must reject 13:00 lunch break slot');
  assert.equal((await lunchRes.json()).code, 'OUTSIDE_WORKING_HOURS');

  // 10d. Off-grid slot inside working hours (09:15 doesn't align with calculateAvailableSlots)
  const offGridRes = await postBookingsRoute(
    makePostReq({
      tenantSlug: 'zenith-dental',
      serviceId: 'srv-checkup',
      staffId: 'doc-leyla',
      date: futureDate,
      time: '09:15',
      customerName: 'Off Grid Patient',
      customerEmail: 'offgrid@example.com',
      customerPhone: '+994 50 111 0005',
    })
  );
  assert.equal(offGridRes.status, 400, 'POST must reject off-grid slot not in calculateAvailableSlots');
  assert.equal((await offGridRes.json()).code, 'INVALID_TIME_SLOT');

  // 10e. Valid open slot via offset-less startTime string parsed in Asia/Baku
  const openSlots = await calculateAvailableSlots({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: serviceCheckup.id,
    date: futureDate,
  });
  assert.ok(openSlots.length > 0, `Expected open slots on ${futureDate}`);
  const targetSlot = openSlots[openSlots.length - 1];
  const targetClockTime = targetSlot.startTime.slice(11, 16);

  const validPostRes = await postBookingsRoute(
    makePostReq({
      tenantSlug: 'zenith-dental',
      serviceId: 'srv-checkup',
      staffId: 'doc-leyla',
      startTime: `${futureDate}T${targetClockTime}:00`,
      customerName: 'Valid Zoned Patient',
      customerEmail: 'valid.zoned@example.com',
      customerPhone: '+994 50 111 0006',
    })
  );
  assert.equal(validPostRes.status, 201, 'POST with valid offset-less startTime must return 201');
  const validPostBody = await validPostRes.json();
  assert.match(validPostBody.booking.bookingCode, /^ZD-[0-9A-F]{10}$/);
  assert.equal(
    new Date(validPostBody.booking.startTime).toISOString(),
    new Date(targetSlot.startTime).toISOString(),
    'Stored startTime UTC must match clinic timezone instant'
  );
  console.log('✅ POST /api/v1/bookings validation (past time, closed day, working hours, off-grid, offset-less startTime) verified.');

  // Test 11: Tenant isolation on GET, PATCH, DELETE /api/v1/bookings
  const otherTenantId = crypto.randomUUID();
  const [otherTenant] = await db
    .insert(tenants)
    .values({
      id: otherTenantId,
      name: 'Other Dental Clinic',
      slug: `other-clinic-${Date.now()}`,
      timezone: 'Asia/Baku',
      currency: 'USD',
      depositAmountCents: 2500,
    })
    .returning();

  const [otherBooking] = await db
    .insert(bookings)
    .values({
      tenantId: otherTenant.id,
      staffId: doctor.id,
      serviceId: serviceCheckup.id,
      bookingCode: generateBookingCode(),
      customerName: 'Foreign Tenant Patient',
      customerEmail: 'foreign@example.com',
      startTime: zonedDateTimeToUtc(2026, 11, 25, 9, 0, 0, 0, clinicTz),
      endTime: zonedDateTimeToUtc(2026, 11, 25, 9, 45, 0, 0, clinicTz),
      status: 'pending',
      paymentStatus: 'unpaid',
    })
    .returning();

  try {
    const ownerToken = await signSessionToken({
      userId: DETERMINISTIC_IDS.userLeyla,
      email: 'admin@zenithdental.com',
      name: 'Dr. Leyla Mammadova',
      role: 'owner',
      staffId: DETERMINISTIC_IDS.doctorLeyla,
      title: 'Lead Aesthetic Dentist',
      tenantId: tenant.id,
    });

    const getRes = await getBookingsRoute(
      new NextRequest('http://localhost:3000/api/v1/bookings', {
        headers: { cookie: `${SESSION_COOKIE_NAME}=${ownerToken}` },
      })
    );
    assert.equal(getRes.status, 200);
    const getBody = await getRes.json();
    const leakedForeign = (getBody.bookings || []).find(
      (b: any) => b.dbId === otherBooking.id || b.bookingCode === otherBooking.bookingCode
    );
    assert.equal(leakedForeign, undefined, 'GET /api/v1/bookings must NOT leak bookings from another tenant');

    const crossPatchRes = await patchBookingsRoute(
      new NextRequest('http://localhost:3000/api/v1/bookings', {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          cookie: `${SESSION_COOKIE_NAME}=${ownerToken}`,
        },
        body: JSON.stringify({ id: otherBooking.id, status: 'confirmed' }),
      })
    );
    assert.equal(crossPatchRes.status, 403, 'PATCH across tenants must return 403');

    const crossDeleteRes = await deleteBookingsRoute(
      new NextRequest(`http://localhost:3000/api/v1/bookings?id=${otherBooking.id}`, {
        method: 'DELETE',
        headers: { cookie: `${SESSION_COOKIE_NAME}=${ownerToken}` },
      })
    );
    assert.equal(crossDeleteRes.status, 403, 'DELETE across tenants must return 403');

    // Same-tenant PATCH and DELETE must succeed
    const ownPatchRes = await patchBookingsRoute(
      new NextRequest('http://localhost:3000/api/v1/bookings', {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          cookie: `${SESSION_COOKIE_NAME}=${ownerToken}`,
        },
        body: JSON.stringify({ id: validPostBody.booking.dbId, notes: 'Updated note' }),
      })
    );
    assert.equal(ownPatchRes.status, 200, 'Same-tenant PATCH must succeed with 200');

    const ownDeleteRes = await deleteBookingsRoute(
      new NextRequest(`http://localhost:3000/api/v1/bookings?id=${validPostBody.booking.dbId}&hard=true`, {
        method: 'DELETE',
        headers: { cookie: `${SESSION_COOKIE_NAME}=${ownerToken}` },
      })
    );
    assert.equal(ownDeleteRes.status, 200, 'Same-tenant DELETE must succeed with 200');
    console.log('✅ Tenant isolation verified for GET, PATCH, and DELETE /api/v1/bookings.');
  } finally {
    await db.delete(bookings).where(eq(bookings.id, otherBooking.id));
    await db.delete(tenants).where(eq(tenants.id, otherTenant.id));
  }

  console.log('\n===============================================================');
  console.log('🎉 ALL AVAILABILITY ENGINE & ROUTE TESTS PASSED!');
  console.log('===============================================================');
  process.exit(0);
}

runAvailabilityTests().catch((err) => {
  console.error('❌ Availability test failed:', err);
  process.exit(1);
});
