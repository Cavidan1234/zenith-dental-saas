export interface BookingConfirmationEmailProps {
  bookingCode: string;
  patientName: string;
  patientEmail: string;
  doctorName: string;
  doctorTitle: string;
  doctorSuite: string;
  doctorAvatarUrl?: string;
  serviceName: string;
  serviceCategory: string;
  durationMinutes: number;
  dateFormatted: string; // e.g. "Tuesday, November 10, 2026"
  timeFormatted: string; // e.g. "14:45"
  depositAmount: number;
  totalPrice?: number;
  paymentMethod: string;
  notes?: string | null;
  clinicAddress?: string;
  clinicPhone?: string;
}

/**
 * Escapes HTML special characters to prevent XSS and HTML injection in email templates.
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#x60;');
}

export function renderBookingConfirmationHtml(props: BookingConfirmationEmailProps): string {
  const {
    bookingCode,
    patientName,
    doctorName,
    doctorTitle,
    doctorSuite,
    serviceName,
    serviceCategory,
    durationMinutes,
    dateFormatted,
    timeFormatted,
    depositAmount,
    totalPrice = 80,
    paymentMethod,
    notes,
    clinicAddress = '42 Harley Street, Marylebone, London, W1G 9PR',
    clinicPhone = '+44 20 7946 0991',
  } = props;

  const safeDuration = Number.isFinite(Number(durationMinutes))
    ? Math.max(0, Math.round(Number(durationMinutes)))
    : 45;
  const safeDeposit = Number.isFinite(Number(depositAmount))
    ? Math.max(0, Number(depositAmount))
    : 0;
  const safeTotal = Number.isFinite(Number(totalPrice))
    ? Math.max(0, Number(totalPrice))
    : 80;
  const remainingBalance = Math.max(0, safeTotal - safeDeposit);

  const safeBookingCode = escapeHtml(bookingCode);
  const safePatientName = escapeHtml(patientName);
  const safeDoctorName = escapeHtml(doctorName);
  const safeDoctorTitle = escapeHtml(doctorTitle);
  const safeDoctorSuite = escapeHtml(doctorSuite);
  const safeServiceName = escapeHtml(serviceName);
  const safeServiceCategory = escapeHtml(serviceCategory);
  const safeDateFormatted = escapeHtml(dateFormatted);
  const safeTimeFormatted = escapeHtml(timeFormatted);
  const safePaymentMethod = escapeHtml(paymentMethod);
  const safeNotes = notes ? escapeHtml(notes) : '';
  const safeClinicAddress = escapeHtml(clinicAddress);
  const safeClinicPhone = escapeHtml(clinicPhone);
  const safeMapsQuery = escapeHtml(encodeURIComponent(String(clinicAddress || '')));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmation · Zenith Dental Studio</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased; }
    table { border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; }
    td { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0; }
    .header { background-color: #1d4ed8; background-image: linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #1e3a8a 100%); padding: 36px 32px; text-align: center; color: #ffffff; }
    .gmail-blend-screen { background: #000000; mix-blend-mode: screen; }
    .gmail-blend-diff { background: #000000; mix-blend-mode: difference; }
    .content { padding: 36px 32px; }
    .title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0; line-height: 1.25; }
    .subtitle { font-size: 14px; color: #64748b; line-height: 1.5; margin: 0 0 24px 0; }
    .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 22px; margin-bottom: 24px; }
    .detail-row { border-bottom: 1px solid #edf2f7; padding: 12px 0; }
    .detail-row:last-child { border-bottom: none; padding-bottom: 0; }
    .detail-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; width: 38%; }
    .detail-value { font-size: 14px; font-weight: 700; color: #0f172a; text-align: right; }
    .code-box { background: #ecfeff; border: 1px dashed #06b6d4; border-radius: 12px; padding: 14px; text-align: center; margin: 20px 0; }
    .code-title { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #0891b2; letter-spacing: 0.08em; margin-bottom: 4px; }
    .code-number { font-size: 22px; font-weight: 900; font-family: monospace; color: #0e7490; letter-spacing: 2px; }
    .buffer-box { background: #fefce8; border: 1px solid #fef08a; border-radius: 12px; padding: 14px; margin-bottom: 24px; font-size: 12px; color: #854d0e; line-height: 1.5; }
    .cta-button { display: inline-block; background: #0f766e; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-size: 14px; font-weight: 700; text-align: center; box-shadow: 0 4px 12px rgba(15, 118, 110, 0.25); }
    .footer { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.6; }
  </style>
</head>
<body class="body">
  <table role="presentation">
    <tr>
      <td align="center">
        <div class="container">
          <!-- Header: Pure HTML Text with CSS Blend-Mode Inversion Immunity (Zero PNG) -->
          <div class="header" style="background-color: #1d4ed8; background-image: linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #1e3a8a 100%); padding: 36px 32px; text-align: center;">
            <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.16); border: 1px solid rgba(186, 230, 253, 0.45); border-radius: 9999px; padding: 5px 16px; margin-bottom: 14px;">
              <div class="gmail-blend-screen" style="background: #000000; mix-blend-mode: screen;">
                <div class="gmail-blend-diff" style="background: #000000; mix-blend-mode: difference; font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #ffffff;">
                  Harley Street · Clinical OS
                </div>
              </div>
            </div>
            <div class="gmail-blend-screen" style="background: #000000; mix-blend-mode: screen;">
              <div class="gmail-blend-diff" style="background: #000000; mix-blend-mode: difference; color: #ffffff;">
                <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.02em; color: #ffffff; line-height: 1.2;">
                  Zenith Dental Studio
                </h1>
                <p style="margin: 8px 0 0 0; font-size: 13px; color: #ffffff; font-weight: 500; letter-spacing: 0.04em;">
                  Marylebone · London
                </p>
              </div>
            </div>
          </div>

          <!-- Body Content -->
          <div class="content">
            <h2 class="title">Appointment Confirmed, ${safePatientName}.</h2>
            <p class="subtitle">
              Your clinical reservation at Zenith Dental Studio has been successfully placed and synchronized with our surgical schedule.
            </p>

            <!-- Booking Reference Box -->
            <div class="code-box">
              <div class="code-title">Booking Confirmation Reference</div>
              <div class="code-number">${safeBookingCode}</div>
            </div>

            <!-- Appointment Summary Card -->
            <div class="card">
              <table role="presentation">
                <tr class="detail-row">
                  <td class="detail-label">Treatment</td>
                  <td class="detail-value">${safeServiceName} <span style="font-size: 11px; color: #64748b; font-weight: 500;">(${safeServiceCategory})</span></td>
                </tr>
                <tr class="detail-row">
                  <td class="detail-label">Specialist</td>
                  <td class="detail-value">${safeDoctorName}<br><span style="font-size: 11px; color: #0284c7; font-weight: 600;">${safeDoctorTitle}</span></td>
                </tr>
                <tr class="detail-row">
                  <td class="detail-label">Location</td>
                  <td class="detail-value">${safeDoctorSuite}</td>
                </tr>
                <tr class="detail-row">
                  <td class="detail-label">Date & Time</td>
                  <td class="detail-value" style="color: #0f766e;">${safeDateFormatted} · ${safeTimeFormatted} (${safeDuration} mins)</td>
                </tr>
                <tr class="detail-row">
                  <td class="detail-label">Deposit Status</td>
                  <td class="detail-value"><span style="color: #059669; font-weight: 800;">£${safeDeposit} Paid</span> <span style="font-size: 11px; color: #64748b; font-weight: normal;">via ${safePaymentMethod}</span></td>
                </tr>
                <tr class="detail-row">
                  <td class="detail-label">Estimated Balance</td>
                  <td class="detail-value">£${remainingBalance} <span style="font-size: 11px; color: #64748b; font-weight: normal;">(Payable upon clinical discharge)</span></td>
                </tr>
                ${
                  safeNotes
                    ? `<tr class="detail-row">
                  <td class="detail-label">Patient Notes</td>
                  <td class="detail-value" style="font-weight: 500;">${safeNotes}</td>
                </tr>`
                    : ''
                }
              </table>
            </div>

            <!-- 15-Minute Buffer Protocol Notification -->
            <div class="buffer-box">
              <strong>Clinical Sterilization Standard:</strong> We adhere to strict Swiss surgical hygiene protocols. A mandatory 15-minute chamber decontamination buffer has been locked before and after your consultation to guarantee zero cross-contamination.
            </div>

            <!-- Pre-Visit Preparation Instructions -->
            <div style="margin-bottom: 24px; font-size: 13px; color: #475569; line-height: 1.6;">
              <strong style="color: #0f172a; display: block; margin-bottom: 6px;">Patient Guidance for Your Visit:</strong>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Please arrive approximately 5 minutes before your scheduled appointment time.</li>
                <li>Complimentary Marylebone valet parking and organic Italian espresso are available in our reception lounge.</li>
                <li>If you need to reschedule or amend your appointment, please contact us at least 24 hours in advance.</li>
              </ul>
            </div>

            <!-- Action CTA -->
            <div style="text-align: center; margin: 30px 0 10px 0;">
              <a href="https://maps.google.com/?q=${safeMapsQuery}" target="_blank" class="cta-button">
                Get Directions to Harley Street Studio
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p style="margin: 0 0 6px 0; font-weight: 700; color: #64748b;">Zenith Dental Studio Ltd · Harley Street Practice</p>
            <p style="margin: 0 0 8px 0;">${safeClinicAddress} · Phone: ${safeClinicPhone}</p>
            <p style="margin: 0;">GDC Registered Practice · CQC Certified Facility · ISO 27001 Data Compliant</p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
