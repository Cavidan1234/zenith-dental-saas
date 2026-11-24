import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, ensureInitialized } from './index';
import {
  tenants,
  users,
  staff,
  staffSchedules,
  services,
  bookings,
  recallReminders,
} from './schema';
import { DETERMINISTIC_IDS } from './constants';

function getOffsetDateStr(days: number): string {
  const d = new Date(Date.now() + days * 86400000);
  return d.toISOString().split('T')[0];
}

function createUtcDate(dateStr: string, timeStr: string, durationMinutes: number = 45): { start: Date; end: Date } {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  const start = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  return { start, end };
}

export async function seed() {
  console.log('🌱 Starting database seeding for Zenith Dental Studio...');
  await ensureInitialized();

  // 1. Check if tenant already exists; clean up for fresh seed if needed
  const existingTenant = await db.query.tenants.findFirst({
    where: eq(tenants.slug, 'zenith-dental'),
  });

  if (existingTenant) {
    console.log('🔄 Cleaning up existing data for tenant "zenith-dental"...');
    await db.delete(tenants).where(eq(tenants.id, existingTenant.id));
  }

  // 2. Insert Tenant: "Zenith Dental Studio"
  const [tenant] = await db
    .insert(tenants)
    .values({
      id: DETERMINISTIC_IDS.tenant,
      name: 'Zenith Dental Studio',
      slug: 'zenith-dental',
      logoUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300',
      brandColor: '#0f766e',
      timezone: 'Europe/London',
      currency: 'GBP',
      depositAmountCents: 2500, // £25 default deposit
    })
    .returning();

  console.log(`✅ Tenant created: "${tenant.name}" (${tenant.id})`);

  // 3. Insert Users
  const passwordHash = bcrypt.hashSync('Zenith2026!', 10);

  const [userLeyla] = await db
    .insert(users)
    .values({
      id: DETERMINISTIC_IDS.userLeyla,
      tenantId: tenant.id,
      email: 'admin@zenithdental.com',
      passwordHash,
      role: 'owner',
      name: 'Dr. Leyla Mammadova',
      phone: '+994 12 555 0101',
    })
    .returning();

  const [userRashad] = await db
    .insert(users)
    .values({
      id: DETERMINISTIC_IDS.userRashad,
      tenantId: tenant.id,
      email: 'rashad.aliyev@zenithdental.com',
      passwordHash,
      role: 'staff',
      name: 'Dr. Rashad Aliyev',
      phone: '+994 12 555 0102',
    })
    .returning();

  console.log('✅ Staff users created (Dr. Leyla & Dr. Rashad)');

  // 4. Insert Staff Profiles (Mapped to doc-leyla & doc-rashad)
  const [doctorLeyla] = await db
    .insert(staff)
    .values({
      id: DETERMINISTIC_IDS.doctorLeyla,
      tenantId: tenant.id,
      userId: userLeyla.id,
      title: 'Lead Aesthetic Dentist & Orthodontist',
      bio: 'Dr. Leyla Mammadova specializes in invisible orthodontics, porcelain veneers, and digital smile design with over 14 years of clinical precision.',
      avatarUrl: '/images/dental/doctor-leyla.jpg',
      specializations: [
        'Clear Aligners (Invisalign)',
        'Porcelain Veneers',
        'Digital Smile Design',
        'Laser Teeth Whitening',
      ],
      isActive: true,
    })
    .returning();

  const [doctorRashad] = await db
    .insert(staff)
    .values({
      id: DETERMINISTIC_IDS.doctorRashad,
      tenantId: tenant.id,
      userId: userRashad.id,
      title: 'Oral & Maxillofacial Surgeon',
      bio: 'Dr. Rashad Aliyev is an internationally certified maxillofacial surgeon focused on guided 3D implant placement and full arch dental restorations.',
      avatarUrl: '/images/dental/doctor-rashad.jpg',
      specializations: [
        'Guided Dental Implants',
        'All-on-4 / All-on-6 Restoration',
        'Bone Grafting & Sinus Lift',
        'Complex Wisdom Tooth Surgery',
      ],
      isActive: true,
    })
    .returning();

  console.log('✅ Doctor profiles initialized (doc-leyla & doc-rashad)');

  // 5. Insert Schedules for both doctors
  // Mon-Fri: 09:00 - 18:00 (Break: 13:00 - 14:00)
  // Sat: 10:00 - 15:00 (No break)
  // Sun: Closed
  const doctors = [doctorLeyla, doctorRashad];

  for (const doc of doctors) {
    // Weekdays (Mon=1 through Fri=5)
    for (let day = 1; day <= 5; day++) {
      await db.insert(staffSchedules).values({
        staffId: doc.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '18:00',
        breakStart: '13:00',
        breakEnd: '14:00',
        isActive: true,
      });
    }

    // Saturday (6)
    await db.insert(staffSchedules).values({
      staffId: doc.id,
      dayOfWeek: 6,
      startTime: '10:00',
      endTime: '15:00',
      breakStart: null,
      breakEnd: null,
      isActive: true,
    });
  }

  console.log('✅ Working schedules created (Mon-Fri 09:00-18:00, Sat 10:00-15:00)');

  // 6. Insert 4 Clinical Services (Mapped to srv-checkup/srv-consult, srv-whitening, srv-veneers, srv-implant)
  const [serviceCheckup] = await db
    .insert(services)
    .values({
      id: DETERMINISTIC_IDS.serviceCheckup,
      tenantId: tenant.id,
      name: 'Comprehensive Dental Exam & 3D Scan',
      slug: 'comprehensive-checkup-3d-scan',
      description: 'High-definition intraoral 3D scanning, digital cavity mapping, and comprehensive treatment planning consultation.',
      durationMinutes: 45,
      bufferMinutes: 15,
      priceCents: 8000, // $80.00
      depositCents: 2500, // $25.00
      category: 'Preventive',
      isActive: true,
    })
    .returning();

  const [serviceWhitening] = await db
    .insert(services)
    .values({
      id: DETERMINISTIC_IDS.serviceWhitening,
      tenantId: tenant.id,
      name: 'Laser Teeth Whitening (In-Office)',
      slug: 'laser-teeth-whitening',
      description: 'Medical-grade laser-accelerated bleaching delivering up to 8 shades brighter results in a single 60-minute session.',
      durationMinutes: 60,
      bufferMinutes: 15,
      priceCents: 25000, // $250.00
      depositCents: 5000, // $50.00
      category: 'Cosmetic',
      isActive: true,
    })
    .returning();

  const [serviceVeneers] = await db
    .insert(services)
    .values({
      id: DETERMINISTIC_IDS.serviceVeneers,
      tenantId: tenant.id,
      name: 'Porcelain Veneer Smile Design Consultation',
      slug: 'porcelain-veneer-consultation',
      description: 'Bespoke smile simulation, shade matching, and custom ultra-thin ceramic veneer aesthetic planning.',
      durationMinutes: 45,
      bufferMinutes: 15,
      priceCents: 12000, // $120.00
      depositCents: 3000, // $30.00
      category: 'Aesthetic',
      isActive: true,
    })
    .returning();

  const [serviceImplant] = await db
    .insert(services)
    .values({
      id: DETERMINISTIC_IDS.serviceImplant,
      tenantId: tenant.id,
      name: 'Dental Implant Consultation & 3D CBCT Scan',
      slug: 'dental-implant-planning',
      description: 'Cone Beam CT scan analysis, computer-guided surgical 3D planning, and titanium implant feasibility assessment.',
      durationMinutes: 60,
      bufferMinutes: 15,
      priceCents: 15000, // $150.00
      depositCents: 5000, // $50.00
      category: 'Surgical',
      isActive: true,
    })
    .returning();

  console.log('✅ 4 Specialized clinical services registered with deterministic IDs');

  // 7. Seed Past & Current Realistic Bookings
  const todayStr = getOffsetDateStr(0);
  const tomorrowStr = getOffsetDateStr(1);
  const dayAfterTomorrowStr = getOffsetDateStr(2);
  const day3Str = getOffsetDateStr(3);

  // Helper to create slot
  const slotEmma = createUtcDate(todayStr, '09:00', 60);
  const slotOliver = createUtcDate(todayStr, '10:00', 60);
  const slotSophia = createUtcDate(todayStr, '11:45', 45);
  const slotJames = createUtcDate(todayStr, '14:00', 45);

  const slotKamil = createUtcDate(tomorrowStr, '14:00', 60);
  const slotNigar = createUtcDate(dayAfterTomorrowStr, '11:45', 45);
  const slotEldar = createUtcDate(day3Str, '10:00', 45);

  const realisticBookings = [
    // Today's schedule bookings (matches dashboard daily grid)
    {
      tenantId: tenant.id,
      staffId: doctorLeyla.id,
      serviceId: serviceWhitening.id,
      bookingCode: 'ZD-829104',
      customerName: 'Emma Richardson',
      customerEmail: 'emma.r@example.co.uk',
      customerPhone: '+44 7700 900123',
      startTime: slotEmma.start,
      endTime: slotEmma.end,
      status: 'confirmed',
      paymentStatus: 'deposit_paid',
      paymentMethod: 'card',
      paymentLabel: 'Card ending in 4242',
      depositAmountCents: 5000,
      notes: 'Sensitive enamel; gentle polishing mode requested.',
      internalNotes: 'Pre-treatment sensitivity test passed with mild cold reaction. Recommended low-concentration gel.',
    },
    {
      tenantId: tenant.id,
      staffId: doctorRashad.id,
      serviceId: serviceImplant.id,
      bookingCode: 'ZD-829105',
      customerName: 'Oliver Vance',
      customerEmail: 'oliver.vance@company.com',
      customerPhone: '+44 7700 900456',
      startTime: slotOliver.start,
      endTime: slotOliver.end,
      status: 'confirmed',
      paymentStatus: 'deposit_paid',
      paymentMethod: 'card',
      paymentLabel: 'Card ending in 1111',
      depositAmountCents: 5000,
      notes: 'Full arch consultation requested.',
      internalNotes: 'Full bone density scan reviewed. 3D surgical guide required for upper molar implant.',
    },
    {
      tenantId: tenant.id,
      staffId: doctorLeyla.id,
      serviceId: serviceVeneers.id,
      bookingCode: 'ZD-829106',
      customerName: 'Sophia Chen',
      customerEmail: 'sophia.chen@design.org',
      customerPhone: '+44 7700 900789',
      startTime: slotSophia.start,
      endTime: slotSophia.end,
      status: 'confirmed',
      paymentStatus: 'deposit_paid',
      paymentMethod: 'apple_pay',
      paymentLabel: 'Apple Pay',
      depositAmountCents: 3000,
      notes: 'Pre-wedding natural shade consultation (BL2/BL3).',
      internalNotes: 'Shade BL2 selected. Digital smile design impressions captured.',
    },
    {
      tenantId: tenant.id,
      staffId: doctorRashad.id,
      serviceId: serviceCheckup.id,
      bookingCode: 'ZD-829107',
      customerName: 'James Montgomery',
      customerEmail: 'j.montgomery@outlook.com',
      customerPhone: '+44 7700 900234',
      startTime: slotJames.start,
      endTime: slotJames.end,
      status: 'pending',
      paymentStatus: 'deposit_paid',
      paymentMethod: 'google_pay',
      paymentLabel: 'Google Pay (Sandbox)',
      depositAmountCents: 2500,
      notes: 'Gingival bleeding concern; mild needle anxiety.',
      internalNotes: 'Recommended topical numbing gel prior to ultrasonic scaling.',
    },

    // Upcoming days bookings
    {
      tenantId: tenant.id,
      staffId: doctorRashad.id,
      serviceId: serviceImplant.id,
      bookingCode: 'ZD-829111',
      customerName: 'Kamil Aliyev',
      customerEmail: 'kamil.a@mail.ru',
      customerPhone: '+994 55 987 6543',
      startTime: slotKamil.start,
      endTime: slotKamil.end,
      status: 'confirmed',
      paymentStatus: 'deposit_paid',
      paymentMethod: 'card',
      paymentLabel: 'Card ending in 8899',
      depositAmountCents: 5000,
      notes: 'Pre-implant 3D CBCT scan for lower mandible.',
      internalNotes: 'Lower left jaw bone density optimal for 4.5mm implant.',
    },
    {
      tenantId: tenant.id,
      staffId: doctorLeyla.id,
      serviceId: serviceWhitening.id,
      bookingCode: 'ZD-829112',
      customerName: 'Nigar Huseynova',
      customerEmail: 'nigar.h@company.az',
      customerPhone: '+994 70 555 4433',
      startTime: slotNigar.start,
      endTime: slotNigar.end,
      status: 'confirmed',
      paymentStatus: 'deposit_paid',
      paymentMethod: 'card',
      paymentLabel: 'Card ending in 5544',
      depositAmountCents: 3000,
      notes: 'Laser teeth whitening session.',
      internalNotes: 'Patient has had previous whitening in 2024 with good tolerance.',
    },
    {
      tenantId: tenant.id,
      staffId: doctorRashad.id,
      serviceId: serviceCheckup.id,
      bookingCode: 'ZD-829113',
      customerName: 'Eldar Qasimov',
      customerEmail: 'eldar.q@tech.az',
      customerPhone: '+994 50 111 2233',
      startTime: slotEldar.start,
      endTime: slotEldar.end,
      status: 'confirmed',
      paymentStatus: 'deposit_paid',
      paymentMethod: 'in_clinic',
      paymentLabel: 'In-Clinic Cash/Card',
      depositAmountCents: 2500,
      notes: 'Routine check-up and ultrasonic prophylaxis.',
      internalNotes: 'Annual check-up. Zero visible caries.',
    },

    // Past completed bookings for recall / history
    {
      tenantId: tenant.id,
      staffId: doctorLeyla.id,
      serviceId: serviceCheckup.id,
      bookingCode: 'ZD-710001',
      customerName: 'Aysel Huseynova',
      customerEmail: 'aysel.huseynova@example.com',
      customerPhone: '+994 50 123 4567',
      startTime: createUtcDate(getOffsetDateStr(-10), '10:00', 45).start,
      endTime: createUtcDate(getOffsetDateStr(-10), '10:00', 45).end,
      status: 'completed',
      paymentStatus: 'fully_paid',
      paymentMethod: 'card',
      depositAmountCents: 2500,
      notes: 'Annual routine check-up. 3D scan performed, zero cavities detected.',
      internalNotes: 'Clean hygiene. Scheduled for 6-month prophylaxis recall.',
    },
    {
      tenantId: tenant.id,
      staffId: doctorRashad.id,
      serviceId: serviceImplant.id,
      bookingCode: 'ZD-710002',
      customerName: 'Fuad Mammadov',
      customerEmail: 'fuad.m@example.com',
      customerPhone: '+994 55 987 6543',
      startTime: createUtcDate(getOffsetDateStr(-7), '11:00', 60).start,
      endTime: createUtcDate(getOffsetDateStr(-7), '11:00', 60).end,
      status: 'completed',
      paymentStatus: 'fully_paid',
      paymentMethod: 'card',
      depositAmountCents: 5000,
      notes: 'Initial surgical planning for lower left molar titanium implant.',
      internalNotes: 'Guided surgical stent fabricated.',
    },
    {
      tenantId: tenant.id,
      staffId: doctorLeyla.id,
      serviceId: serviceWhitening.id,
      bookingCode: 'ZD-710003',
      customerName: 'Nigar Guliyeva',
      customerEmail: 'nigar.g@example.com',
      customerPhone: '+994 70 333 4455',
      startTime: createUtcDate(getOffsetDateStr(-5), '14:00', 60).start,
      endTime: createUtcDate(getOffsetDateStr(-5), '14:00', 60).end,
      status: 'completed',
      paymentStatus: 'fully_paid',
      paymentMethod: 'card',
      depositAmountCents: 5000,
      notes: 'Laser power whitening. Achieved 6 shades brightening with zero sensitivity.',
      internalNotes: 'VITA shade B1 achieved. Post-treatment fluoride varnish applied.',
    },
  ];

  for (const b of realisticBookings) {
    await db.insert(bookings).values(b);
  }

  console.log(`✅ ${realisticBookings.length} Realistic bookings populated in database`);

  // 8. Insert Automated 6-Month Hygiene Recalls
  const sixMonthsFromNow = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);

  await db.insert(recallReminders).values({
    tenantId: tenant.id,
    customerEmail: 'aysel.huseynova@example.com',
    customerName: 'Aysel Huseynova',
    customerPhone: '+994 50 123 4567',
    lastVisitDate: createUtcDate(getOffsetDateStr(-10), '10:00', 45).start,
    recallDueDate: sixMonthsFromNow,
    status: 'scheduled',
  });

  await db.insert(recallReminders).values({
    tenantId: tenant.id,
    customerEmail: 'fuad.m@example.com',
    customerName: 'Fuad Mammadov',
    customerPhone: '+994 55 987 6543',
    lastVisitDate: createUtcDate(getOffsetDateStr(-7), '11:00', 60).start,
    recallDueDate: sixMonthsFromNow,
    status: 'scheduled',
  });

  console.log('✅ 2 Automated hygiene recall reminders scheduled');

  console.log('\n✨ Database seeding completed successfully for Zenith Dental Studio!');
  return {
    tenant,
    doctorLeyla,
    doctorRashad,
    services: [serviceCheckup, serviceWhitening, serviceVeneers, serviceImplant],
  };
}

// Allow direct CLI execution: `npx tsx src/lib/db/seed.ts`
if (require.main === module || process.argv[1]?.includes('seed')) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding error:', err);
      process.exit(1);
    });
}
