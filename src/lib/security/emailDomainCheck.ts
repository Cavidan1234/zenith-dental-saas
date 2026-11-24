import dns from 'node:dns/promises';
import {
  extractEmailParts,
  isReservedOrTestDomain,
  validateEmailSyntaxAndDomainPolicy,
  type EmailPolicyValidationResult,
} from './emailValidation';

export interface EmailDomainVerificationResult extends EmailPolicyValidationResult {
  skippedReserved?: boolean;
}

const DNS_TIMEOUT_MS = 2500;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      const err = new Error('DNS lookup timed out') as NodeJS.ErrnoException;
      err.code = 'ETIMEOUT';
      reject(err);
    }, timeoutMs);

    promise.then(
      (val) => {
        clearTimeout(timer);
        resolve(val);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

/**
 * Server-side email domain verification:
 * 1. Validates syntax and blocks known typos (e.g. gmail.con).
 * 2. Allows RFC-reserved/test domains cleanly (simulated in sender.ts).
 * 3. Verifies DNS MX records (with OS lookup fallback when local UDP DNS stub is unreachable).
 */
export async function verifyEmailDomainCanReceiveMail(
  email: string
): Promise<EmailDomainVerificationResult> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) {
    return { valid: true };
  }

  const policy = validateEmailSyntaxAndDomainPolicy(trimmed);
  if (!policy.valid) {
    return policy;
  }

  if (isReservedOrTestDomain(trimmed)) {
    return { valid: true, skippedReserved: true };
  }

  const parts = extractEmailParts(trimmed);
  if (!parts) {
    return {
      valid: false,
      code: 'INVALID_EMAIL_FORMAT',
      error: 'Please enter a valid email address.',
    };
  }

  const { domain } = parts;

  try {
    const mxRecords = await withTimeout(dns.resolveMx(domain), DNS_TIMEOUT_MS);
    const hasValidMx = Array.isArray(mxRecords) && mxRecords.some((r) => r.exchange && r.exchange !== '.');
    if (!hasValidMx) {
      return {
        valid: false,
        code: 'INVALID_EMAIL_DOMAIN',
        error: `Email domain "${domain}" is not configured to receive mail. Please check for typos.`,
      };
    }
    return { valid: true };
  } catch (err: any) {
    const code = err?.code;
    if (code === 'ENOTFOUND' || code === 'ENODATA' || code === 'NXDOMAIN') {
      return {
        valid: false,
        code: 'INVALID_EMAIL_DOMAIN',
        error: `Email domain "${domain}" does not exist or has no mail server (MX). Please check for typos.`,
      };
    }

    // Fallback to OS resolver if c-ares DNS stub is unreachable (e.g. local sandbox ECONNREFUSED)
    try {
      await withTimeout(dns.lookup(domain), DNS_TIMEOUT_MS);
      return { valid: true };
    } catch (lookupErr: any) {
      if (lookupErr?.code === 'ENOTFOUND') {
        return {
          valid: false,
          code: 'INVALID_EMAIL_DOMAIN',
          error: `Email domain "${domain}" does not exist. Please check for typos.`,
        };
      }
      // Transient DNS timeout/offline error should not break bookings for valid domains
      return { valid: true };
    }
  }
}
