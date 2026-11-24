import { NextResponse } from 'next/server';
import {
  getSessionFromRequest,
  type SessionRequestLike,
  type SessionRole,
  type SessionUser,
} from '@/lib/auth/session';

export const CLINICAL_STAFF_ROLES: readonly SessionRole[] = ['owner', 'staff'] as const;

export type AuthGuardResult =
  | { authenticated: true; user: SessionUser; response?: never }
  | { authenticated: false; user?: never; response: NextResponse };

/**
 * Route-handler defense-in-depth authentication and RBAC guard.
 * Default-deny: requires a non-empty allowedRoles list.
 * Returns 401 when unauthenticated, 403 when authenticated role is not permitted.
 */
export async function requireAuth(
  request: SessionRequestLike,
  allowedRoles: readonly SessionRole[]
): Promise<AuthGuardResult> {
  const user = await getSessionFromRequest(request);

  if (!user) {
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          status: 'error',
          code: 'UNAUTHORIZED',
          error: 'Clinical staff authentication required.',
          message: 'Clinical staff authentication required.',
        },
        { status: 401 }
      ),
    };
  }

  if (!allowedRoles || allowedRoles.length === 0 || !allowedRoles.includes(user.role)) {
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          status: 'error',
          code: 'FORBIDDEN',
          error: 'Insufficient permissions for this clinical resource.',
          message: 'Insufficient permissions for this clinical resource.',
        },
        { status: 403 }
      ),
    };
  }

  return {
    authenticated: true,
    user,
  };
}
