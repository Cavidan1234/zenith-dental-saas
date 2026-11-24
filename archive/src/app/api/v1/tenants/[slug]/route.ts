import { NextRequest, NextResponse } from 'next/server';
import { RegisteredTenant } from '../route';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cleanSlug = (slug || '').toLowerCase();

    const tenantsMap = (global as any).__dentalbook_tenants || {};
    const tenant: RegisteredTenant | undefined = tenantsMap[cleanSlug];

    if (!tenant) {
      return NextResponse.json(
        {
          error: `Dental practice with slug "${cleanSlug}" was not found in registry.`,
          code: 'TENANT_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Default specialists and surgery suites
    const staff = [
      {
        id: `doc-${cleanSlug}-lead`,
        name: tenant.leadSurgeon,
        title: tenant.leadSpecialty,
        role: 'Lead Specialist & Surgeon',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300',
        available: true,
      },
      {
        id: `doc-${cleanSlug}-hygiene`,
        name: 'Dr. Sarah Jenkins',
        title: 'Preventive Oral Hygiene & Whitening',
        role: 'Senior Dental Hygienist',
        avatar: 'https://images.unsplash.com/photo-1594824813576-a05d424b901b?w=300',
        available: true,
      },
    ];

    const services = [
      {
        id: 'srv-consult',
        name: '3D Comprehensive Exam & Treatment Planning',
        duration: 45,
        price: 150,
        depositAmount: tenant.depositAmount,
      },
      {
        id: 'srv-whitening',
        name: 'Laser Teeth Whitening (In-Office)',
        duration: 60,
        price: 450,
        depositAmount: tenant.depositAmount,
      },
      {
        id: 'srv-implants',
        name: 'Dental Implant Consultation & 3D CBCT',
        duration: 60,
        price: 250,
        depositAmount: tenant.depositAmount,
      },
    ];

    return NextResponse.json({
      tenant,
      staff,
      services,
      operationalCapacity: {
        surgeriesCount: tenant.surgeriesCount,
        bufferMinutes: tenant.bufferMinutes,
        workingHours: { start: '09:00', end: '18:00' },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
