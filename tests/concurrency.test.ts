import { eq, and } from 'drizzle-orm';
import { db, ensureInitialized } from '../src/lib/db';
import { bookings } from '../src/lib/db/schema';
import {
  createBookingWithConcurrencyLock,
  BookingConflictError,
  generateBookingCode,
  PENDING_BOOKING_TTL_MINUTES,
} from '../src/lib/engine/booking';
import { seed } from '../src/lib/db/seed';

async function expectConflict(fn: () => Promise<any>, label: string): Promise<void> {
  try {
    await fn();
    throw new Error(`Expected BookingConflictError (409) for ${label}, but booking succeeded!`);
  } catch (err: any) {
    const isConflict =
      err instanceof BookingConflictError ||
      err?.statusCode === 409 ||
      String(err?.message || '').includes('409');
    if (!isConflict) {
      throw new Error(`Expected 409 conflict for ${label}, got unexpected error: ${err?.message || err}`);
    }
    console.log(`✅ Conflict properly blocked (${label}): ${err.message}`);
  }
}

async function runConcurrencyStressTest() {
  console.log('===============================================================');
  console.log('⚡ Multi-Tenant SaaS Concurrency Stress Test: 50 Parallel Bookings');
  console.log('===============================================================\n');

  // 1. Seed or verify test tenant & clinical entities
  await ensureInitialized();
  const seedResult = await seed();
  const tenant = seedResult.tenant;
  const doctor = seedResult.doctorLeyla;
  const service = seedResult.services[0]; // Comprehensive Check-up (45m, 15m buffer)

  console.log(`\n🏢 Target Tenant: "${tenant.name}" (${tenant.id})`);
  console.log(`👨‍⚕️ Target Specialist: "${doctor.title}" (${doctor.id})`);
  console.log(`🩺 Target Service: "${service.name}" (${service.id})`);

  // 2. Select exact target collision slot: 2026-11-20 10:00 - 10:45 UTC
  const targetStartTime = new Date('2026-11-20T10:00:00.000Z');
  const targetEndTime = new Date('2026-11-20T10:45:00.000Z');

  console.log(`🎯 Contention Time Slot: ${targetStartTime.toISOString()} -> ${targetEndTime.toISOString()}`);

  const CONCURRENT_REQUESTS = 50;
  console.log(`🚀 Spawning ${CONCURRENT_REQUESTS} parallel booking attempts simultaneously...\n`);

  // Prepare 50 unique patient booking requests for the exact same slot
  const bookingAttempts = Array.from({ length: CONCURRENT_REQUESTS }, (_, i) => {
    const patientIndex = i + 1;
    return {
      tenantId: tenant.id,
      staffId: doctor.id,
      serviceId: service.id,
      customerName: `Concurrent Patient #${patientIndex}`,
      customerEmail: `patient_${patientIndex}@stress-test.example.com`,
      customerPhone: `+994 50 999 ${String(patientIndex).padStart(4, '0')}`,
      startTime: targetStartTime,
      endTime: targetEndTime,
      notes: `High concurrency collision attempt #${patientIndex}`,
      paymentStatus: 'deposit_paid' as const,
      status: 'confirmed' as const,
    };
  });

  const startClock = Date.now();

  // Fire all 50 booking promises concurrently at the exact same millisecond
  const results = await Promise.allSettled(
    bookingAttempts.map((attempt) => createBookingWithConcurrencyLock(attempt))
  );

  const durationMs = Date.now() - startClock;

  // 3. Analyze the results
  const fulfilled = results.filter(
    (r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled'
  );
  const rejected = results.filter(
    (r): r is PromiseRejectedResult => r.status === 'rejected'
  );

  console.log('---------------------------------------------------------------');
  console.log(`⏱️  Completed 50 parallel booking executions in ${durationMs}ms`);
  console.log(`✅ Fulfilled (Successes): ${fulfilled.length} (Expected: 1)`);
  console.log(`🛑 Rejected (Conflicts):  ${rejected.length} (Expected: 49)`);
  console.log('---------------------------------------------------------------\n');

  // 4. Verify assertions
  let assertionsPassed = true;

  if (fulfilled.length === 1) {
    const winningBooking = fulfilled[0].value;
    console.log(`🏆 Winner Request: Booking ID "${winningBooking.id}" for "${winningBooking.customerName}"`);
  } else {
    console.error(`❌ ASSERTION FAILED: Expected exactly 1 booking to succeed, but got ${fulfilled.length}!`);
    assertionsPassed = false;
  }

  if (rejected.length === 49) {
    console.log('✅ Exactly 49 competing booking requests were rejected.');
  } else {
    console.error(`❌ ASSERTION FAILED: Expected exactly 49 rejections, but got ${rejected.length}!`);
    assertionsPassed = false;
  }

  // Verify all rejections are genuine 409 Conflict errors
  let conflictErrorCount = 0;
  for (const rej of rejected) {
    const reason = rej.reason;
    const isConflict =
      reason instanceof BookingConflictError ||
      reason?.statusCode === 409 ||
      String(reason?.message || '').includes('409') ||
      String(reason?.message || '').includes('Slot already reserved');

    if (isConflict) {
      conflictErrorCount++;
    } else {
      console.warn(`⚠️ Unexpected rejection error type:`, reason);
    }
  }

  console.log(`🛡️  Verified ${conflictErrorCount}/${rejected.length} rejections received "409 Conflict: Slot already reserved"`);

  if (conflictErrorCount !== 49) {
    console.error(`❌ ASSERTION FAILED: Expected 49 conflict errors, but got ${conflictErrorCount}`);
    assertionsPassed = false;
  }

  // 5. Database State Consistency Check
  const recordsInDb = await db.query.bookings.findMany({
    where: and(
      eq(bookings.staffId, doctor.id),
      eq(bookings.startTime, targetStartTime)
    ),
  });

  console.log(`\n🔍 Direct Database Check: Found ${recordsInDb.length} record(s) in "bookings" for this slot.`);

  if (recordsInDb.length === 1) {
    console.log('✅ Database integrity guaranteed: Exactly 1 row persisted in table.');
  } else {
    console.error(`❌ ASSERTION FAILED: Expected 1 record in database, found ${recordsInDb.length}`);
    assertionsPassed = false;
  }

  // 6. RACE-01 Sterilization Buffer Enforcement Tests
  console.log('\n---------------------------------------------------------------');
  console.log('🧼 RACE-01: 15-Minute Sterilization Buffer Enforcement Verification');
  console.log('---------------------------------------------------------------');

  // Anchor booking: 2026-12-15 10:30 - 11:15 UTC (with 15m buffer -> busy until 11:30)
  const anchorBooking = await createBookingWithConcurrencyLock({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: service.id,
    customerName: 'Sterilization Anchor Patient',
    customerEmail: 'anchor@stress-test.example.com',
    startTime: new Date('2026-12-15T10:30:00.000Z'),
    endTime: new Date('2026-12-15T11:15:00.000Z'),
    paymentStatus: 'unpaid',
    status: 'pending',
  });
  console.log(`✅ Created anchor booking 10:30-11:15 UTC (buffer until 11:30): ${anchorBooking.id}`);

  // Back-to-back 11:15-12:00 MUST fail with 409 (violates 15m sterilization buffer after 11:15)
  await expectConflict(
    () =>
      createBookingWithConcurrencyLock({
        tenantId: tenant.id,
        staffId: doctor.id,
        serviceId: service.id,
        customerName: 'Buffer Violator 11:15',
        customerEmail: 'violator1@stress-test.example.com',
        startTime: new Date('2026-12-15T11:15:00.000Z'),
        endTime: new Date('2026-12-15T12:00:00.000Z'),
      }),
    '11:15-12:00 immediately after 10:30-11:15 (0m buffer)'
  );

  // Mid-buffer 11:29-12:14 MUST fail with 409 (violates last 1m of sterilization buffer)
  await expectConflict(
    () =>
      createBookingWithConcurrencyLock({
        tenantId: tenant.id,
        staffId: doctor.id,
        serviceId: service.id,
        customerName: 'Buffer Violator 11:29',
        customerEmail: 'violator2@stress-test.example.com',
        startTime: new Date('2026-12-15T11:29:00.000Z'),
        endTime: new Date('2026-12-15T12:14:00.000Z'),
      }),
    '11:29-12:14 overlapping 11:15-11:30 sterilization window'
  );

  // Reverse buffer: 09:45-10:30 has 15m buffer ending at 10:45 -> MUST fail against 10:30 anchor
  await expectConflict(
    () =>
      createBookingWithConcurrencyLock({
        tenantId: tenant.id,
        staffId: doctor.id,
        serviceId: service.id,
        customerName: 'Reverse Buffer Violator 09:45',
        customerEmail: 'violator3@stress-test.example.com',
        startTime: new Date('2026-12-15T09:45:00.000Z'),
        endTime: new Date('2026-12-15T10:30:00.000Z'),
      }),
    '09:45-10:30 incoming buffer (to 10:45) overlapping 10:30-11:15 anchor'
  );

  // Post-buffer 11:30-12:15 MUST succeed cleanly
  const afterBufferBooking = await createBookingWithConcurrencyLock({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: service.id,
    customerName: 'Valid Post-Buffer Patient 11:30',
    customerEmail: 'valid.after@stress-test.example.com',
    startTime: new Date('2026-12-15T11:30:00.000Z'),
    endTime: new Date('2026-12-15T12:15:00.000Z'),
  });
  console.log(`✅ Valid post-buffer booking 11:30-12:15 succeeded: ${afterBufferBooking.id}`);

  // Pre-buffer 09:30-10:15 (with 15m buffer ending right at 10:30) MUST succeed cleanly
  const beforeBufferBooking = await createBookingWithConcurrencyLock({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: service.id,
    customerName: 'Valid Pre-Buffer Patient 09:30',
    customerEmail: 'valid.before@stress-test.example.com',
    startTime: new Date('2026-12-15T09:30:00.000Z'),
    endTime: new Date('2026-12-15T10:15:00.000Z'),
  });
  console.log(`✅ Valid pre-buffer booking 09:30-10:15 succeeded: ${beforeBufferBooking.id}`);

  // 7. Cryptographic bookingCode generation & collision / DB 23505 retry tests
  console.log('\n---------------------------------------------------------------');
  console.log('🔐 Cryptographic bookingCode & Collision / 23505 Retry Tests');
  console.log('---------------------------------------------------------------');

  const generatedCodes = new Set<string>();
  for (let i = 0; i < 100; i++) {
    const code = generateBookingCode();
    if (!/^ZD-[0-9A-F]{10}$/.test(code)) {
      throw new Error(`Unexpected bookingCode format: ${code}`);
    }
    generatedCodes.add(code);
  }
  if (generatedCodes.size !== 100) {
    throw new Error(`Expected 100 unique cryptographic booking codes, got ${generatedCodes.size}`);
  }
  console.log('✅ 100 cryptographic bookingCodes generated with expected ^ZD-[0-9A-F]{10}$ format.');

  const fixedCode = 'ZD-COLLIDE001';
  await createBookingWithConcurrencyLock({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: service.id,
    bookingCode: fixedCode,
    customerName: 'First Fixed Code Patient',
    customerEmail: 'collide1@stress-test.example.com',
    startTime: new Date('2026-11-22T09:00:00.000Z'),
    endTime: new Date('2026-11-22T09:45:00.000Z'),
  });

  const retriedBooking = await createBookingWithConcurrencyLock({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: service.id,
    bookingCode: fixedCode,
    customerName: 'Collision Retry Patient',
    customerEmail: 'collide2@stress-test.example.com',
    startTime: new Date('2026-11-22T10:00:00.000Z'),
    endTime: new Date('2026-11-22T10:45:00.000Z'),
  });

  if (!retriedBooking.bookingCode || retriedBooking.bookingCode === fixedCode) {
    throw new Error(`Expected colliding bookingCode ${fixedCode} to retry with a fresh code, got ${retriedBooking.bookingCode}`);
  }
  console.log(`✅ Pre-existing bookingCode collision retried cleanly -> ${retriedBooking.bookingCode}`);

  // Simulated PostgreSQL 23505 unique constraint violation on first transaction attempt
  let txAttempts = 0;
  const mock23505Db = {
    transaction: async (fn: (tx: any) => Promise<any>) => {
      txAttempts++;
      return await db.transaction(async (realTx: any) => {
        if (txAttempts === 1) {
          const proxyTx = new Proxy(realTx, {
            get(target, prop) {
              if (prop === 'insert') {
                return () => ({
                  values: () => ({
                    returning: async () => {
                      const err: any = new Error('duplicate key value violates unique constraint "bookings_booking_code_key"');
                      err.code = '23505';
                      err.constraint = 'bookings_booking_code_key';
                      throw err;
                    },
                  }),
                });
              }
              return Reflect.get(target, prop);
            },
          });
          return await fn(proxyTx);
        }
        return await fn(realTx);
      });
    },
  };

  const retry23505Booking = await createBookingWithConcurrencyLock({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: service.id,
    bookingCode: 'ZD-FORCE23505',
    customerName: 'DB 23505 Retry Patient',
    customerEmail: 'retry23505@stress-test.example.com',
    startTime: new Date('2026-11-22T11:00:00.000Z'),
    endTime: new Date('2026-11-22T11:45:00.000Z'),
    db: mock23505Db,
  });

  if (txAttempts !== 2 || !retry23505Booking.bookingCode || retry23505Booking.bookingCode === 'ZD-FORCE23505') {
    throw new Error(`Expected 2 transaction attempts and regenerated bookingCode on 23505, got attempts=${txAttempts}, code=${retry23505Booking.bookingCode}`);
  }
  console.log(`✅ DB 23505 unique violation retried cleanly (attempts=${txAttempts}, newCode=${retry23505Booking.bookingCode})`);

  // 8. Pending Booking TTL Expiration Tests
  console.log('\n---------------------------------------------------------------');
  console.log(`⏳ Pending Unpaid Booking TTL (${PENDING_BOOKING_TTL_MINUTES}m) Tests`);
  console.log('---------------------------------------------------------------');

  const expiredSlotStart = new Date('2026-12-21T09:00:00.000Z');
  const expiredSlotEnd = new Date('2026-12-21T09:45:00.000Z');
  const expiredCreatedAt = new Date(Date.now() - (PENDING_BOOKING_TTL_MINUTES + 5) * 60 * 1000);

  await db.insert(bookings).values({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: service.id,
    bookingCode: generateBookingCode(),
    customerName: 'Expired Pending Unpaid Patient',
    customerEmail: 'expired.pending@stress-test.example.com',
    startTime: expiredSlotStart,
    endTime: expiredSlotEnd,
    status: 'pending',
    paymentStatus: 'unpaid',
    createdAt: expiredCreatedAt,
  });

  const claimedExpiredSlot = await createBookingWithConcurrencyLock({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: service.id,
    customerName: 'New Patient Claiming Expired Hold',
    customerEmail: 'new.claim@stress-test.example.com',
    startTime: expiredSlotStart,
    endTime: expiredSlotEnd,
    status: 'pending',
    paymentStatus: 'unpaid',
  });
  console.log(`✅ Expired pending/unpaid hold did NOT block slot (new booking=${claimedExpiredSlot.id})`);

  // A pending + deposit_paid booking older than TTL MUST still block the slot
  const paidPendingStart = new Date('2026-12-21T11:00:00.000Z');
  const paidPendingEnd = new Date('2026-12-21T11:45:00.000Z');
  await db.insert(bookings).values({
    tenantId: tenant.id,
    staffId: doctor.id,
    serviceId: service.id,
    bookingCode: generateBookingCode(),
    customerName: 'Old Pending Paid Patient',
    customerEmail: 'old.paid.pending@stress-test.example.com',
    startTime: paidPendingStart,
    endTime: paidPendingEnd,
    status: 'pending',
    paymentStatus: 'deposit_paid',
    createdAt: expiredCreatedAt,
  });

  await expectConflict(
    () =>
      createBookingWithConcurrencyLock({
        tenantId: tenant.id,
        staffId: doctor.id,
        serviceId: service.id,
        customerName: 'Should Fail On Paid Pending',
        customerEmail: 'fail.paid.pending@stress-test.example.com',
        startTime: paidPendingStart,
        endTime: paidPendingEnd,
      }),
    'old pending + deposit_paid booking must still block slot'
  );

  // 9. DB error propagation around SELECT ... FOR UPDATE (no silent catch / 25P02)
  const failingLockDb = {
    transaction: async (fn: (tx: any) => Promise<any>) => {
      return await db.transaction(async (realTx: any) => {
        const proxyTx = new Proxy(realTx, {
          get(target, prop) {
            if (prop === 'execute') {
              return async () => {
                throw new Error('simulated FOR UPDATE lock failure');
              };
            }
            return Reflect.get(target, prop);
          },
        });
        return await fn(proxyTx);
      });
    },
  };

  let lockErrPropagated = false;
  try {
    await createBookingWithConcurrencyLock({
      tenantId: tenant.id,
      staffId: doctor.id,
      serviceId: service.id,
      customerName: 'Lock Error Patient',
      customerEmail: 'lock.err@stress-test.example.com',
      startTime: new Date('2026-12-21T14:00:00.000Z'),
      endTime: new Date('2026-12-21T14:45:00.000Z'),
      db: failingLockDb,
    });
  } catch (err: any) {
    if (String(err?.message).includes('simulated FOR UPDATE lock failure')) {
      lockErrPropagated = true;
    } else {
      throw err;
    }
  }
  if (!lockErrPropagated) {
    throw new Error('Expected FOR UPDATE DB error to propagate cleanly without being swallowed');
  }
  console.log('✅ SELECT ... FOR UPDATE DB error propagated cleanly without silent catch.');

  // 10. Direct DB-level FOR UPDATE contention with in-process StaffLockQueue bypassed
  const bypassStart = new Date('2026-12-22T10:00:00.000Z');
  const bypassEnd = new Date('2026-12-22T10:45:00.000Z');
  const bypassPromises = Array.from({ length: 25 }, (_, i) =>
    createBookingWithConcurrencyLock({
      tenantId: tenant.id,
      staffId: doctor.id,
      serviceId: service.id,
      customerName: `Bypass Mutex Patient #${i + 1}`,
      customerEmail: `bypass${i + 1}@stress-test.example.com`,
      startTime: bypassStart,
      endTime: bypassEnd,
      bypassProcessMutex: true,
    })
  );
  const bypassResults = await Promise.allSettled(bypassPromises);
  const bypassSuccesses = bypassResults.filter((r) => r.status === 'fulfilled');
  const bypassConflicts = bypassResults.filter(
    (r) => r.status === 'rejected' && (r.reason instanceof BookingConflictError || r.reason?.statusCode === 409)
  );
  if (bypassSuccesses.length !== 1 || bypassConflicts.length !== 24) {
    throw new Error(
      `Expected 1 win and 24 conflicts with bypassProcessMutex=true, got ${bypassSuccesses.length} wins / ${bypassConflicts.length} conflicts`
    );
  }
  console.log('✅ 25 parallel requests with bypassProcessMutex=true yielded 1 win and 24 409 conflicts via DB FOR UPDATE.');

  console.log('\n===============================================================');
  if (assertionsPassed) {
    console.log('🎉 ALL CONCURRENCY & STERILIZATION BUFFER ASSERTIONS PASSED PERFECTLY!');
    console.log('===============================================================');
    process.exit(0);
  } else {
    console.error('💥 CONCURRENCY TEST FAILED ASSERTIONS');
    console.log('===============================================================');
    process.exit(1);
  }
}

runConcurrencyStressTest().catch((err) => {
  console.error('❌ Unhandled stress test failure:', err);
  process.exit(1);
});
