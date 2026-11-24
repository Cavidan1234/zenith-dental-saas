import { sendBookingConfirmationEmail } from '../src/lib/email/sender';

async function main() {
  console.log('--- STARTING REAL GMAIL SMTP TEST ---');
  const now = new Date();
  const startUtc = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const endUtc = new Date(startUtc.getTime() + 45 * 60 * 1000);
  const bookingCode = `ZD-${Math.floor(100000 + Math.random() * 900000)}`;

  const result = await sendBookingConfirmationEmail({
    bookingCode,
    patientName: 'Test Patient',
    patientEmail: process.env.TEST_EMAIL || 'patient@example.com',
    doctorName: 'Dr. Rashad Aliyev',
    doctorTitle: 'Oral & Maxillofacial Surgeon',
    doctorSuite: 'Harley Street Suite B (Floor 2)',
    serviceName: 'Comprehensive Implant & Surgical Assessment',
    serviceCategory: 'Implantology & Surgery',
    durationMinutes: 45,
    dateFormatted: startUtc.toISOString().split('T')[0],
    timeFormatted: '14:30',
    depositAmount: 50,
    totalPrice: 250,
    paymentMethod: 'Credit Card (Stripe Verified)',
    startUtc,
    endUtc,
  });

  console.log('=== TEST RESULT OUTPUT ===');
  console.log(JSON.stringify(result, null, 2));

  if (result.success && !result.simulated && result.messageId) {
    console.log(`\n🎉 SMTP DISPATCH SUCCESS!`);
    console.log(`Provider: ${result.provider}`);
    console.log(`MessageId: ${result.messageId}`);
    console.log(`Recipient: ${result.recipient}`);
    process.exit(0);
  } else {
    console.error(`\n❌ TEST FAILED OR WAS SIMULATED!`);
    console.error(`Error: ${result.error || 'Unknown error'}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
