import { db } from '../index';
import { bookings, recallReminders } from '../schema';

interface SeedBookingsParams {
  tenantId: string;
  doctorLeylaId: string;
  doctorRashadId: string;
  serviceCheckupId: string;
  serviceWhiteningId: string;
  serviceVeneerId: string;
  serviceImplantId: string;
}

export async function seedBookingsAndRecalls({
  tenantId,
  doctorLeylaId,
  doctorRashadId,
  serviceCheckupId,
  serviceWhiteningId,
  serviceVeneerId,
  serviceImplantId,
}: SeedBookingsParams) {
  const now = new Date();

  const daysOffset = (days: number, hour: number, minute: number = 0) => {
    const d = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    d.setUTCHours(hour, minute, 0, 0);
    return d;
  };

  const pastBookingsData = [
    {
      tenantId,
      staffId: doctorLeylaId,
      serviceId: serviceCheckupId,
      customerName: 'Aysel Huseynova',
      customerEmail: 'aysel.huseynova@example.com',
      customerPhone: '+994 50 123 4567',
      startTime: daysOffset(-10, 10, 0),
      endTime: daysOffset(-10, 10, 45),
      status: 'completed' as const,
      paymentStatus: 'fully_paid' as const,
      notes: 'Annual routine check-up. 3D scan performed, zero cavities detected.',
    },
    {
      tenantId,
      staffId: doctorRashadId,
      serviceId: serviceImplantId,
      customerName: 'Fuad Mammadov',
      customerEmail: 'fuad.m@example.com',
      customerPhone: '+994 55 987 6543',
      startTime: daysOffset(-7, 11, 0),
      endTime: daysOffset(-7, 12, 0),
      status: 'completed' as const,
      paymentStatus: 'fully_paid' as const,
      notes: 'Initial surgical planning for lower left molar titanium implant.',
    },
    {
      tenantId,
      staffId: doctorLeylaId,
      serviceId: serviceWhiteningId,
      customerName: 'Nigar Guliyeva',
      customerEmail: 'nigar.g@example.com',
      customerPhone: '+994 70 333 4455',
      startTime: daysOffset(-5, 14, 0),
      endTime: daysOffset(-5, 15, 0),
      status: 'completed' as const,
      paymentStatus: 'fully_paid' as const,
      notes: 'Laser power whitening. Achieved 6 shades brightening with zero sensitivity.',
    },
    {
      tenantId,
      staffId: doctorLeylaId,
      serviceId: serviceVeneerId,
      customerName: 'Elmir Karimov',
      customerEmail: 'elmir.k@example.com',
      customerPhone: '+994 51 444 7788',
      startTime: daysOffset(-3, 15, 0),
      endTime: daysOffset(-3, 15, 45),
      status: 'completed' as const,
      paymentStatus: 'fully_paid' as const,
      notes: 'Upper 6 front teeth veneer consultation. Digital scan sent to lab.',
    },
    {
      tenantId,
      staffId: doctorRashadId,
      serviceId: serviceImplantId,
      customerName: 'Sabina Taghiyeva',
      customerEmail: 'sabina.t@example.com',
      customerPhone: '+994 50 888 9900',
      startTime: daysOffset(-2, 16, 0),
      endTime: daysOffset(-2, 17, 0),
      status: 'completed' as const,
      paymentStatus: 'fully_paid' as const,
      notes: 'Guided implant placement post-op review. Osseointegration proceeding well.',
    },
  ];

  for (const b of pastBookingsData) {
    await db.insert(bookings).values(b);
  }
  console.log('✅ 5 Past historical bookings created');

  const upcomingBookingsData = [
    {
      tenantId,
      staffId: doctorLeylaId,
      serviceId: serviceCheckupId,
      customerName: 'Kamran Aliyev',
      customerEmail: 'kamran.a@example.com',
      customerPhone: '+994 50 777 1234',
      startTime: daysOffset(2, 10, 0),
      endTime: daysOffset(2, 10, 45),
      status: 'confirmed' as const,
      paymentStatus: 'deposit_paid' as const,
      stripePaymentIntentId: 'pi_test_zenith_upcoming_01',
      notes: 'Patient requested digital 3D bite analysis.',
    },
    {
      tenantId,
      staffId: doctorRashadId,
      serviceId: serviceImplantId,
      customerName: 'Gunel Abbasova',
      customerEmail: 'gunel.a@example.com',
      customerPhone: '+994 55 222 3456',
      startTime: daysOffset(3, 14, 0),
      endTime: daysOffset(3, 15, 0),
      status: 'confirmed' as const,
      paymentStatus: 'deposit_paid' as const,
      stripePaymentIntentId: 'pi_test_zenith_upcoming_02',
      notes: 'CBCT scan booked prior to consultation.',
    },
  ];

  for (const b of upcomingBookingsData) {
    await db.insert(bookings).values(b);
  }
  console.log('✅ 2 Upcoming confirmed bookings created');

  const sixMonthsFromNow = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
  await db.insert(recallReminders).values({
    tenantId,
    customerEmail: 'aysel.huseynova@example.com',
    customerName: 'Aysel Huseynova',
    customerPhone: '+994 50 123 4567',
    lastVisitDate: daysOffset(-10, 10, 0),
    recallDueDate: sixMonthsFromNow,
    status: 'scheduled',
  });

  await db.insert(recallReminders).values({
    tenantId,
    customerEmail: 'fuad.m@example.com',
    customerName: 'Fuad Mammadov',
    customerPhone: '+994 55 987 6543',
    lastVisitDate: daysOffset(-7, 11, 0),
    recallDueDate: sixMonthsFromNow,
    status: 'scheduled',
  });
  console.log('✅ 2 Automated hygiene recall reminders scheduled');
}
