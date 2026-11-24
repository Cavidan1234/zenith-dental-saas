import { db } from '../index';
import { staff, staffSchedules } from '../schema';

export async function seedStaffAndSchedules(tenantId: string, userLeylaId: string, userRashadId: string) {
  // Insert Staff Profiles
  const [doctorLeyla] = await db
    .insert(staff)
    .values({
      tenantId,
      userId: userLeylaId,
      title: 'Lead Orthodontist & Aesthetician',
      bio: 'Dr. Leyla Mammadova specializes in invisible orthodontics, porcelain veneers, and digital smile design with over 14 years of clinical precision.',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
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
      tenantId,
      userId: userRashadId,
      title: 'Oral Surgeon & Senior Implantologist',
      bio: 'Dr. Rashad Aliyev is an internationally certified maxillofacial surgeon focused on guided 3D implant placement and full arch dental restorations.',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
      specializations: [
        'Guided Dental Implants',
        'All-on-4 / All-on-6 Restoration',
        'Bone Grafting & Sinus Lift',
        'Complex Wisdom Tooth Surgery',
      ],
      isActive: true,
    })
    .returning();

  console.log('✅ Doctor profiles initialized');

  // Insert Schedules for both doctors (Mon-Fri: 09:00 - 18:00, Sat: 10:00 - 15:00)
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

  return { doctorLeyla, doctorRashad };
}
