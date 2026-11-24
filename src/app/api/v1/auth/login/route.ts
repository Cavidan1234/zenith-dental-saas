import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, ensureSeeded } from '@/lib/db';
import { users, staff } from '@/lib/db/schema';
import { DETERMINISTIC_IDS } from '@/lib/db/constants';
import { signSessionToken, SESSION_COOKIE_NAME, type SessionRole } from '@/lib/auth/session';
import {
  checkRateLimit,
  createRateLimitResponse,
  AUTH_LOGIN_LIMIT,
} from '@/lib/security/rateLimiter';
import { sanitizeEmail } from '@/lib/security/sanitizer';

export const dynamic = 'force-dynamic';

// Precomputed 10-round bcrypt hash used to equalize response timing when user is absent or role is invalid.
const DUMMY_BCRYPT_HASH = '$2b$10$E/KSOhaVkatzgi4O1gx6zuvcmgubLRccIYXprhaj93TiYAtQXheeS';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting check (brute-force defense)
    const rateLimit = checkRateLimit(request, AUTH_LOGIN_LIMIT);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit);
    }

    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Invalid clinical credentials. Please verify your email and password.' },
        { status: 401 }
      );
    }

    // Ensure database is initialized & seeded
    await ensureSeeded();

    const normalizedEmail = sanitizeEmail(email);
    if (!normalizedEmail) {
      return NextResponse.json(
        { error: 'Invalid clinical credentials. Please verify your email and password.' },
        { status: 401 }
      );
    }

    // Query user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      await bcrypt.compare(password, DUMMY_BCRYPT_HASH);
      return NextResponse.json(
        { error: 'Invalid clinical credentials. Please verify your email and password.' },
        { status: 401 }
      );
    }

    // Verify role (staff or owner only)
    if (user.role !== 'owner' && user.role !== 'staff') {
      await bcrypt.compare(password, DUMMY_BCRYPT_HASH);
      return NextResponse.json(
        { error: 'Invalid clinical credentials. Please verify your email and password.' },
        { status: 401 }
      );
    }

    const sessionRole: SessionRole = user.role;

    // Verify password hash asynchronously (non-blocking)
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid clinical credentials. Please verify your email and password.' },
        { status: 401 }
      );
    }

    // Relational staff profile lookup via staff.userId
    const [staffProfile] = await db
      .select()
      .from(staff)
      .where(eq(staff.userId, user.id))
      .limit(1);

    if (staffProfile && !staffProfile.isActive) {
      return NextResponse.json(
        { error: 'Clinical staff account is currently inactive.' },
        { status: 401 }
      );
    }

    if (!staffProfile && user.role !== 'owner') {
      return NextResponse.json(
        { error: 'Invalid clinical credentials. Please verify your email and password.' },
        { status: 401 }
      );
    }

    const staffId =
      staffProfile?.id === DETERMINISTIC_IDS.doctorRashad
        ? 'doc-rashad'
        : staffProfile?.id === DETERMINISTIC_IDS.doctorLeyla
        ? 'doc-leyla'
        : staffProfile?.id || '';
    const title = staffProfile?.title || 'Clinic Owner';
    const tenantId = user.tenantId || staffProfile?.tenantId || DETERMINISTIC_IDS.tenant;

    // Sign session token
    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: sessionRole,
      staffId,
      title,
      tenantId,
    });

    const userPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: sessionRole,
      staffId,
      title,
      tenantId,
    };

    const response = NextResponse.json({
      success: true,
      user: userPayload,
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 604800,
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    console.error('[AUTH_LOGIN_ERROR]', error);
    return NextResponse.json(
      { error: 'An unexpected clinical authentication error occurred.' },
      { status: 500 }
    );
  }
}
