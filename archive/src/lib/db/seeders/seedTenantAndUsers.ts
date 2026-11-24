import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { tenants, users } from '../schema';

export async function seedTenantAndUsers() {
  // Check if tenant already exists; clean up for fresh seed if needed
  const existingTenant = await db.query.tenants.findFirst({
    where: eq(tenants.slug, 'zenith-dental'),
  });

  if (existingTenant) {
    console.log('🔄 Cleaning up existing data for tenant "zenith-dental"...');
    await db.delete(tenants).where(eq(tenants.id, existingTenant.id));
  }

  // Insert Tenant: "Zenith Dental & Esthetics"
  const [tenant] = await db
    .insert(tenants)
    .values({
      name: 'Zenith Dental & Esthetics',
      slug: 'zenith-dental',
      logoUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300',
      brandColor: '#0f766e',
      timezone: 'Asia/Baku',
      currency: 'USD',
      depositAmountCents: 2500, // $25 default deposit
    })
    .returning();

  console.log(`✅ Tenant created: "${tenant.name}" (${tenant.id})`);

  // Insert Users
  const passwordHash = bcrypt.hashSync('Zenith2026!', 10);

  const [userLeyla] = await db
    .insert(users)
    .values({
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
      tenantId: tenant.id,
      email: 'rashad.aliyev@zenithdental.com',
      passwordHash,
      role: 'staff',
      name: 'Dr. Rashad Aliyev',
      phone: '+994 12 555 0102',
    })
    .returning();

  console.log('✅ Staff users created (Dr. Leyla & Dr. Rashad)');

  return { tenant, userLeyla, userRashad };
}
