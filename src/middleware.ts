import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth/session';

const DEV_ALLOWED_CSRF_HOSTS = new Set([
  'localhost:3000',
  '127.0.0.1:3000',
  'localhost',
  '127.0.0.1',
]);

/**
 * Standard enterprise-grade security headers applied to all responses.
 */
function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '0');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  return response;
}

/**
 * Validates an Origin or Referer URL host against the request host,
 * allowing local dev hosts strictly outside production.
 */
function isAllowedCsrfSource(headerValue: string, requestHost: string): boolean {
  const sourceUrl = new URL(headerValue);
  const sourceHost = sourceUrl.host;

  if (requestHost && sourceHost === requestHost) {
    return true;
  }

  if (process.env.NODE_ENV !== 'production' && DEV_ALLOWED_CSRF_HOSTS.has(sourceHost)) {
    return true;
  }

  return false;
}

/**
 * Default-deny API access policy: only explicitly whitelisted public endpoints
 * may be invoked without a valid clinical staff session cookie.
 */
function isPublicApiEndpoint(pathname: string, method: string): boolean {
  if (pathname === '/api/v1/availability' && method === 'GET') {
    return true;
  }
  if (pathname === '/api/v1/bookings' && method === 'POST') {
    return true;
  }
  if (pathname === '/api/v1/auth/login' && method === 'POST') {
    return true;
  }
  if (pathname === '/api/v1/auth/logout' && method === 'POST') {
    return true;
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // SEC-04: Exempt signed webhook POST routes (protected by cryptographic signatures like Stripe-Signature)
  // before browser CSRF Origin/Referer validation.
  if (pathname.startsWith('/api/v1/webhooks/') && request.method === 'POST') {
    return applySecurityHeaders(NextResponse.next());
  }

  // 1. CSRF & Cross-Site Origin Shield for mutating API calls
  const isMutatingApi =
    pathname.startsWith('/api/') &&
    ['POST', 'PATCH', 'PUT', 'DELETE'].includes(request.method);

  if (isMutatingApi) {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host') || request.nextUrl.host;

    if (origin) {
      try {
        if (!isAllowedCsrfSource(origin, host)) {
          return applySecurityHeaders(
            NextResponse.json(
              {
                error: 'Cross-Site Request Forgery (CSRF) origin verification failed.',
                code: 'FORBIDDEN_CROSS_ORIGIN',
              },
              { status: 403 }
            )
          );
        }
      } catch {
        return applySecurityHeaders(
          NextResponse.json(
            {
              error: 'Malformed origin header rejected.',
              code: 'INVALID_ORIGIN',
            },
            { status: 403 }
          )
        );
      }
    } else if (referer) {
      try {
        if (!isAllowedCsrfSource(referer, host)) {
          return applySecurityHeaders(
            NextResponse.json(
              {
                error: 'Cross-Site Request Forgery (CSRF) referer verification failed.',
                code: 'FORBIDDEN_CROSS_ORIGIN',
              },
              { status: 403 }
            )
          );
        }
      } catch {
        return applySecurityHeaders(
          NextResponse.json(
            {
              error: 'Malformed referer header rejected.',
              code: 'INVALID_REFERER',
            },
            { status: 403 }
          )
        );
      }
    } else {
      // When both Origin and Referer are absent, reject Fetch Metadata cross-site mutations
      const secFetchSite = request.headers.get('sec-fetch-site')?.toLowerCase().trim();
      if (secFetchSite === 'cross-site') {
        return applySecurityHeaders(
          NextResponse.json(
            {
              error: 'Cross-Site Request Forgery (CSRF) Sec-Fetch-Site verification failed.',
              code: 'FORBIDDEN_CROSS_ORIGIN',
            },
            { status: 403 }
          )
        );
      }
    }
  }

  // 2. Default-Deny API Protection (explicit public endpoint whitelist; all others require session)
  if (pathname.startsWith('/api/') && !isPublicApiEndpoint(pathname, request.method)) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);

    if (!session) {
      return applySecurityHeaders(
        NextResponse.json(
          {
            status: 'error',
            code: 'UNAUTHORIZED',
            message: 'Clinical staff authentication required.',
          },
          { status: 401 }
        )
      );
    }
  }

  // 3. Protected UI Pages (/dashboard and /explorer)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/explorer')) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);

    if (!session) {
      const loginUrl = new URL(
        `/login?redirect=${encodeURIComponent(pathname)}`,
        request.url
      );
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  // 4. Authenticated redirect away from login page
  if (pathname === '/login') {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);

    if (session) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return applySecurityHeaders(NextResponse.redirect(dashboardUrl));
    }
  }

  // 5. Pass through with full security headers
  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Match all requests except static assets and image files:
     * - _next/static (static build files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     * - public assets with media extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
