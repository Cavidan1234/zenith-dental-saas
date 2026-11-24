export interface CalendarAppointmentDetails {
  refId: string;
  serviceName: string;
  doctorName: string;
  patientName?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes?: number;
  location?: string;
  notes?: string;
}

export function openGoogleCalendar(details: CalendarAppointmentDetails) {
  const duration = details.durationMinutes || 45;
  const [hours, mins] = (details.time || '10:00').split(':').map(Number);
  const startYear = details.date.slice(0, 4);
  const startMonth = details.date.slice(5, 7);
  const startDay = details.date.slice(8, 10);
  const startHStr = String(hours).padStart(2, '0');
  const startMStr = String(mins).padStart(2, '0');

  const endTotalMins = hours * 60 + mins + duration;
  const endH = Math.floor(endTotalMins / 60);
  const endM = endTotalMins % 60;
  const endHStr = String(endH).padStart(2, '0');
  const endMStr = String(endM).padStart(2, '0');

  const dtStart = `${startYear}${startMonth}${startDay}T${startHStr}${startMStr}00`;
  const dtEnd = `${startYear}${startMonth}${startDay}T${endHStr}${endMStr}00`;

  const loc = details.location || 'Zenith Dental & Esthetics, 14 Harley Street, London W1G 9PR';
  const title = encodeURIComponent(`Zenith Dental: ${details.serviceName} with ${details.doctorName}`);
  const description = encodeURIComponent(
    `Specialist: ${details.doctorName}\nPatient: ${details.patientName || 'Registered Patient'}\nBooking Ref: ${details.refId}\nDeposit: Paid & Verified\nLocation: ${loc}${details.notes ? `\nNotes: ${details.notes}` : ''}`
  );

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dtStart}/${dtEnd}&details=${description}&location=${encodeURIComponent(loc)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function downloadIcsFile(details: CalendarAppointmentDetails) {
  const duration = details.durationMinutes || 45;
  const [hours, mins] = (details.time || '10:00').split(':').map(Number);
  const startYear = details.date.slice(0, 4);
  const startMonth = details.date.slice(5, 7);
  const startDay = details.date.slice(8, 10);
  const startHStr = String(hours).padStart(2, '0');
  const startMStr = String(mins).padStart(2, '0');

  const endTotalMins = hours * 60 + mins + duration;
  const endH = Math.floor(endTotalMins / 60);
  const endM = endTotalMins % 60;
  const endHStr = String(endH).padStart(2, '0');
  const endMStr = String(endM).padStart(2, '0');

  const dtStart = `${startYear}${startMonth}${startDay}T${startHStr}${startMStr}00`;
  const dtEnd = `${startYear}${startMonth}${startDay}T${endHStr}${endMStr}00`;
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const loc = details.location || '14 Harley Street, Marylebone, London W1G 9PR';

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Zenith Dental & Esthetics//DentalBook.os//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:zd_${details.refId}@zenithdental.co.uk`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:Zenith Dental - ${details.serviceName}`,
    `DESCRIPTION:Specialist: ${details.doctorName}\\nPatient: ${details.patientName || 'Patient'}\\nBooking ID: ${details.refId}`,
    `LOCATION:${loc}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Upcoming Zenith Dental Surgery Appointment',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `Zenith_Dental_${details.refId}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
