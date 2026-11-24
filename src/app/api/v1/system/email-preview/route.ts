import { NextRequest, NextResponse } from 'next/server';
import {
  renderBookingConfirmationHtml,
  BookingConfirmationEmailProps,
} from '@/lib/email/templates/bookingConfirmation';
import { sendBookingConfirmationEmail } from '@/lib/email/sender';
import { getSessionFromRequest } from '@/lib/auth/session';
import {
  checkRateLimit,
  createRateLimitResponse,
  EMAIL_SEND_LIMIT,
} from '@/lib/security/rateLimiter';
import {
  sanitizeEmail,
  sanitizePatientName,
  sanitizeText,
} from '@/lib/security/sanitizer';

export const dynamic = 'force-dynamic';

const ALLOWED_PREVIEW_ROLES = new Set(['owner', 'staff']);

const SAMPLE_DATA: BookingConfirmationEmailProps = {
  bookingCode: 'ZD-749201',
  patientName: 'Sarah Jenkins',
  patientEmail: 'sarah.jenkins@example.com',
  doctorName: 'Dr. Leyla Mammadova',
  doctorTitle: 'Lead Aesthetic Dentist & Orthodontist',
  doctorSuite: 'Harley Street Suite A (Floor 2)',
  serviceName: 'Comprehensive 3D Exam & Prophylaxis',
  serviceCategory: 'Diagnostic & Preventive',
  durationMinutes: 45,
  dateFormatted: 'Tuesday, November 10, 2026',
  timeFormatted: '14:45',
  depositAmount: 25,
  totalPrice: 80,
  paymentMethod: 'Credit Card / Google Pay',
  clinicAddress: '42 Harley Street, Marylebone, London, W1G 9PR',
  clinicPhone: '+44 20 7946 0991',
};

async function enforceStaffAuth(request: NextRequest): Promise<NextResponse | null> {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json(
      {
        status: 'error',
        code: 'UNAUTHORIZED',
        error: 'Clinical staff authentication required.',
      },
      {
        status: 401,
        headers: { 'X-Content-Type-Options': 'nosniff' },
      }
    );
  }

  if (!ALLOWED_PREVIEW_ROLES.has(session.role)) {
    return NextResponse.json(
      {
        status: 'error',
        code: 'FORBIDDEN',
        error: 'Insufficient permissions for this clinical resource.',
      },
      {
        status: 403,
        headers: { 'X-Content-Type-Options': 'nosniff' },
      }
    );
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const authErrorResponse = await enforceStaffAuth(request);
    if (authErrorResponse) {
      return authErrorResponse;
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');
    const rawPatient = searchParams.get('patient');
    const rawDoctor = searchParams.get('doctor');
    const rawService = searchParams.get('service');
    const rawTime = searchParams.get('time');
    const rawCode = searchParams.get('code');
    const rawNotes = searchParams.get('notes');

    const patient = (rawPatient ? sanitizePatientName(rawPatient) : '') || SAMPLE_DATA.patientName;
    const doctor = (rawDoctor ? sanitizeText(rawDoctor, 100) : '') || SAMPLE_DATA.doctorName;
    const service = (rawService ? sanitizeText(rawService, 120) : '') || SAMPLE_DATA.serviceName;
    const time = (rawTime ? sanitizeText(rawTime, 40) : '') || SAMPLE_DATA.timeFormatted;
    const code = (rawCode ? sanitizeText(rawCode, 32) : '') || SAMPLE_DATA.bookingCode;
    const notes = rawNotes ? sanitizeText(rawNotes, 300) || undefined : undefined;

    const emailProps: BookingConfirmationEmailProps = {
      ...SAMPLE_DATA,
      bookingCode: code,
      patientName: patient,
      doctorName: doctor,
      serviceName: service,
      timeFormatted: time,
      ...(notes ? { notes } : {}),
    };

    const html = renderBookingConfirmationHtml(emailProps);

    if (format === 'json') {
      return NextResponse.json(
        {
          success: true,
          bookingCode: emailProps.bookingCode,
          recipient: emailProps.patientEmail,
          subject: `Appointment Confirmed: ${emailProps.serviceName} with ${emailProps.doctorName} [${emailProps.bookingCode}]`,
          html,
        },
        {
          headers: {
            'X-Content-Type-Options': 'nosniff',
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    // Return live HTML directly to browser with strict CSP sandbox
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'",
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    console.error('[Email Preview GET Error]:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to render email preview.' },
      {
        status: 500,
        headers: { 'X-Content-Type-Options': 'nosniff' },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authErrorResponse = await enforceStaffAuth(request);
    if (authErrorResponse) {
      return authErrorResponse;
    }

    // Rate limit check: Anti-email bombing defense
    const rateLimit = checkRateLimit(request, EMAIL_SEND_LIMIT);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit);
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid JSON request body.' },
        {
          status: 400,
          headers: { 'X-Content-Type-Options': 'nosniff' },
        }
      );
    }

    const rawTarget = (body as Record<string, unknown>).to || (body as Record<string, unknown>).email;
    const targetEmail = sanitizeEmail(typeof rawTarget === 'string' ? rawTarget : '');

    if (!targetEmail) {
      return NextResponse.json(
        { error: 'A valid recipient email address ("to" or "email") is required.' },
        {
          status: 400,
          headers: { 'X-Content-Type-Options': 'nosniff' },
        }
      );
    }

    const rawPatientName = (body as Record<string, unknown>).patientName;
    const rawBookingCode = (body as Record<string, unknown>).bookingCode;
    const rawNotes = (body as Record<string, unknown>).notes;

    const cleanPatientName =
      typeof rawPatientName === 'string' && rawPatientName.trim()
        ? sanitizePatientName(rawPatientName) || SAMPLE_DATA.patientName
        : SAMPLE_DATA.patientName;

    const cleanBookingCode =
      typeof rawBookingCode === 'string' && rawBookingCode.trim()
        ? sanitizeText(rawBookingCode, 32) || `ZD-${Math.floor(100000 + Math.random() * 900000)}`
        : `ZD-${Math.floor(100000 + Math.random() * 900000)}`;

    const cleanNotes =
      typeof rawNotes === 'string' && rawNotes.trim()
        ? sanitizeText(rawNotes, 300) || undefined
        : undefined;

    const emailProps: BookingConfirmationEmailProps = {
      ...SAMPLE_DATA,
      patientEmail: targetEmail,
      patientName: cleanPatientName,
      bookingCode: cleanBookingCode,
      ...(cleanNotes ? { notes: cleanNotes } : {}),
    };

    const result = await sendBookingConfirmationEmail(emailProps);

    return NextResponse.json(
      {
        success: result.success,
        message: result.simulated
          ? 'Email generated & simulated in Sandbox mode. Ready for Gmail credentials.'
          : 'Email transmitted successfully via Gmail SMTP.',
        details: result,
      },
      {
        headers: { 'X-Content-Type-Options': 'nosniff' },
      }
    );
  } catch (error: any) {
    console.error('[Email Preview POST Error]:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to dispatch test email.' },
      {
        status: 500,
        headers: { 'X-Content-Type-Options': 'nosniff' },
      }
    );
  }
}
