import nodemailer, { type Transporter } from 'nodemailer';
import { generateIcsCalendar } from './calendar';
import {
  BookingConfirmationEmailProps,
  renderBookingConfirmationHtml,
} from './templates/bookingConfirmation';
import { isReservedOrTestDomain } from '@/lib/security/emailValidation';
import { verifyEmailDomainCanReceiveMail } from '@/lib/security/emailDomainCheck';

export { isReservedOrTestDomain };

export interface SendBookingEmailResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  provider?: string;
  recipient: string;
  subject: string;
  error?: string;
  previewHtml?: string;
}

/**
 * Creates a Nodemailer transporter configured for Gmail or custom SMTP.
 * If credentials are not present, returns null so the system falls back to simulation mode.
 */
function createTransporter(): Transporter | null {
  const gmailUser = process.env.GMAIL_USER?.trim() || '';
  const gmailPassword = process.env.GMAIL_APP_PASSWORD?.trim() || '';

  const smtpHost = process.env.SMTP_HOST?.trim() || '';
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
  const smtpUser = process.env.SMTP_USER?.trim() || gmailUser;
  const smtpPass =
    process.env.SMTP_PASSWORD?.trim() ||
    process.env.SMTP_PASS?.trim() ||
    gmailPassword;

  // 1. Direct Gmail Configuration
  if (gmailUser && gmailPassword) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    });
  }

  // 2. Generic SMTP Configuration
  if (smtpHost && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  console.warn(
    '[SEC-01][EMAIL SIMULATED] GMAIL_USER or GMAIL_APP_PASSWORD is missing/empty; staying in simulated email mode.'
  );
  return null;
}

/**
 * Sends a booking confirmation email with an attached .ics iCalendar file.
 * Automatically intercepts reserved/test domains to prevent Gmail bounce backs,
 * and falls back to high-fidelity simulation if Gmail credentials are not configured.
 */
export async function sendBookingConfirmationEmail(
  props: BookingConfirmationEmailProps & {
    startUtc?: Date;
    endUtc?: Date;
  }
): Promise<SendBookingEmailResult> {
  const subject = `Appointment Confirmed: ${props.serviceName} with ${props.doctorName} [${props.bookingCode}]`
    .replace(/[\r\n]+/g, ' ')
    .trim();
  const htmlContent = renderBookingConfirmationHtml(props);

  // 1. Safety check: Check for reserved/test domains before attempting real Gmail SMTP delivery
  const patientEmail = (props.patientEmail || '').trim();
  const emailDomain = patientEmail.split('@')[1]?.toLowerCase();

  if (isReservedOrTestDomain(patientEmail)) {
    console.log(
      `🛡️ [EMAIL SIMULATED / RESERVED TEST DOMAIN] Recipient: ${patientEmail} | Domain: "${emailDomain}" - Skipped real Gmail SMTP to prevent inbox bounces.`
    );
    return {
      success: true,
      simulated: true,
      provider: 'simulated-reserved-domain',
      messageId: `sim-reserved-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      recipient: patientEmail,
      subject,
      previewHtml: htmlContent,
    };
  }

  // Generate .ics calendar attachment
  const start = props.startUtc || new Date();
  const end = props.endUtc || new Date(start.getTime() + (props.durationMinutes || 45) * 60000);

  const icsContent = generateIcsCalendar({
    uid: props.bookingCode,
    summary: `Zenith Dental: ${props.serviceName} with ${props.doctorName}`,
    description: `Clinical appointment at Zenith Dental Studio.\nReference: ${props.bookingCode}\nDoctor: ${props.doctorName}\nService: ${props.serviceName}\nDeposit: £${props.depositAmount} Paid.`,
    location: '42 Harley Street, Marylebone, London, W1G 9PR',
    startUtc: start,
    endUtc: end,
    organizerName: 'Zenith Dental Studio',
    organizerEmail: 'appointments@zenithdental.com',
  });

  const transporter = createTransporter();

  // If no Gmail credentials configured in .env, simulate gracefully
  if (!transporter) {
    console.log(
      `📧 [EMAIL SIMULATED / SANDBOX] To: ${patientEmail} | Subject: "${subject}" | BookingRef: ${props.bookingCode}`
    );
    console.log(`ℹ️ [EMAIL NOTICE] To send via real Gmail inbox, set GMAIL_USER and GMAIL_APP_PASSWORD in .env`);

    return {
      success: true,
      simulated: true,
      provider: 'simulated-no-smtp',
      recipient: patientEmail,
      subject,
      previewHtml: htmlContent,
    };
  }

  // Final defense before real SMTP transmission: ensure domain can actually receive mail (prevents NXDOMAIN bounces)
  const domainCheck = await verifyEmailDomainCanReceiveMail(patientEmail);
  if (!domainCheck.valid) {
    console.warn(
      `🛡️ [EMAIL BLOCKED / INVALID DOMAIN] Recipient: ${patientEmail} | Reason: ${domainCheck.error}`
    );
    return {
      success: false,
      recipient: patientEmail,
      subject,
      error: domainCheck.error || 'Recipient domain cannot receive emails.',
    };
  }

  try {
    const envFrom = process.env.EMAIL_FROM?.trim();
    const senderAddress =
      process.env.GMAIL_USER?.trim() ||
      process.env.SMTP_USER?.trim() ||
      'appointments@zenithdental.com';
    const fromAddress = envFrom || `"Zenith Dental Studio" <${senderAddress}>`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: patientEmail,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: `zenith-appointment-${props.bookingCode}.ics`,
          content: icsContent,
          contentType: 'text/calendar; charset=utf-8; method=REQUEST',
        },
      ],
    });

    console.log(`✅ [EMAIL SENT VIA GMAIL] MessageId: ${info.messageId} to ${patientEmail}`);

    return {
      success: true,
      simulated: false,
      provider: 'gmail-smtp',
      messageId: info.messageId,
      recipient: patientEmail,
      subject,
    };
  } catch (error: any) {
    console.error(`❌ [GMAIL SEND FAILED]:`, error);
    return {
      success: false,
      recipient: patientEmail,
      subject,
      error: error.message || 'SMTP transmission failure',
    };
  }
}
