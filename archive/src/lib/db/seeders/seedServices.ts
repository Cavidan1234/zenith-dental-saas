import { db } from '../index';
import { services } from '../schema';

export async function seedServices(tenantId: string) {
  const [serviceCheckup] = await db
    .insert(services)
    .values({
      tenantId,
      name: 'Comprehensive Dental Check-up & 3D Scan',
      slug: 'comprehensive-checkup-3d-scan',
      description: 'High-definition intraoral 3D scanning, digital cavity mapping, and comprehensive treatment planning consultation.',
      durationMinutes: 45,
      bufferMinutes: 15,
      priceCents: 8000, // $80.00
      depositCents: 2500, // $25.00
      category: 'Diagnostics',
      isActive: true,
    })
    .returning();

  const [serviceWhitening] = await db
    .insert(services)
    .values({
      tenantId,
      name: 'Laser Teeth Whitening',
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

  const [serviceVeneer] = await db
    .insert(services)
    .values({
      tenantId,
      name: 'Porcelain Veneer Consultation',
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
      tenantId,
      name: 'Dental Implant Consultation & Planning',
      slug: 'dental-implant-planning',
      description: 'Cone Beam CT scan analysis, computer-guided surgical 3D planning, and titanium implant feasibility assessment.',
      durationMinutes: 60,
      bufferMinutes: 15,
      priceCents: 15000, // $150.00
      depositCents: 5000, // $50.00
      category: 'Surgery',
      isActive: true,
    })
    .returning();

  console.log('✅ 4 Specialized clinical services registered');

  return { serviceCheckup, serviceWhitening, serviceVeneer, serviceImplant };
}
