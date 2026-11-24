/**
 * High-performance input sanitization and anti-injection guard
 * for clinical and patient-facing interfaces.
 */

/**
 * Strips HTML tags, event handlers, control characters, and null bytes from text.
 * Trims and truncates to maxLength (default 500 characters).
 */
export function sanitizeText(input: string, maxLength = 500): string {
  if (typeof input !== 'string') {
    return '';
  }

  let text = input;

  // 1. Strip null bytes
  text = text.replace(/\0/g, '');

  // 2. Strip non-printable ASCII control characters (keep newline \n, carriage return \r, and tab \t)
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 3. Strip dangerous URL protocols (e.g. javascript:, vbscript:, data:)
  text = text.replace(/(javascript|vbscript|data):/gi, '');

  // 4. Repeatedly strip all HTML/XML tags to prevent recursive evasion (e.g., <scr<script>ipt>)
  let previous = '';
  while (text !== previous) {
    previous = text;
    text = text.replace(/<[^>]*>/g, '');
  }

  // 5. Strip DOM event handlers (e.g. onload=, onerror=, onclick=)
  text = text.replace(/\bon\w+\s*=/gi, '');

  // 6. Clean dangling angle brackets or script remnants
  text = text.replace(/[<>]/g, '');

  // 7. Enforce max length and trim whitespace
  return text.trim().slice(0, maxLength);
}

/**
 * Sanitizes patient full names.
 * Enforces letters (including Latin Extended international characters), spaces, hyphens, and apostrophes.
 * Truncates to max 80 characters.
 */
export function sanitizePatientName(name: string): string {
  if (typeof name !== 'string') {
    return '';
  }

  // Remove null bytes and control characters
  let cleanName = name.replace(/\0/g, '').replace(/[\x00-\x1F\x7F]/g, '');

  // Strip any HTML tags first
  cleanName = cleanName.replace(/<[^>]*>/g, '');

  // Allow letters (including international characters), spaces, hyphens, and apostrophes
  // Covers ASCII A-Z, a-z, Latin-1 Supplement, and Latin Extended A/B
  cleanName = cleanName.replace(/[^a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s\-']/g, '');

  // Collapse multiple whitespace characters into a single space
  cleanName = cleanName.replace(/\s+/g, ' ').trim();

  // Enforce max 80 characters
  return cleanName.slice(0, 80);
}

/**
 * Sanitizes email addresses.
 * Trims, converts to lowercase, and strips illegal control characters, null bytes, and internal spaces.
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }

  // Strip null bytes, control characters, and all whitespace
  const cleanEmail = email.replace(/[\0\s\x00-\x1F\x7F<>]/g, '').toLowerCase().trim();

  // Enforce RFC maximum email length (254 chars)
  return cleanEmail.slice(0, 254);
}
