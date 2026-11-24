# 1. Update BookingModal.tsx
b_path = r'c:\Users\LocalAdmin\Desktop\web_auto\booking-saas\src\components\booking\BookingModal.tsx'
with open(b_path, 'r', encoding='utf-8') as f:
    b_text = f.read()

# Add import
b_text = b_text.replace(
    "import { playLuxuryChime } from '@/lib/soundscapes';",
    "import { playLuxuryChime } from '@/lib/soundscapes';\nimport { openGoogleCalendar, downloadIcsFile } from '@/lib/calendarExport';"
)

cal_start = b_text.find('  const handleOpenGoogleCalendar = () => {')
cal_end = b_text.find('  if (!isOpen) return null;')

if cal_start != -1 and cal_end != -1:
    new_cal_handlers = """  const handleOpenGoogleCalendar = () => {
    openGoogleCalendar({
      refId: bookingRef,
      serviceName: selectedService?.name || 'Treatment',
      doctorName: selectedDoctor?.name || 'Lead Specialist',
      patientName: fullName,
      date: selectedDate,
      time: selectedSlot,
      durationMinutes: selectedService?.durationMinutes,
      notes,
    });
  };

  const handleDownloadICS = () => {
    downloadIcsFile({
      refId: bookingRef,
      serviceName: selectedService?.name || 'Treatment',
      doctorName: selectedDoctor?.name || 'Lead Specialist',
      patientName: fullName,
      date: selectedDate,
      time: selectedSlot,
      durationMinutes: selectedService?.durationMinutes,
      notes,
    });
  };

"""
    b_text = b_text[:cal_start] + new_cal_handlers + b_text[cal_end:]
    with open(b_path, 'w', encoding='utf-8') as f:
        f.write(b_text)
    print("BookingModal.tsx updated! Lines:", len(b_text.splitlines()))

# 2. Update manage/page.tsx
m_path = r'c:\Users\LocalAdmin\Desktop\web_auto\booking-saas\src\app\(public)\manage\page.tsx'
with open(m_path, 'r', encoding='utf-8') as f:
    m_text = f.read()

# Add import
m_text = m_text.replace(
    "import { playSuccessPing, playHapticTick } from '@/lib/soundscapes';",
    "import { playSuccessPing, playHapticTick } from '@/lib/soundscapes';\nimport { openGoogleCalendar, downloadIcsFile } from '@/lib/calendarExport';"
)

m_cal_start = m_text.find('  // Google Calendar Integration\n  const handleOpenGoogleCalendar = () => {')
m_cal_end = m_text.find('  return (\n    <div className="min-h-screen bg-slate-950')

if m_cal_start != -1 and m_cal_end != -1:
    new_m_handlers = """  // Google Calendar Integration
  const handleOpenGoogleCalendar = () => {
    if (!activeBooking) return;
    openGoogleCalendar({
      refId: activeBooking.id,
      serviceName: activeBooking.service,
      doctorName: activeBooking.doctor,
      patientName: activeBooking.patientName,
      date: activeBooking.date,
      time: activeBooking.time,
      durationMinutes: activeBooking.duration,
      notes: activeBooking.notes,
    });
  };

  // Download iCal (.ics)
  const handleDownloadICS = () => {
    if (!activeBooking) return;
    downloadIcsFile({
      refId: activeBooking.id,
      serviceName: activeBooking.service,
      doctorName: activeBooking.doctor,
      patientName: activeBooking.patientName,
      date: activeBooking.date,
      time: activeBooking.time,
      durationMinutes: activeBooking.duration,
      notes: activeBooking.notes,
    });
  };

"""
    m_text = m_text[:m_cal_start] + new_m_handlers + m_text[m_cal_end:]
    with open(m_path, 'w', encoding='utf-8') as f:
        f.write(m_text)
    print("manage/page.tsx updated! Lines:", len(m_text.splitlines()))
