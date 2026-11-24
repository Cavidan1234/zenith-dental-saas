export const SESSION_COOKIE_NAME = 'zenith_admin_session';

export type SessionRole = 'owner' | 'staff';

export interface SessionUser {
  userId: string;
  email: string;
  name: string;
  role: SessionRole;
  staffId: string;
  title: string;
  tenantId: string;
  exp: number;
}

export interface SessionRequestLike {
  headers: Pick<Headers, 'get'>;
  cookies?: {
    get(name: string): { value: string } | undefined;
  };
}

declare global {
  // eslint-disable-next-line no-var
  var __zenith_ephemeral_auth_secret: string | undefined;
  // eslint-disable-next-line no-var
  var __zenith_ephemeral_auth_warned: boolean | undefined;
}

function getAuthSecret(): string {
  const envSecret = process.env.AUTH_SECRET?.trim();
  if (envSecret) {
    return envSecret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      '[SEC-05] AUTH_SECRET environment variable is required in production and cannot be empty.'
    );
  }

  if (!globalThis.__zenith_ephemeral_auth_secret) {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    globalThis.__zenith_ephemeral_auth_secret = bytesToBase64Url(randomBytes);
    if (!globalThis.__zenith_ephemeral_auth_warned) {
      globalThis.__zenith_ephemeral_auth_warned = true;
      console.warn(
        '[SEC-05] AUTH_SECRET is not set; generated an ephemeral per-process secret for non-production runtime.'
      );
    }
  }

  return globalThis.__zenith_ephemeral_auth_secret;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlToBytes(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const secret = getAuthSecret();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Signs a session payload using HMAC-SHA256 via Web Crypto API (Edge and Node compatible).
 */
export async function signSessionToken(
  payload: Omit<SessionUser, 'exp'>,
  ttlSeconds = 604800
): Promise<string> {
  const enc = new TextEncoder();
  const nowSeconds = Math.floor(Date.now() / 1000);
  const sessionUser: SessionUser = {
    ...payload,
    exp: nowSeconds + ttlSeconds,
  };

  const dataB64 = bytesToBase64Url(enc.encode(JSON.stringify(sessionUser)));
  const key = await getHmacKey();
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    enc.encode(dataB64) as unknown as BufferSource
  );
  const sigB64 = bytesToBase64Url(new Uint8Array(signatureBuffer));

  return `${dataB64}.${sigB64}`;
}

/**
 * Verifies HMAC-SHA256 signature and expiration of a session token.
 * Returns parsed SessionUser or null if invalid or expired.
 */
export async function verifySessionToken(
  token?: string | null
): Promise<SessionUser | null> {
  // Resolve signing key upfront so missing AUTH_SECRET in production fails loudly.
  const key = await getHmacKey();

  if (!token || typeof token !== 'string') {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return null;
  }

  const [dataB64, sigB64] = parts;
  if (!dataB64 || !sigB64) {
    return null;
  }

  try {
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const sigBytes = base64UrlToBytes(sigB64);
    const dataBytes = enc.encode(dataB64);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes as unknown as BufferSource,
      dataBytes as unknown as BufferSource
    );

    if (!isValid) {
      return null;
    }

    const payloadJson = dec.decode(base64UrlToBytes(dataB64));
    const payload = JSON.parse(payloadJson) as SessionUser;
    const nowSeconds = Math.floor(Date.now() / 1000);

    if (
      !payload ||
      typeof payload !== 'object' ||
      typeof payload.userId !== 'string' ||
      (payload.role !== 'owner' && payload.role !== 'staff') ||
      typeof payload.tenantId !== 'string' ||
      !payload.tenantId ||
      !payload.exp ||
      typeof payload.exp !== 'number' ||
      payload.exp <= nowSeconds
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function parseCookieHeader(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) {
    return null;
  }
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const eqIndex = pair.indexOf('=');
    if (eqIndex === -1) continue;
    const key = pair.slice(0, eqIndex).trim();
    if (key === name) {
      const rawValue = pair.slice(eqIndex + 1).trim();
      try {
        return decodeURIComponent(rawValue);
      } catch {
        return rawValue;
      }
    }
  }
  return null;
}

/**
 * Extracts and verifies the clinical session cookie from a NextRequest or standard Request.
 */
export async function getSessionFromRequest(
  request: SessionRequestLike
): Promise<SessionUser | null> {
  const cookieValue =
    typeof request.cookies?.get === 'function'
      ? request.cookies.get(SESSION_COOKIE_NAME)?.value
      : undefined;
  const token =
    cookieValue ?? parseCookieHeader(request.headers.get('cookie'), SESSION_COOKIE_NAME);
  return verifySessionToken(token);
}
