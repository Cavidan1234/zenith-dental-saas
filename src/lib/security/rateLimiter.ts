import { NextRequest, NextResponse } from 'next/server';

export interface RateLimitOptions {
  limit: number;
  windowSeconds: number;
  keyPrefix: string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
  resetTime: number;
}

/**
 * Global in-memory storage for sliding-window rate limiting.
 * Bound to globalThis to survive development hot-reloads in Next.js.
 */
interface GlobalWithRateLimit {
  __zenithRateLimitStore?: Map<string, number[]>;
}

const globalObj = globalThis as unknown as GlobalWithRateLimit;
if (!globalObj.__zenithRateLimitStore) {
  globalObj.__zenithRateLimitStore = new Map<string, number[]>();
}
const rateLimitStore = globalObj.__zenithRateLimitStore;

let requestCounter = 0;

/**
 * Periodically cleans up expired rate limit entries to prevent memory leaks.
 */
function pruneExpiredEntries(now: number): void {
  requestCounter++;
  // Every 250 requests, purge entries whose timestamps are all expired
  if (requestCounter % 250 === 0) {
    rateLimitStore.forEach((timestamps: number[], key: string) => {
      const valid = timestamps.filter((ts: number) => ts > now - 120_000);
      if (valid.length === 0) {
        rateLimitStore.delete(key);
      } else if (valid.length !== timestamps.length) {
        rateLimitStore.set(key, valid);
      }
    });
  }
}

function extractRightmostIp(headerValue: string | null): string | null {
  if (!headerValue) return null;
  const parts = headerValue
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : null;
}

/**
 * Reliably extracts the client IP address without trusting client-spoofable headers.
 */
export function getClientIp(request: NextRequest): string {
  // 1. Platform-supplied socket/edge IP (cannot be forged by client headers)
  const requestIp = (request as { ip?: string }).ip;
  if (requestIp && typeof requestIp === 'string' && requestIp.trim()) {
    return requestIp.trim();
  }

  // 2. Trust forwarding headers only behind a verified reverse proxy (e.g. Vercel Edge)
  const behindTrustedProxy =
    process.env.VERCEL === '1' || process.env.TRUST_PROXY === 'true';

  if (behindTrustedProxy) {
    const vercelIp = extractRightmostIp(request.headers.get('x-vercel-forwarded-for'));
    if (vercelIp) return vercelIp;

    const cfIp = request.headers.get('cf-connecting-ip')?.trim();
    if (cfIp) return cfIp;

    const realIp = request.headers.get('x-real-ip')?.trim();
    if (realIp) return realIp;

    // Use rightmost IP appended by the trusted proxy; leftmost entries are client-spoofable
    const forwardedForIp = extractRightmostIp(request.headers.get('x-forwarded-for'));
    if (forwardedForIp) return forwardedForIp;
  }

  return '127.0.0.1';
}

/**
 * Checks and updates rate limits using a sliding window algorithm.
 */
export function checkRateLimit(
  req: NextRequest,
  options: { limit: number; windowSeconds: number; keyPrefix: string }
): RateLimitResult {
  const ip = getClientIp(req);
  const key = `${options.keyPrefix}:${ip}`;
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;
  const windowStart = now - windowMs;

  pruneExpiredEntries(now);

  const existingHits = rateLimitStore.get(key) || [];
  // Keep only hits within the active sliding window
  const activeHits = existingHits.filter((timestamp: number) => timestamp > windowStart);

  if (activeHits.length >= options.limit) {
    // Rate limit exceeded
    const oldestHit = activeHits[0];
    const retryAfterMs = Math.max(0, oldestHit + windowMs - now);
    const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
    const resetTime = Math.ceil((oldestHit + windowMs) / 1000);

    rateLimitStore.set(key, activeHits);

    return {
      allowed: false,
      limit: options.limit,
      remaining: 0,
      retryAfterSeconds,
      resetTime,
    };
  }

  // Allow request and record current timestamp
  activeHits.push(now);
  rateLimitStore.set(key, activeHits);

  const remaining = Math.max(0, options.limit - activeHits.length);
  const oldestHit = activeHits[0];
  const resetTime = Math.ceil((oldestHit + windowMs) / 1000);

  return {
    allowed: true,
    limit: options.limit,
    remaining,
    retryAfterSeconds: 0,
    resetTime,
  };
}

/**
 * Pre-configured rate limiting rules for clinical operations.
 */
export const AUTH_LOGIN_LIMIT: RateLimitOptions = {
  limit: 5,
  windowSeconds: 60,
  keyPrefix: 'auth_login',
};

export const BOOKING_POST_LIMIT: RateLimitOptions = {
  limit: 8,
  windowSeconds: 60,
  keyPrefix: 'booking_post',
};

export const EMAIL_SEND_LIMIT: RateLimitOptions = {
  limit: 3,
  windowSeconds: 60,
  keyPrefix: 'email_send',
};

export const GENERAL_API_LIMIT: RateLimitOptions = {
  limit: 60,
  windowSeconds: 60,
  keyPrefix: 'general_api',
};

/**
 * Standard 429 Too Many Requests response builder.
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      error: 'Too many requests. Please slow down and try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: result.retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.retryAfterSeconds),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
      },
    }
  );
}

/**
 * Clears the rate limiter store (useful for test resets).
 */
export function resetRateLimits(): void {
  rateLimitStore.clear();
}
