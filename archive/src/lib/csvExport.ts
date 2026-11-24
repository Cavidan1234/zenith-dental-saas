export interface ExportableBooking {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  doctor: string;
  service: string;
  date: string;
  time: string;
  depositAmount: number | string;
  status: string;
  notes?: string;
}

export function exportBookingsToCSV(bookings: ExportableBooking[], filenamePrefix: string = 'Zenith_Dental_Bookings') {
  const headers = [
    'Booking ID',
    'Patient Name',
    'Email',
    'Phone',
    'Doctor',
    'Service',
    'Date',
    'Time Slot',
    'Deposit Amount',
    'Status',
    'Patient Notes',
  ];

  const rows = bookings.map((b) => [
    `"${b.id}"`,
    `"${b.patientName.replace(/"/g, '""')}"`,
    `"${b.email}"`,
    `"${b.phone}"`,
    `"${b.doctor}"`,
    `"${b.service.replace(/"/g, '""')}"`,
    `"${b.date}"`,
    `"${b.time}"`,
    `"$${b.depositAmount}"`,
    `"${b.status.toUpperCase()}"`,
    `"${(b.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
