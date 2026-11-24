/**
 * Generates an RFC 5545 compliant iCalendar (.ics) string.
 * Compatible with Apple Calendar, Google Calendar, and Microsoft Outlook.
 */
export interface CalendarEventData {
  uid: string;
  summary: string;
  description: string;
  location: string;
  startUtc: Date;
  endUtc: Date;
  organizerEmail?: string;
  organizerName?: string;
}

function formatDateToIcs(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

export function generateIcsCalendar(event: CalendarEventData): string {
  const dtStamp = formatDateToIcs(new Date());
  const dtStart = formatDateToIcs(event.startUtc);
  const dtEnd = formatDateToIcs(event.endUtc);

  const cleanDescription = event.description.replace(/\n/g, '\\n').replace(/,/g, '\\,');
  const cleanSummary = event.summary.replace(/,/g, '\\,');
  const cleanLocation = event.location.replace(/,/g, '\\,');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Zenith Dental Studio//Clinical Booking OS//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${event.uid}@zenithdental.com`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${cleanSummary}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${cleanLocation}`,
    `ORGANIZER;CN="${event.organizerName || 'Zenith Dental Studio'}":mailto:${event.organizerEmail || 'appointments@zenithdental.com'}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Upcoming Dental Appointment at Zenith Dental Studio',
    'TRIGGER:-PT1H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
