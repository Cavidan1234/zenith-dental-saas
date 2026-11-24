import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Signed out successfully.',
  });

  response.cookies.set(SESSION_COOKIE_NAME, '', {
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  });

  return response;
}
