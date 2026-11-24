import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export interface RegisteredTenant {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
  brandColor: string;
  theme: string;
  depositAmount: number;
  bufferMinutes: number;
  surgeriesCount: number;
  leadSurgeon: string;
  leadSpecialty: string;
  createdAt: string;
}

// In-memory global store across server lifetime
const defaultTenants: Record<string, RegisteredTenant> = {
  'zenith-dental': {
    id: 't-zenith-01',
    name: 'Zenith Dental & Esthetics',
    slug: 'zenith-dental',
    address: '14 Harley Street, Marylebone, London W1G 9PR',
    phone: '+44 20 7946 0991',
    email: 'concierge@zenithdental.co.uk',
    brandColor: '#0f766e',
    theme: 'harley_azure',
    depositAmount: 50,
    bufferMinutes: 15,
    surgeriesCount: 4,
    leadSurgeon: 'Dr. Leyla Mammadova',
    leadSpecialty: 'Restorative & Cosmetic Orthodontics',
    createdAt: new Date().toISOString(),
  },
  'mayfair-dental': {
    id: 't-mayfair-02',
    name: 'Mayfair Esthetic Surgery & Dental',
    slug: 'mayfair-dental',
    address: '28 Berkeley Square, Mayfair, London W1J 6EN',
    phone: '+44 20 7946 0882',
    email: 'concierge@mayfairdental.co.uk',
    brandColor: '#090d16',
    theme: 'mayfair_obsidian',
    depositAmount: 75,
    bufferMinutes: 15,
    surgeriesCount: 3,
    leadSurgeon: 'Dr. Alistair Sterling',
    leadSpecialty: 'Oral Maxillofacial Surgery & 3D Implants',
    createdAt: new Date().toISOString(),
  },
};

// Global reference declaration to survive HMR in dev mode
declare global {
  // eslint-disable-next-line no-var
  var __dentalbook_tenants: Record<string, RegisteredTenant> | undefined;
}

if (!global.__dentalbook_tenants) {
  global.__dentalbook_tenants = { ...defaultTenants };
}

const tenantSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  address: z.string().min(5),
  phone: z.string().min(6),
  email: z.string().email(),
  brandColor: z.string().optional().default('#0f766e'),
  theme: z.string().optional().default('harley_azure'),
  depositAmount: z.number().optional().default(50),
  bufferMinutes: z.number().optional().default(15),
  surgeriesCount: z.number().optional().default(2),
  leadSurgeon: z.string().min(2),
  leadSpecialty: z.string().min(2),
});

export async function GET() {
  const tenantsList = Object.values(global.__dentalbook_tenants || defaultTenants);
  return NextResponse.json({
    total: tenantsList.length,
    tenants: tenantsList,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = tenantSchema.parse(body);

    const slug = validated.slug.toLowerCase();

    if (global.__dentalbook_tenants && global.__dentalbook_tenants[slug]) {
      return NextResponse.json(
        {
          error: `A dental practice with slug "${slug}" is already registered.`,
          code: 'TENANT_SLUG_EXISTS',
        },
        { status: 409 }
      );
    }

    const newTenant: RegisteredTenant = {
      id: `t-${slug}-${Date.now().toString(36)}`,
      name: validated.name,
      slug,
      address: validated.address,
      phone: validated.phone,
      email: validated.email,
      brandColor: validated.brandColor,
      theme: validated.theme,
      depositAmount: validated.depositAmount,
      bufferMinutes: validated.bufferMinutes,
      surgeriesCount: validated.surgeriesCount,
      leadSurgeon: validated.leadSurgeon,
      leadSpecialty: validated.leadSpecialty,
      createdAt: new Date().toISOString(),
    };

    if (!global.__dentalbook_tenants) {
      global.__dentalbook_tenants = { ...defaultTenants };
    }

    global.__dentalbook_tenants[slug] = newTenant;

    return NextResponse.json(
      {
        success: true,
        tenant: newTenant,
        message: `Dental practice "${newTenant.name}" successfully provisioned on DentalBook.os.`,
        storefrontUrl: `/b/${newTenant.slug}`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
