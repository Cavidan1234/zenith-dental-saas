/**
 * Client- and server-safe email syntax, reserved-domain, and common domain typo checks.
 */

export const RESERVED_TEST_DOMAINS = new Set([
  'example.com',
  'example.org',
  'example.net',
  'test.com',
  'test.org',
  'invalid',
  'localhost',
  'local',
  'zenithdental.com',
  'zenithdental.co.uk',
]);

export const RESERVED_TEST_TLDS = ['.test', '.example', '.invalid', '.localhost'];

export const COMMON_EMAIL_DOMAIN_TYPOS: Record<string, string> = {
  'gmail.con': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gmail.cmo': 'gmail.com',
  'gmail.comm': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gimail.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'yahoo.cm': 'yahoo.com',
  'yhoo.com': 'yahoo.com',
  'hotmal.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'hotmail.cm': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outlook.con': 'outlook.com',
  'outlook.cm': 'outlook.com',
  'icloud.con': 'icloud.com',
  'icloud.cm': 'icloud.com',
  'protonmail.con': 'protonmail.com',
  'proton.con': 'proton.me',
  'mail.r': 'mail.ru',
  'mail.ry': 'mail.ru',
  'yandex.r': 'yandex.ru',
  'yandex.ry': 'yandex.ru',
  'bk.r': 'bk.ru',
  'list.r': 'list.ru',
  'inbox.r': 'inbox.ru',
};

export const INVALID_TLD_TYPOS = new Set([
  'con',
  'cmo',
  'comm',
  'coom',
  'om',
  'vom',
  'xom',
  'orgg',
  'nett',
  'eddu',
]);

const EMAIL_FORMAT_REGEX =
  /^[^\s@]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export function isReservedOrTestDomain(email?: string): boolean {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return false;
  }
  const domain = email.split('@')[1]?.toLowerCase().trim();
  if (!domain) {
    return false;
  }

  if (RESERVED_TEST_DOMAINS.has(domain)) {
    return true;
  }

  for (const tld of RESERVED_TEST_TLDS) {
    if (domain === tld.slice(1) || domain.endsWith(tld)) {
      return true;
    }
  }

  return false;
}

export function extractEmailParts(email: string): { local: string; domain: string; tld: string } | null {
  const trimmed = email.trim().toLowerCase();
  const atIndex = trimmed.indexOf('@');
  if (atIndex <= 0 || atIndex !== trimmed.lastIndexOf('@')) {
    return null;
  }
  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);
  const lastDot = domain.lastIndexOf('.');
  if (lastDot <= 0 || lastDot === domain.length - 1) {
    return null;
  }
  const tld = domain.slice(lastDot + 1);
  return { local, domain, tld };
}

export function suggestEmailDomainFix(email: string): string | null {
  const parts = extractEmailParts(email);
  if (!parts) return null;

  const correctedDomain = COMMON_EMAIL_DOMAIN_TYPOS[parts.domain];
  if (correctedDomain) {
    return `${parts.local}@${correctedDomain}`;
  }

  if (parts.tld === 'con' && parts.domain.length > 4) {
    return `${parts.local}@${parts.domain.slice(0, -4)}.com`;
  }

  return null;
}

export interface EmailPolicyValidationResult {
  valid: boolean;
  code?: 'INVALID_EMAIL_FORMAT' | 'INVALID_EMAIL_DOMAIN';
  error?: string;
  suggestedEmail?: string;
}

export function validateEmailSyntaxAndDomainPolicy(email: string): EmailPolicyValidationResult {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) {
    return { valid: true };
  }

  if (!EMAIL_FORMAT_REGEX.test(trimmed) || trimmed.includes('..')) {
    return {
      valid: false,
      code: 'INVALID_EMAIL_FORMAT',
      error: 'Please enter a valid email address (e.g. name@gmail.com).',
    };
  }

  const parts = extractEmailParts(trimmed);
  if (!parts || !/^[a-z]{2,24}$/.test(parts.tld)) {
    return {
      valid: false,
      code: 'INVALID_EMAIL_DOMAIN',
      error: 'Email domain extension looks invalid. Please check your email address.',
    };
  }

  const suggestedEmail = suggestEmailDomainFix(trimmed);
  if (suggestedEmail) {
    return {
      valid: false,
      code: 'INVALID_EMAIL_DOMAIN',
      error: `Email domain "${parts.domain}" looks like a typo. Did you mean ${suggestedEmail}?`,
      suggestedEmail,
    };
  }

  if (INVALID_TLD_TYPOS.has(parts.tld)) {
    return {
      valid: false,
      code: 'INVALID_EMAIL_DOMAIN',
      error: `Email domain ".${parts.tld}" is not a valid mail domain. Please check for typos.`,
    };
  }

  return { valid: true };
}
