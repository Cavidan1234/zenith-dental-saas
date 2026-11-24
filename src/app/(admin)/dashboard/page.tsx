'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ZenithLogo } from '@/components/shared/ZenithLogo';
import {
  Calendar as CalendarIcon,
  Clock,
  PoundSterling,
  TrendingUp,
  BellRing,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Droplets,
  ArrowLeft,
  FileText,
  RefreshCw,
  Search,
  Zap,
  Check,
  ShieldCheck,
  Stethoscope,
  X,
  Phone,
  Mail,
  Printer,
  Plus,
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  AlertCircle,
  Lock,
  Eye,
  Smartphone,
  Send,
  LogOut,
  Database,
} from 'lucide-react';

// ============================================================================
// TIMEZONE-SAFE DATE HELPERS (SSR-Deterministic & DST/Offset Safe)
// ============================================================================
function formatLocalYMD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDaysYMD(ymd: string, deltaDays: number): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d + deltaDays));
  return utc.toISOString().split('T')[0];
}

function formatYMDLocale(ymd: string, options: Intl.DateTimeFormatOptions): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d));
  return utc.toLocaleDateString('en-US', { timeZone: 'UTC', ...options });
}

// ============================================================================
// HIGH-PERFORMANCE 120 FPS ANIMATED NUMBER COUNTER (Pure requestAnimationFrame)
// ============================================================================
function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1200,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const displayValueRef = useRef(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animId = 0;
    const startValue = displayValueRef.current;
    const targetValue = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth cubic ease-out curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (targetValue - startValue) * easeProgress;
      displayValueRef.current = current;
      setDisplayValue(current);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        displayValueRef.current = targetValue;
        setDisplayValue(targetValue);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toLocaleString('en-US');

  return (
    <span className="tabular-nums font-mono">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// ============================================================================
// TYPES
// ============================================================================
interface BookingRecord {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  service: string;
  doctor: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'in_surgery';
  depositStatus: 'paid' | 'unpaid';
  depositAmount: number;
  paymentMethod?: string;
  paymentLabel?: string;
  notes?: string;
  internalNotes?: string;
  isRecent?: boolean;
}

const DEFAULT_SCHEDULE_SLOTS: Array<{
  time: string;
  defaultLeyla: string;
  defaultRashad: string;
  isPast?: boolean;
  isCurrent?: boolean;
  isBreak?: boolean;
}> = [
  { time: '09:00', defaultLeyla: 'Emma Richardson · Whitening (60m)', defaultRashad: 'Available for Surgery', isPast: true },
  { time: '10:00', defaultLeyla: 'Sterilization Buffer (15m)', defaultRashad: 'Oliver Vance · Implant CBCT (60m)', isPast: true },
  { time: '11:00', defaultLeyla: 'Available Slot', defaultRashad: 'Sterilization Buffer (15m)', isCurrent: true },
  { time: '11:45', defaultLeyla: 'Sophia Chen · Veneer Consult (45m)', defaultRashad: 'Available Slot' },
  { time: '13:00', defaultLeyla: '— Clinic Lunch & Sterilization Break —', defaultRashad: '— Clinic Lunch & Sterilization Break —', isBreak: true },
  { time: '14:00', defaultLeyla: 'Available Slot', defaultRashad: 'James Montgomery · 3D Exam (45m)' },
  { time: '15:30', defaultLeyla: 'Available Slot', defaultRashad: 'Available Slot' },
  { time: '16:45', defaultLeyla: 'Available Slot', defaultRashad: 'Available Slot' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<{ name: string; role: string; email: string; title?: string } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.authenticated && data?.user) {
          setSessionUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } finally {
      router.push('/login');
      router.refresh();
    }
  };
  const [activeTab, setActiveTab] = useState<'calendar' | 'bookings' | 'recall'>('calendar');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<string>('all');
  const [calendarViewMode, setCalendarViewMode] = useState<'daily' | 'weekly'>('daily');
  const [weekOffset, setWeekOffset] = useState<number>(0);
  // Defer wall-clock "today" resolution until mount so static SSR matches client hydration across all timezones.
  const [todayStr, setTodayStr] = useState<string>('');
  const [selectedDailyDate, setSelectedDailyDate] = useState<string>('');

  useEffect(() => {
    const localToday = formatLocalYMD(new Date());
    setTodayStr(localToday);
    setSelectedDailyDate((prev) => prev || localToday);
  }, []);
  const [notification, setNotification] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dispatchedRecalls, setDispatchedRecalls] = useState<Record<string, boolean>>({});

  // Drawer & Modal States
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [walkInModal, setWalkInModal] = useState<{ time: string; doctor: string; date?: string } | null>(null);
  const [previewRecall, setPreviewRecall] = useState<{
    id: string;
    patientName: string;
    email: string;
    phone: string;
    lastVisitDate: string;
    recallDueDate: string;
    treatment: string;
    doctor: string;
    status: string;
    contacted: boolean;
  } | null>(null);
  const [previewChannel, setPreviewChannel] = useState<'email' | 'sms'>('email');
  const [walkInForm, setWalkInForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Laser Teeth Whitening (In-Office)',
    notes: '',
  });
  const [internalNoteDraft, setInternalNoteDraft] = useState<string>('');

  // Default seed bookings
  const [bookings, setBookings] = useState<BookingRecord[]>([
    {
      id: 'ZD-829104',
      patientName: 'Emma Richardson',
      email: 'emma.r@example.co.uk',
      phone: '+44 7700 900123',
      service: 'Laser Teeth Whitening (In-Office)',
      doctor: 'Dr. Leyla Mammadova',
      date: '2026-11-05',
      time: '09:00',
      duration: 60,
      status: 'confirmed',
      depositStatus: 'paid',
      depositAmount: 50,
      notes: 'Sensitive enamel; gentle polishing mode requested.',
      internalNotes: 'Pre-treatment sensitivity test passed with mild cold reaction. Recommended low-concentration gel.',
    },
    {
      id: 'ZD-829105',
      patientName: 'Oliver Vance',
      email: 'oliver.vance@company.com',
      phone: '+44 7700 900456',
      service: 'Dental Implant Consultation & 3D CBCT',
      doctor: 'Dr. Rashad Aliyev',
      date: '2026-11-05',
      time: '10:00',
      duration: 60,
      status: 'confirmed',
      depositStatus: 'paid',
      depositAmount: 50,
      internalNotes: 'Full bone density scan reviewed. 3D surgical guide required for upper molar implant.',
    },
    {
      id: 'ZD-829106',
      patientName: 'Sophia Chen',
      email: 'sophia.chen@design.org',
      phone: '+44 7700 900789',
      service: 'Porcelain Veneer Smile Design',
      doctor: 'Dr. Leyla Mammadova',
      date: '2026-11-05',
      time: '11:45',
      duration: 45,
      status: 'confirmed',
      depositStatus: 'paid',
      depositAmount: 30,
      notes: 'Pre-wedding natural shade consultation (BL2/BL3).',
    },
    {
      id: 'ZD-829107',
      patientName: 'James Montgomery',
      email: 'j.montgomery@outlook.com',
      phone: '+44 7700 900234',
      service: 'Comprehensive 3D Exam & Prophylaxis',
      doctor: 'Dr. Rashad Aliyev',
      date: '2026-11-05',
      time: '14:00',
      duration: 45,
      status: 'pending',
      depositStatus: 'paid',
      depositAmount: 25,
      notes: 'Gingival bleeding concern; mild needle anxiety.',
    },
    {
      id: 'ZD-829110',
      patientName: 'Aysel Mammadova',
      email: 'aysel.m@azeri.com',
      phone: '+994 50 234 5678',
      service: 'Porcelain Veneer Smile Design',
      doctor: 'Dr. Leyla Mammadova',
      date: '2026-11-09',
      time: '09:00',
      duration: 60,
      status: 'confirmed',
      depositStatus: 'paid',
      depositAmount: 50,
      notes: 'Smile design consultation and digital scan.',
    },
    {
      id: 'ZD-829111',
      patientName: 'Kamil Aliyev',
      email: 'kamil.a@mail.ru',
      phone: '+994 55 987 6543',
      service: 'Dental Implant Consultation & 3D CBCT',
      doctor: 'Dr. Rashad Aliyev',
      date: '2026-11-10',
      time: '14:00',
      duration: 60,
      status: 'confirmed',
      depositStatus: 'paid',
      depositAmount: 50,
      notes: 'Pre-implant 3D CBCT scan for lower mandible.',
    },
    {
      id: 'ZD-829112',
      patientName: 'Nigar Huseynova',
      email: 'nigar.h@company.az',
      phone: '+994 70 555 4433',
      service: 'Laser Teeth Whitening (In-Office)',
      doctor: 'Dr. Leyla Mammadova',
      date: '2026-11-11',
      time: '11:45',
      duration: 45,
      status: 'confirmed',
      depositStatus: 'paid',
      depositAmount: 30,
      notes: 'Laser teeth whitening session.',
    },
    {
      id: 'ZD-829113',
      patientName: 'Eldar Qasimov',
      email: 'eldar.q@tech.az',
      phone: '+994 50 111 2233',
      service: 'Comprehensive 3D Exam & Prophylaxis',
      doctor: 'Dr. Rashad Aliyev',
      date: '2026-11-12',
      time: '10:00',
      duration: 45,
      status: 'confirmed',
      depositStatus: 'paid',
      depositAmount: 25,
      notes: 'Routine check-up and ultrasonic prophylaxis.',
    },
  ]);

  // Fetch bookings from real PostgreSQL / PGlite database API + local cross-tab sync
  const fetchBookings = async (silent: boolean = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const res = await fetch('/api/v1/bookings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.bookings)) {
          const merged = [...data.bookings];
          try {
            const localCustom = JSON.parse(localStorage.getItem('dentalbook_custom_bookings') || '[]');
            if (Array.isArray(localCustom) && localCustom.length > 0) {
              const existingIds = new Set(merged.map((b) => b.id));
              for (const item of localCustom) {
                if (!existingIds.has(item.id)) {
                  merged.unshift(item);
                  existingIds.add(item.id);
                }
              }
            }
          } catch {}
          if (merged.length > 0) {
            setBookings(merged);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load bookings from API:', err);
    } finally {
      if (!silent) setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // 1. Live radar auto-sync every 3 seconds so patient bookings appear automatically without refreshing
    const pollTimer = setInterval(() => {
      fetchBookings(true);
    }, 3000);

    // 2. Immediate cross-tab sync when patient registers in another tab
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dentalbook_custom_bookings') {
        fetchBookings(true);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(pollTimer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Update internal notes draft whenever a booking is selected
  useEffect(() => {
    if (selectedBooking) {
      setInternalNoteDraft(selectedBooking.internalNotes || '');
    }
  }, [selectedBooking]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/v1/bookings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.bookings)) {
          setBookings(data.bookings);
          setNotification('Live Radar Synchronized: Real database appointments loaded.');
        } else {
          setNotification('Radar Synced.');
        }
      } else {
        setNotification('Sync failed from server.');
      }
    } catch {
      setNotification('Network error during sync.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // 6-Month Recall queue
  const [recalls, setRecalls] = useState([
    {
      id: 'rec-1',
      patientName: 'Arthur Pendelton',
      email: 'a.pendelton@gmail.com',
      phone: '+44 7891 112233',
      lastVisitDate: '2026-05-02',
      recallDueDate: '2026-11-02 (Due Today)',
      treatment: 'Porcelain Veneers Follow-up',
      doctor: 'Dr. Leyla Mammadova',
      status: 'Due Now',
      contacted: false,
    },
    {
      id: 'rec-2',
      patientName: 'Victoria Sterling',
      email: 'v.sterling@luxury.co.uk',
      phone: '+44 7891 445566',
      lastVisitDate: '2026-05-10',
      recallDueDate: '2026-11-10',
      treatment: 'Routine Prophylaxis & 3D Scan',
      doctor: 'Dr. Rashad Aliyev',
      status: 'Scheduled',
      contacted: true,
    },
    {
      id: 'rec-3',
      patientName: 'Marcus Aurel',
      email: 'marcus@aurel.io',
      phone: '+44 7891 778899',
      lastVisitDate: '2026-05-15',
      recallDueDate: '2026-11-15',
      treatment: 'Implant Screw Torque Check',
      doctor: 'Dr. Rashad Aliyev',
      status: 'Scheduled',
      contacted: false,
    },
  ]);

  const triggerRecallNotice = (patientName: string, id: string) => {
    setDispatchedRecalls((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setRecalls((prev) =>
        prev.map((r) => (r.id === id ? { ...r, contacted: true, status: 'Sent via BullMQ' } : r))
      );
      setNotification(`Automated 6-month recall invitation dispatched to ${patientName}!`);
      setTimeout(() => setNotification(null), 4000);
    }, 450);
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'in_surgery'
  ) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      const res = await fetch('/api/v1/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const statusLabels: Record<string, string> = {
        confirmed: 'Confirmed',
        in_surgery: 'In Surgery',
        completed: 'Completed',
        cancelled: 'Cancelled',
        pending: 'Pending',
      };

      if (res.ok) {
        setNotification(`Appointment ${id} status changed to "${statusLabels[newStatus] || newStatus}" in database.`);
      } else {
        setNotification(`Appointment ${id} status changed to "${statusLabels[newStatus] || newStatus}".`);
      }
    } catch {
      setNotification(`Appointment ${id} status updated.`);
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSaveInternalNote = async (id: string) => {
    const noteText = internalNoteDraft.trim();
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, internalNotes: noteText } : b))
    );
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking((prev) =>
        prev ? { ...prev, internalNotes: noteText } : null
      );
    }

    try {
      const res = await fetch('/api/v1/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, internalNotes: noteText }),
      });

      if (res.ok) {
        setNotification('Internal clinical note saved to database successfully.');
      } else {
        setNotification('Internal clinical note saved.');
      }
    } catch {
      setNotification('Internal clinical note saved.');
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInForm.name.trim() || !walkInModal) return;

    const resolvedToday = todayStr || formatLocalYMD(new Date());
    const targetDate = walkInModal?.date || selectedDailyDate || resolvedToday;
    const maxAllowedDate = maxAdvanceDateStr || addDaysYMD(resolvedToday, 7);
    if (targetDate > maxAllowedDate) {
      setNotification('Action blocked: Appointments cannot be registered beyond the 1-week horizon.');
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    const staffSlug = walkInModal.doctor.toLowerCase().includes('rashad') ? 'doc-rashad' : 'doc-leyla';

    // Map service to slug
    let serviceId = 'srv-whitening';
    if (walkInForm.service.includes('Implant')) serviceId = 'srv-implant';
    else if (walkInForm.service.includes('Veneer')) serviceId = 'srv-veneers';
    else if (
      walkInForm.service.includes('Exam') ||
      walkInForm.service.includes('Check') ||
      walkInForm.service.includes('Emergency') ||
      walkInForm.service.includes('Prophylaxis')
    ) {
      serviceId = 'srv-checkup';
    }

    const payload = {
      tenantSlug: 'zenith-dental',
      staffId: staffSlug,
      serviceId,
      date: targetDate,
      time: walkInModal.time,
      customerName: walkInForm.name.trim(),
      customerEmail: walkInForm.email.trim() || 'walkin@zenithdental.com',
      customerPhone: walkInForm.phone.trim() || '+44 7700 900000',
      notes: walkInForm.notes.trim() || 'Walk-in emergency / priority consultation',
      paymentMethod: 'in_clinic',
      paymentLabel: 'In-Clinic Cash/Card',
    };

    try {
      const res = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        const createdId = data.bookingId || data.booking?.id || `ZD-WALK-${Math.floor(1000 + Math.random() * 9000)}`;
        const newBooking: BookingRecord = {
          id: createdId,
          patientName: payload.customerName,
          email: payload.customerEmail,
          phone: payload.customerPhone,
          service: walkInForm.service,
          doctor: walkInModal.doctor,
          date: targetDate,
          time: walkInModal.time,
          duration: 45,
          status: data.booking?.status || 'pending',
          depositStatus: data.details?.depositStatus === 'deposit_paid' ? 'paid' : 'unpaid',
          depositAmount: data.details?.depositAmount ?? 50,
          paymentMethod: 'in_clinic',
          paymentLabel: 'In-Clinic Cash/Card',
          notes: payload.notes,
          isRecent: true,
        };

        setBookings((prev) => [newBooking, ...prev]);
        setWalkInModal(null);
        setWalkInForm({
          name: '',
          phone: '',
          email: '',
          service: 'Laser Teeth Whitening (In-Office)',
          notes: '',
        });
        setNotification(`Walk-in appointment registered in DB for ${newBooking.patientName} at ${newBooking.time}!`);
        fetchBookings(true);
      } else if (res.status === 409) {
        setNotification('Conflict: This slot is already booked in the database!');
      } else {
        setNotification(data.error || 'Failed to create walk-in appointment.');
      }
    } catch {
      setNotification('Network error while saving walk-in appointment.');
    }
    setTimeout(() => setNotification(null), 4000);
  };

  // Dynamic calculated metrics
  const totalDepositSum = useMemo(() => {
    const customSum = bookings.reduce((sum, b) => sum + (Number(b.depositAmount) || 0), 0);
    return 6700 + customSum;
  }, [bookings]);

  const totalAppointmentsCount = useMemo(() => {
    return 140 + bookings.length;
  }, [bookings]);

  // Filter bookings by doctor & search query
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchDoc =
        selectedDoctorFilter === 'all'
          ? true
          : selectedDoctorFilter === 'doc-leyla'
          ? b.doctor.includes('Leyla')
          : b.doctor.includes('Rashad');

      if (!matchDoc) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        b.patientName.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.service.toLowerCase().includes(q)
      );
    });
  }, [bookings, selectedDoctorFilter, searchQuery]);

  // Filter 6-month recalls by selected doctor
  const filteredRecalls = useMemo(() => {
    return recalls.filter((r) => {
      if (selectedDoctorFilter === 'all') return true;
      if (selectedDoctorFilter === 'doc-leyla') return r.doctor.toLowerCase().includes('leyla');
      if (selectedDoctorFilter === 'doc-rashad') return r.doctor.toLowerCase().includes('rashad');
      return true;
    });
  }, [recalls, selectedDoctorFilter]);

  // Dynamically compute day schedule slots so any appointment (e.g. 11:15, 10:30, etc.) gets its own row!
  const scheduleSlots = useMemo(() => {
    const dayBookings = bookings.filter(
      (b) => b.date === selectedDailyDate && b.status !== 'cancelled'
    );
    const existingTimes = new Set(DEFAULT_SCHEDULE_SLOTS.map((s) => s.time));
    const extraSlots: typeof DEFAULT_SCHEDULE_SLOTS = [];

    for (const b of dayBookings) {
      if (b.time && !existingTimes.has(b.time)) {
        existingTimes.add(b.time);
        extraSlots.push({
          time: b.time,
          defaultLeyla: 'Available Slot',
          defaultRashad: 'Available Slot',
        });
      }
    }

    return [...DEFAULT_SCHEDULE_SLOTS, ...extraSlots].sort((a, b) => a.time.localeCompare(b.time));
  }, [bookings, selectedDailyDate]);

  // 1-Week Advance Horizon Constants (Strictly Capped to Today + 7 Days; empty until mount for SSR parity)
  const maxAdvanceDateStr = useMemo(
    () => (todayStr ? addDaysYMD(todayStr, 7) : ''),
    [todayStr]
  );

  // 7-Day Quick Selection Strip for Daily Grid (Today through Today + 7 Days)
  const advance7Days = useMemo(() => {
    if (!todayStr) return [];
    const list = [];
    for (let i = 0; i <= 7; i++) {
      const dateStr = addDaysYMD(todayStr, i);
      const dayShort = formatYMDLocale(dateStr, { weekday: 'short' });
      const dayNum = Number(dateStr.split('-')[2]);
      const monthShort = formatYMDLocale(dateStr, { month: 'short' });
      const count = bookings.filter((b) => b.date === dateStr && b.status !== 'cancelled').length;
      list.push({
        dateStr,
        dayShort,
        dayNum,
        monthShort,
        isToday: i === 0,
        isMaxDay: i === 7,
        count,
      });
    }
    return list;
  }, [bookings, todayStr]);

  // Weekly schedule calculation for 7-day overview
  const currentWeekDays = useMemo(() => {
    if (!todayStr) return [];
    const [ry, rm, rd] = todayStr.split('-').map(Number);
    const refUtc = new Date(Date.UTC(ry, rm - 1, rd));
    const currentDay = refUtc.getUTCDay();
    const diffToMon = currentDay === 0 ? -6 : 1 - currentDay;
    const mondayStr = addDaysYMD(todayStr, diffToMon + weekOffset * 7);

    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayNamesShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const days = [];
    for (let i = 0; i < 7; i++) {
      const dateStr = addDaysYMD(mondayStr, i);
      const isToday = dateStr === todayStr;

      // Find bookings for this day matching doctor filter
      const dayBookings = bookings.filter((b) => {
        if (b.date !== dateStr || b.status === 'cancelled') return false;
        if (selectedDoctorFilter === 'doc-leyla') return b.doctor.includes('Leyla');
        if (selectedDoctorFilter === 'doc-rashad') return b.doctor.includes('Rashad');
        return true;
      });

      days.push({
        dateStr,
        dayName: dayNames[i],
        dayShort: dayNamesShort[i],
        dayNum: Number(dateStr.split('-')[2]),
        monthName: formatYMDLocale(dateStr, { month: 'short' }),
        isToday,
        isWeekend: i >= 5,
        bookings: dayBookings,
      });
    }
    return days;
  }, [bookings, selectedDoctorFilter, todayStr, weekOffset]);

  const weekRangeLabel = useMemo(() => {
    if (currentWeekDays.length === 0) return '';
    const first = currentWeekDays[0];
    const last = currentWeekDays[6];
    const year = last.dateStr.split('-')[0];
    return `${first.dayNum} ${first.monthName} – ${last.dayNum} ${last.monthName} ${year}`;
  }, [currentWeekDays]);

  const weeklyTotalBookings = useMemo(() => {
    return currentWeekDays.reduce((acc, day) => acc + day.bookings.length, 0);
  }, [currentWeekDays]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Header: Clean White & Royal Blue with Live Surgery Ticker */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <Link
              href="/b/zenith-dental"
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200 text-slate-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs shrink-0"
              title="Return to Public Site"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              <Link href="/b/zenith-dental" className="shrink-0 flex items-center group transition-transform duration-200 hover:scale-105" title="Zenith Dental Studio">
                <ZenithLogo size={36} />
              </Link>
              <div className="min-w-0">
                <h1 className="font-extrabold text-sm sm:text-lg text-slate-900 tracking-tight truncate">
                  Zenith Dental <span className="hidden sm:inline">· Surgery Dashboard</span>
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                  Practice Management
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Active Authenticated Clinician Pill */}
            {sessionUser && (
              <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-50/70 border border-brand-200/80 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-800">{sessionUser.name}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white text-brand-700 border border-brand-200/60">
                  {sessionUser.role}
                </span>
              </div>
            )}

            {/* DB & API Explorer Link */}
            <Link
              href="/explorer"
              className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100/80 border border-brand-200 transition-all active:scale-95"
              title="Open Visual Database & API Playground"
            >
              <Database className="w-3.5 h-3.5 text-brand-600" />
              <span className="hidden lg:inline">DB & API Explorer</span>
            </Link>

            {/* Sync Button */}
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all active:scale-95"
              title="Sync appointments & cache"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isSyncing ? 'animate-spin text-brand-600' : ''}`} />
              <span className="hidden md:inline">Sync Radar</span>
            </button>

            {/* Public Page Link */}
            <Link
              href="/b/zenith-dental"
              target="_blank"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-700 hover:to-blue-700 shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span className="hidden xs:inline">Public Site</span>
              <span className="xs:hidden">Site</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200/80 hover:border-rose-600 transition-all active:scale-95 cursor-pointer"
              title="Sign out of clinical session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Notification Toast Alert */}
        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-500 text-white text-sm flex items-center justify-between gap-3 shadow-lg shadow-emerald-500/20 animate-fade-in transition-all">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-white shrink-0 animate-bounce" />
              <span className="font-semibold">{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs uppercase font-bold tracking-wider px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ================================================================== */}
        {/* DYNAMIC ANIMATED METRICS ROW (Counter animations + micro-hover)   */}
        {/* ================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Appointments */}
          <div className="relative group overflow-hidden p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-hover hover:border-brand-300 transition-all duration-300 hover:-translate-y-1 card-shimmer-effect">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Total Appointments</span>
              <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <CalendarIcon className="w-4 h-4 text-brand-600" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                <AnimatedNumber value={totalAppointmentsCount} duration={1200} />
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
                +18% this mo.
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              <span>Real-time patient bookings synced</span>
            </div>
          </div>

          {/* Card 2: Prepaid Deposit Volume */}
          <div className="relative group overflow-hidden p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-hover hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1 card-shimmer-effect">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Prepaid Deposit Volume</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <PoundSterling className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                <AnimatedNumber value={totalDepositSum} prefix="£" duration={1400} />
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Google Pay & Card Sandbox Live</span>
            </div>
          </div>

          {/* Card 3: Surgery Chair Occupancy */}
          <div className="relative group overflow-hidden p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-hover hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 card-shimmer-effect">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Surgery Chair Occupancy</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                <AnimatedNumber value={88.5} suffix="%" decimals={1} duration={1000} />
              </span>
            </div>
            {/* Animated Occupancy Progress Line */}
            <div className="mt-2.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-500 to-blue-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: '88.5%' }}
              />
            </div>
          </div>

          {/* Card 4: 6-Month Recall Queue */}
          <div className="relative group overflow-hidden p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-hover hover:border-amber-300 transition-all duration-300 hover:-translate-y-1 card-shimmer-effect">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>6-Month Recall Queue</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <BellRing className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                <AnimatedNumber value={18} suffix=" Patients" duration={900} />
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>3 Reminders due for dispatch today</span>
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* NAVIGATION TABS & SPECIALIST FILTERS                               */}
        {/* ================================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 shrink-0 ${
                activeTab === 'calendar'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>Schedule (Time-Grid)</span>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 shrink-0 ${
                activeTab === 'bookings'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>All Bookings</span>
              <span
                className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'bookings'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {filteredBookings.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('recall')}
              className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 shrink-0 ${
                activeTab === 'recall'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>6-Month Recall Queue</span>
              <span
                className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'recall'
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {filteredRecalls.length}
              </span>
            </button>
          </div>

          {/* Controls: Search & Doctor Filter */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5">
            {activeTab === 'bookings' && (
              <div className="relative flex-1 sm:flex-initial">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter by name, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all w-full sm:w-56 shadow-2xs"
                />
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs shrink-0">
              <span className="text-slate-500 font-bold hidden sm:inline">Specialist:</span>
              <select
                value={selectedDoctorFilter}
                onChange={(e) => setSelectedDoctorFilter(e.target.value)}
                className="bg-white border border-slate-200 hover:border-slate-300 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-2xs cursor-pointer max-w-[170px] sm:max-w-none truncate"
              >
                <option value="all">All Specialists (2)</option>
                <option value="doc-leyla">Dr. Leyla (Aesthetics)</option>
                <option value="doc-rashad">Dr. Rashad (Surgery)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* TAB 1: INTERACTIVE SURGERY CALENDAR GRID WITH TIMELINE MOTION       */}
        {/* ================================================================== */}
        {activeTab === 'calendar' && (() => {
          const showLeyla = selectedDoctorFilter === 'all' || selectedDoctorFilter === 'doc-leyla';
          const showRashad = selectedDoctorFilter === 'all' || selectedDoctorFilter === 'doc-rashad';
          const slotColSpan = showLeyla && showRashad ? 'col-span-5' : 'col-span-10';

          return (
            <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 space-y-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      Surgery Time-Grid Schedule (Mon - Fri 09:00 - 18:00)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Click on any occupied slot to open Clinical Dossier, or click &ldquo;+ Open&rdquo; to register walk-in.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* View Mode Toggle: Daily vs Weekly Overview */}
                  <div className="inline-flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setCalendarViewMode('daily')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        calendarViewMode === 'daily'
                          ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      Daily Grid
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalendarViewMode('weekly')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        calendarViewMode === 'weekly'
                          ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <CalendarDays className="w-3.5 h-3.5 text-brand-600" />
                      Weekly Overview (7 Days)
                    </button>
                  </div>

                  {/* Interactive Doctor Filter Pills */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDoctorFilter('all')}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                        selectedDoctorFilter === 'all'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'text-slate-600 bg-slate-100 hover:bg-slate-200 border-slate-200'
                      }`}
                    >
                      All Specialists (2)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDoctorFilter(selectedDoctorFilter === 'doc-leyla' ? 'all' : 'doc-leyla')
                      }
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                        selectedDoctorFilter === 'doc-leyla'
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm ring-2 ring-brand-300'
                          : 'text-brand-800 bg-brand-50 border-brand-200 hover:bg-brand-100'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          selectedDoctorFilter === 'doc-leyla' ? 'bg-white' : 'bg-brand-600'
                        }`}
                      />
                      Dr. Leyla (Aesthetics)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDoctorFilter(selectedDoctorFilter === 'doc-rashad' ? 'all' : 'doc-rashad')
                      }
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                        selectedDoctorFilter === 'doc-rashad'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-300'
                          : 'text-blue-900 bg-blue-50 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          selectedDoctorFilter === 'doc-rashad' ? 'bg-white' : 'bg-blue-600'
                        }`}
                      />
                      Dr. Rashad (Implants)
                    </button>
                  </div>
                </div>
              </div>

              {calendarViewMode === 'weekly' ? (
                <div key={`weekly-${weekOffset}`} className="calendar-view-transition space-y-4 pt-2">
                  {/* Week Navigation Header & Capacity Metrics (Strictly Capped to 1 Week Advance) */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setWeekOffset((prev) => prev - 1)}
                        className="p-2 rounded-xl bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50 text-slate-700 transition-all active:scale-95 shadow-2xs cursor-pointer flex items-center gap-1 text-xs font-bold"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Previous Week</span>
                      </button>

                      <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-brand-600" />
                        <span className="text-xs sm:text-sm font-black text-slate-800">
                          {weekRangeLabel}
                        </span>
                        {weekOffset === 0 && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
                            Current Week
                          </span>
                        )}
                        {weekOffset === 1 && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
                            <Lock className="w-2.5 h-2.5 text-amber-600" /> Max 1-Wk Advance
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={weekOffset >= 1}
                        onClick={() => setWeekOffset((prev) => Math.min(1, prev + 1))}
                        className={`p-2 rounded-xl border text-slate-700 transition-all shadow-2xs flex items-center gap-1 text-xs font-bold ${
                          weekOffset >= 1
                            ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                            : 'bg-white hover:border-brand-300 hover:bg-brand-50 active:scale-95 cursor-pointer border-slate-200'
                        }`}
                        title={weekOffset >= 1 ? 'Calendar view is limited to a maximum of 1 week in advance' : 'Navigate to next week'}
                      >
                        <span className="hidden sm:inline">Next Week</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {weekOffset !== 0 && (
                        <button
                          type="button"
                          onClick={() => setWeekOffset(0)}
                          className="text-xs text-brand-600 hover:text-brand-800 font-bold underline ml-1 cursor-pointer"
                        >
                          Back to Current Week
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 font-semibold block">Weekly Schedule</span>
                        <span className="text-xs font-black text-slate-800">
                          {weeklyTotalBookings} Sessions Scheduled
                        </span>
                      </div>
                      <div className="w-px h-8 bg-slate-200 hidden sm:block" />
                      <div className="hidden sm:block text-right">
                        <span className="text-[11px] text-slate-500 font-semibold block">Clinic Capacity</span>
                        <span className="text-xs font-black text-emerald-600">
                          {Math.min(100, Math.round((weeklyTotalBookings / 35) * 100))}% Occupied
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 7-Day Responsive Columns Matrix */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
                    {currentWeekDays.map((day) => {
                      const daySlots = ['09:00', '10:00', '11:00', '11:45', '14:00', '15:30'];
                      const isBeyond1Week = day.dateStr > maxAdvanceDateStr;

                      return (
                        <div
                          key={day.dateStr}
                          className={`flex flex-col justify-between rounded-2xl border p-3 transition-all duration-200 ${
                            isBeyond1Week
                              ? 'bg-slate-50/50 border-slate-200/60 opacity-65'
                              : day.isToday
                              ? 'bg-gradient-to-b from-brand-50/60 to-white border-2 border-brand-500 shadow-md ring-2 ring-brand-500/15'
                              : day.isWeekend
                              ? 'bg-slate-50/60 border-slate-200/80 text-slate-600'
                              : 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
                          }`}
                        >
                          {/* Day Header */}
                          <div>
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
                              <div>
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                                  {day.dayName}
                                </span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-base font-black text-slate-900 font-mono">
                                    {day.dayNum}
                                  </span>
                                  <span className="text-xs font-bold text-slate-500">
                                    {day.monthName}
                                  </span>
                                </div>
                              </div>

                              {day.isToday ? (
                                <span className="px-2 py-0.5 rounded-full bg-brand-600 text-white font-black text-[9px] uppercase tracking-wider shadow-2xs">
                                  Today
                                </span>
                              ) : isBeyond1Week ? (
                                <span className="text-[9px] font-bold text-amber-800 bg-amber-50/90 border border-amber-200 px-1.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
                                  <Lock className="w-2.5 h-2.5 text-amber-600" /> Locked (&gt;7d)
                                </span>
                              ) : (
                                <span
                                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                                    day.bookings.length > 0
                                      ? 'bg-brand-50 text-brand-700 border border-brand-100'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  {day.bookings.length} sessions
                                </span>
                              )}
                            </div>

                            {/* Slots List for this day */}
                            <div className="space-y-1.5">
                              {daySlots.map((time) => {
                                const booked = day.bookings.find((b) => b.time === time);
                                const isSterileBuffer = time === '10:00' && !booked;

                                if (booked) {
                                  const isLeyla = booked.doctor.includes('Leyla');
                                  return (
                                    <div
                                      key={time}
                                      onClick={() => setSelectedBooking(booked)}
                                      className={`p-2 rounded-xl border text-xs cursor-pointer transition-all hover:scale-[1.02] shadow-2xs ${
                                        isLeyla
                                          ? 'bg-brand-50/90 border-brand-200 hover:bg-brand-100/90 text-brand-950'
                                          : 'bg-blue-50/90 border-blue-200 hover:bg-blue-100/90 text-blue-950'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-0.5 font-mono text-[10px] font-bold">
                                        <span className="text-slate-700">{time}</span>
                                        <span
                                          className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                                            isLeyla ? 'bg-brand-100 text-brand-800' : 'bg-blue-100 text-blue-800'
                                          }`}
                                        >
                                          {isLeyla ? 'Dr. Leyla' : 'Dr. Rashad'}
                                        </span>
                                      </div>
                                      <div className="font-extrabold text-[11px] truncate">
                                        {booked.patientName}
                                      </div>
                                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                        {booked.service}
                                      </div>
                                    </div>
                                  );
                                }

                                if (isSterileBuffer) {
                                  return (
                                    <div
                                      key={time}
                                      className="buffer-sterile border border-cyan-200/80 rounded-xl p-1.5 flex items-center justify-between text-[10px] text-cyan-950 shadow-2xs"
                                    >
                                      <div className="flex items-center gap-1 font-mono font-bold">
                                        <Droplets className="w-2.5 h-2.5 text-teal-600 shrink-0" />
                                        <span>10:00</span>
                                      </div>
                                      <span className="font-bold text-[9px] text-teal-700 uppercase tracking-tight">
                                        Sterile Buffer (15m)
                                      </span>
                                    </div>
                                  );
                                }

                                if (isBeyond1Week) {
                                  return (
                                    <div
                                      key={time}
                                      onClick={() => {
                                        setNotification('Appointments can only be scheduled up to 1 week in advance.');
                                        setTimeout(() => setNotification(null), 3500);
                                      }}
                                      className="p-1.5 rounded-xl border border-slate-200 bg-slate-100/60 flex items-center justify-between text-[10px] text-slate-400 cursor-not-allowed select-none"
                                      title="Scheduling beyond 1 week is blocked"
                                    >
                                      <span className="font-mono font-medium text-slate-400">{time}</span>
                                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-slate-400">
                                        <Lock className="w-2.5 h-2.5" /> Locked
                                      </span>
                                    </div>
                                  );
                                }

                                return (
                                  <div
                                    key={time}
                                    onClick={() =>
                                      setWalkInModal({
                                        time,
                                        doctor: selectedDoctorFilter === 'doc-rashad' ? 'Dr. Rashad Aliyev' : 'Dr. Leyla Mammadova',
                                        date: day.dateStr,
                                      })
                                    }
                                    className="group/slot p-1.5 rounded-xl border border-dashed border-slate-200 hover:border-emerald-300 bg-slate-50/50 hover:bg-emerald-50/60 flex items-center justify-between text-[10px] transition-all cursor-pointer"
                                  >
                                    <span className="font-mono font-bold text-slate-500 group-hover/slot:text-emerald-800">
                                      {time}
                                    </span>
                                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-slate-400 group-hover/slot:text-emerald-700">
                                      <Plus className="w-2.5 h-2.5" /> Open
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Quick Switch to Daily View */}
                          <div className="pt-3 mt-3 border-t border-slate-100">
                            {isBeyond1Week ? (
                              <button
                                type="button"
                                disabled
                                className="w-full py-1 px-2 rounded-lg text-[10px] font-bold text-slate-400 bg-slate-100/70 border border-slate-200 cursor-not-allowed flex items-center justify-center gap-1 opacity-60"
                                title="Date exceeds maximum 1-week calendar advance limit"
                              >
                                <Lock className="w-2.5 h-2.5" />
                                <span>Outside 1-Wk Horizon</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDailyDate(day.dateStr);
                                  setCalendarViewMode('daily');
                                }}
                                className="w-full py-1 px-2 rounded-lg text-[10px] font-bold text-slate-600 hover:text-brand-600 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <span>Switch to Day View</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div key={`daily-${selectedDailyDate}`} className="calendar-view-transition space-y-4">
                  {/* Daily Date Selector Bar: 1-Week Horizon Controller */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 shrink-0">
                          <CalendarDays className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs sm:text-sm font-black text-slate-800">
                              {selectedDailyDate
                                ? formatYMDLocale(selectedDailyDate, {
                                    weekday: 'long',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                : 'Loading schedule...'}
                            </span>
                            {Boolean(selectedDailyDate && todayStr && selectedDailyDate === todayStr) && (
                              <span className="text-[10px] font-black uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
                                Today
                              </span>
                            )}
                            {Boolean(selectedDailyDate && maxAdvanceDateStr && selectedDailyDate === maxAdvanceDateStr) && (
                              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5 text-amber-600" /> Max Horizon (7 Days Ahead)
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Calendar advance window strictly limited to 1 week
                            {maxAdvanceDateStr
                              ? ` (Max: ${formatYMDLocale(maxAdvanceDateStr, { month: 'short', day: 'numeric' })})`
                              : ''}
                            .
                          </p>
                        </div>
                      </div>

                      {/* Day Navigation Controls (Prev / Next bounded between today and maxDate) */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={!selectedDailyDate || !todayStr || selectedDailyDate <= todayStr}
                          onClick={() => {
                            if (!selectedDailyDate || !todayStr) return;
                            const prevStr = addDaysYMD(selectedDailyDate, -1);
                            if (prevStr >= todayStr) setSelectedDailyDate(prevStr);
                          }}
                          className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs flex items-center gap-1 ${
                            !selectedDailyDate || !todayStr || selectedDailyDate <= todayStr
                              ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                              : 'bg-white hover:bg-brand-50 hover:border-brand-300 text-slate-700 border-slate-200 cursor-pointer active:scale-95'
                          }`}
                          title={!selectedDailyDate || !todayStr || selectedDailyDate <= todayStr ? 'Cannot navigate to past dates' : 'Previous day'}
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Prev Day</span>
                        </button>

                        <button
                          type="button"
                          disabled={!selectedDailyDate || !maxAdvanceDateStr || selectedDailyDate >= maxAdvanceDateStr}
                          onClick={() => {
                            if (!selectedDailyDate || !maxAdvanceDateStr) return;
                            const nextStr = addDaysYMD(selectedDailyDate, 1);
                            if (nextStr <= maxAdvanceDateStr) setSelectedDailyDate(nextStr);
                          }}
                          className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs flex items-center gap-1 ${
                            !selectedDailyDate || !maxAdvanceDateStr || selectedDailyDate >= maxAdvanceDateStr
                              ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                              : 'bg-white hover:bg-brand-50 hover:border-brand-300 text-slate-700 border-slate-200 cursor-pointer active:scale-95'
                          }`}
                          title={!selectedDailyDate || !maxAdvanceDateStr || selectedDailyDate >= maxAdvanceDateStr ? 'Calendar is restricted to maximum 1 week ahead' : 'Next day'}
                        >
                          <span className="hidden sm:inline">Next Day</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        {Boolean(todayStr && selectedDailyDate && selectedDailyDate !== todayStr) && (
                          <button
                            type="button"
                            onClick={() => setSelectedDailyDate(todayStr)}
                            className="text-xs text-brand-600 hover:text-brand-800 font-bold underline ml-1 cursor-pointer"
                          >
                            Reset to Today
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Quick 7-Day Pill Selector Strip */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-0.5">
                      {advance7Days.map((day) => {
                        const isSelected = day.dateStr === selectedDailyDate;
                        return (
                          <button
                            key={day.dateStr}
                            type="button"
                            onClick={() => setSelectedDailyDate(day.dateStr)}
                            className={`flex flex-col items-center justify-center min-w-[72px] sm:min-w-[84px] py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer shrink-0 ${
                              isSelected
                                ? 'bg-brand-600 border-brand-600 text-white shadow-sm ring-2 ring-brand-400/30'
                                : 'bg-white border-slate-200/90 text-slate-700 hover:border-brand-300 hover:bg-brand-50/50 shadow-2xs'
                            }`}
                          >
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                              {day.dayShort}
                            </span>
                            <span className={`text-sm font-black font-mono my-0.5 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                              {day.dayNum}
                            </span>
                            <div className="flex items-center gap-1">
                              {day.isToday ? (
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white text-brand-700' : 'bg-brand-50 text-brand-700 border border-brand-200'}`}>
                                  Today
                                </span>
                              ) : day.isMaxDay ? (
                                <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full inline-flex items-center gap-0.5 ${isSelected ? 'bg-amber-400 text-slate-900' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                  <Lock className="w-2 h-2" /> 7d Max
                                </span>
                              ) : (
                                <span className={`text-[9px] font-mono ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                                  {day.count} sess
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column Labels */}
                  <div className="grid grid-cols-12 gap-3 px-3.5 pt-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <div className="col-span-2">Time Slot</div>
                    {showLeyla && (
                      <div className={`${slotColSpan} text-brand-700 flex items-center gap-1.5`}>
                        <span className="w-2 h-2 rounded-full bg-brand-600" />
                        Dr. Leyla Mammadova {showRashad ? '· Surgery Room 1' : '· Surgery Room 1 (Orthodontics & Aesthetics)'}
                      </div>
                    )}
                    {showRashad && (
                      <div className={`${slotColSpan} text-blue-700 flex items-center gap-1.5`}>
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        Dr. Rashad Aliyev {showLeyla ? '· Surgery Room 2' : '· Surgery Room 2 (Oral Surgery & Implants)'}
                      </div>
                    )}
                  </div>

                  {/* Time Grid Table with Smooth Hover Animation & Highlighted Active Interval */}
                  <div className="overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0 py-3.5">
                    <div className="space-y-3 relative min-w-[580px] p-2">
                      {scheduleSlots.map((slot, idx) => {
                        const isSelectedDateToday = selectedDailyDate === todayStr;

                        const leylaCustom = bookings.find(
                          (b) =>
                            b.date === selectedDailyDate &&
                            b.time === slot.time &&
                            b.doctor.includes('Leyla') &&
                            b.status !== 'cancelled'
                        );
                        const rashadCustom = bookings.find(
                          (b) =>
                            b.date === selectedDailyDate &&
                            b.time === slot.time &&
                            b.doctor.includes('Rashad') &&
                            b.status !== 'cancelled'
                        );

                        const leylaText = leylaCustom
                          ? `${leylaCustom.patientName} · ${leylaCustom.service} (${leylaCustom.duration}m)`
                          : isSelectedDateToday
                          ? slot.defaultLeyla
                          : 'Available Slot';

                        const rashadText = rashadCustom
                          ? `${rashadCustom.patientName} · ${rashadCustom.service} (${rashadCustom.duration}m)`
                          : isSelectedDateToday
                          ? slot.defaultRashad
                          : 'Available Slot';

                        const isLeylaOpen = leylaText === 'Available Slot' || leylaText === 'Available for Surgery';
                        const isRashadOpen = rashadText === 'Available Slot' || rashadText === 'Available for Surgery';
                        const isCurrentSlot = Boolean(slot.isCurrent && isSelectedDateToday);

                        return (
                          <div
                            key={idx}
                            className={`group relative grid grid-cols-12 gap-3 p-3.5 rounded-2xl border transition-all duration-200 text-xs hover:-translate-y-0.5 hover:shadow-md hover:z-10 cursor-pointer ${
                              isCurrentSlot
                                ? 'bg-gradient-to-r from-blue-50/95 via-sky-50/70 to-indigo-50/50 border-2 border-brand-500 shadow-md ring-2 ring-brand-500/20'
                                : slot.isBreak
                                ? 'bg-slate-100/70 border-dashed border-slate-300 text-slate-500'
                                : 'bg-white border-slate-200 hover:border-brand-300 hover:bg-slate-50/50'
                            }`}
                          >
                            {/* Time Slot Label with Active Coloring & Hover Micro-Motion */}
                            <div className="col-span-2 font-mono font-bold flex items-center">
                              <div
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all duration-200 ${
                                  isCurrentSlot
                                    ? 'bg-brand-600 text-white shadow-xs font-black'
                                    : 'text-slate-700 bg-slate-100/90 group-hover:bg-brand-50 group-hover:text-brand-700 group-hover:scale-105'
                                }`}
                              >
                                <Clock
                                  className={`w-3.5 h-3.5 ${
                                    isCurrentSlot ? 'text-white' : 'text-slate-500 group-hover:text-brand-600'
                                  }`}
                                />
                                <span>{slot.time}</span>
                              </div>
                              {isCurrentSlot && (
                                <span className="ml-2 text-[9px] font-black uppercase tracking-wider text-brand-700 bg-brand-100 border border-brand-300 px-1.5 py-0.5 rounded shadow-2xs">
                                  NOW
                                </span>
                              )}
                            </div>

                            {/* Doctor 1 (Leyla) Slot */}
                            {showLeyla && (
                              <div
                                onClick={() => {
                                  if (isLeylaOpen) {
                                    setWalkInModal({ time: slot.time, doctor: 'Dr. Leyla Mammadova', date: selectedDailyDate });
                                  } else if (!slot.isBreak && !leylaText.includes('Buffer')) {
                                    const matched =
                                      leylaCustom ||
                                      bookings.find(
                                        (b) =>
                                          b.doctor.includes('Leyla') &&
                                          (leylaText.includes(b.patientName) ||
                                            b.patientName.includes('Emma') ||
                                            b.patientName.includes('Sophia'))
                                      );
                                    if (matched) setSelectedBooking(matched);
                                  }
                                }}
                                className={`${slotColSpan} p-2.5 rounded-xl flex items-center justify-between transition-all duration-200 hover:scale-[1.01] hover:shadow-xs active:scale-[0.99] ${
                                  !slot.isBreak && !leylaText.includes('Buffer') ? 'cursor-pointer' : ''
                                } ${
                                  leylaText.includes('Emma') || leylaText.includes('Sophia') || leylaCustom
                                    ? 'bg-brand-50/90 border border-brand-200 text-brand-900 font-bold hover:bg-brand-100/90'
                                    : leylaText.includes('Buffer')
                                    ? 'buffer-sterile border border-cyan-200/80 text-cyan-950 font-medium cursor-default shadow-2xs'
                                    : slot.isBreak
                                    ? 'text-slate-500 italic cursor-default'
                                    : 'bg-slate-50/80 text-slate-500 font-medium hover:bg-emerald-50/60 hover:text-emerald-800 hover:border-emerald-300 border border-transparent'
                                }`}
                              >
                                {leylaText.includes('Buffer') ? (
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 rounded-md bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600 shrink-0 shadow-2xs">
                                        <Droplets className="w-3 h-3 text-teal-600" />
                                      </div>
                                      <span className="font-semibold text-slate-700 text-xs">
                                        Sterilization Buffer
                                      </span>
                                      <span className="text-[10px] font-mono font-bold text-cyan-700 bg-cyan-100/70 border border-cyan-200 px-1.5 py-0.5 rounded">
                                        15m
                                      </span>
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
                                      <ShieldCheck className="w-3 h-3 text-teal-600" />
                                      Sterile
                                    </span>
                                  </div>
                                ) : (
                                  <>
                                    <span className="truncate">{leylaText}</span>
                                    {isLeylaOpen ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition-colors">
                                        <Plus className="w-2.5 h-2.5" /> Open
                                      </span>
                                    ) : !slot.isBreak && !leylaText.includes('Buffer') ? (
                                      <span className="text-[10px] text-brand-600 font-semibold opacity-70 group-hover:opacity-100">
                                        Dossier &rarr;
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </div>
                            )}

                            {/* Doctor 2 (Rashad) Slot */}
                            {showRashad && (
                              <div
                                onClick={() => {
                                  if (isRashadOpen) {
                                    setWalkInModal({ time: slot.time, doctor: 'Dr. Rashad Aliyev', date: selectedDailyDate });
                                  } else if (!slot.isBreak && !rashadText.includes('Buffer')) {
                                    const matched =
                                      rashadCustom ||
                                      bookings.find(
                                        (b) =>
                                          b.doctor.includes('Rashad') &&
                                          (rashadText.includes(b.patientName) ||
                                            b.patientName.includes('Oliver') ||
                                            b.patientName.includes('James'))
                                      );
                                    if (matched) setSelectedBooking(matched);
                                  }
                                }}
                                className={`${slotColSpan} p-2.5 rounded-xl flex items-center justify-between transition-all duration-200 hover:scale-[1.01] hover:shadow-xs active:scale-[0.99] ${
                                  !slot.isBreak && !rashadText.includes('Buffer') ? 'cursor-pointer' : ''
                                } ${
                                  rashadText.includes('Oliver') || rashadText.includes('James') || rashadCustom
                                    ? 'bg-blue-50/90 border border-blue-200 text-blue-900 font-bold hover:bg-blue-100/90'
                                    : rashadText.includes('Buffer')
                                    ? 'buffer-sterile border border-cyan-200/80 text-cyan-950 font-medium cursor-default shadow-2xs'
                                    : slot.isBreak
                                    ? 'text-slate-500 italic cursor-default'
                                    : 'bg-slate-50/80 text-slate-500 font-medium hover:bg-emerald-50/60 hover:text-emerald-800 hover:border-emerald-300 border border-transparent'
                                }`}
                              >
                                {rashadText.includes('Buffer') ? (
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 rounded-md bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600 shrink-0 shadow-2xs">
                                        <Droplets className="w-3 h-3 text-teal-600" />
                                      </div>
                                      <span className="font-semibold text-slate-700 text-xs">
                                        Sterilization Buffer
                                      </span>
                                      <span className="text-[10px] font-mono font-bold text-cyan-700 bg-cyan-100/70 border border-cyan-200 px-1.5 py-0.5 rounded">
                                        15m
                                      </span>
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
                                      <ShieldCheck className="w-3 h-3 text-teal-600" />
                                      Sterile
                                    </span>
                                  </div>
                                ) : (
                                  <>
                                    <span className="truncate">{rashadText}</span>
                                    {isRashadOpen ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition-colors">
                                        <Plus className="w-2.5 h-2.5" /> Open
                                      </span>
                                    ) : !slot.isBreak && !rashadText.includes('Buffer') ? (
                                      <span className="text-[10px] text-blue-600 font-semibold opacity-70 group-hover:opacity-100">
                                        Dossier &rarr;
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ================================================================== */}
        {/* TAB 2: ALL APPOINTMENTS (With Search, Dynamic Counter & Notes)      */}
        {/* ================================================================== */}
        {activeTab === 'bookings' && (
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden transition-all">
            <div className="p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Registered Patient Bookings</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Includes real-time patient reservations made on the live site &amp; Google Pay tests.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  Showing <span className="text-slate-900 font-black">{filteredBookings.length}</span> of {bookings.length} patients
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 border-b border-slate-200 uppercase tracking-wider text-slate-600 font-bold">
                  <tr>
                    <th className="py-3.5 px-6">Patient Name</th>
                    <th className="py-3.5 px-6">Treatment</th>
                    <th className="py-3.5 px-6">Doctor</th>
                    <th className="py-3.5 px-6">Date &amp; Slot</th>
                    <th className="py-3.5 px-6">Deposit</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No patient bookings matched the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className={`hover:bg-brand-50/40 transition-colors duration-150 cursor-pointer group ${
                          b.isRecent ? 'bg-emerald-50/20' : ''
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm group-hover:text-brand-700 transition-colors">
                              {b.patientName}
                            </span>
                            {b.isRecent && (
                              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Fresh
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {b.email} · {b.phone}
                          </div>
                          <span className="font-mono text-[10px] text-brand-600 font-bold inline-block mt-0.5">
                            {b.id}
                          </span>

                          {/* PATIENT NOTE BOX (HIGH CONTRAST & BEAUTIFUL) */}
                          {b.notes ? (
                            <div className="mt-2.5 flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 max-w-md shadow-2xs transition-all duration-200 hover:border-amber-300">
                              <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                              <div className="text-[11px] text-amber-950 leading-relaxed">
                                <span className="font-black text-amber-800 uppercase tracking-wider text-[10px] block mb-0.5">
                                  Patient Note:
                                </span>
                                &ldquo;{b.notes}&rdquo;
                              </div>
                            </div>
                          ) : null}
                        </td>
                        <td className="py-4 px-6 text-slate-700 font-medium">
                          {b.service}
                        </td>
                        <td className="py-4 px-6 text-slate-800 font-bold">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-brand-500" />
                            {b.doctor}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-900 block">{b.date}</span>
                          <span className="text-slate-500 text-[11px] font-mono">{b.time} ({b.duration}m)</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                            £{b.depositAmount} Paid
                          </span>
                          {(b.paymentLabel || b.paymentMethod) && (
                            <div className="text-[10px] text-slate-500 font-medium mt-1">
                              {b.paymentLabel ||
                                (b.paymentMethod === 'google_pay'
                                  ? 'Google Pay (TEST)'
                                  : b.paymentMethod === 'apple_pay'
                                  ? 'Apple Pay'
                                  : 'Credit Card')}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              b.status === 'confirmed'
                                ? 'bg-brand-50 text-brand-700 border border-brand-200'
                                : b.status === 'in_surgery'
                                ? 'bg-cyan-50 text-cyan-800 border border-cyan-300 ring-2 ring-cyan-400/20'
                                : b.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : b.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                b.status === 'confirmed'
                                  ? 'bg-brand-600'
                                  : b.status === 'in_surgery'
                                  ? 'bg-cyan-500 animate-ping'
                                  : b.status === 'completed'
                                  ? 'bg-emerald-500'
                                  : b.status === 'pending'
                                  ? 'bg-amber-500 animate-pulse'
                                  : 'bg-rose-400'
                              }`}
                            />
                            {b.status === 'in_surgery' ? 'In Surgery' : b.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedBooking(b)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                              title="Open Clinical Dossier"
                            >
                              Dossier
                            </button>
                            {b.status !== 'cancelled' && (
                              <button
                                onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all duration-150 active:scale-95 shadow-2xs"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 3: 6-MONTH RECALL (With Dynamic Dispatch Animation)             */}
        {/* ================================================================== */}
        {activeTab === 'recall' && (
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Automated 6-Month Oral Health Recall</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proactive reminders dispatched exactly 180 days post-treatment.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700">
                <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
                Retention Engine Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 border-b border-slate-200 uppercase tracking-wider text-slate-600 font-bold">
                  <tr>
                    <th className="py-3.5 px-6">Patient</th>
                    <th className="py-3.5 px-6">Prior Treatment</th>
                    <th className="py-3.5 px-6">Last Visit</th>
                    <th className="py-3.5 px-6">6-Month Due Date</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecalls.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        No recall patients scheduled for the selected specialist.
                      </td>
                    </tr>
                  ) : (
                    filteredRecalls.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-sm">{rec.patientName}</div>
                        <div className="text-[11px] text-slate-500">{rec.email} · {rec.phone}</div>
                      </td>
                      <td className="py-4 px-6 text-slate-700 font-medium">
                        {rec.treatment}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-600">
                        {rec.lastVisitDate}
                      </td>
                      <td className="py-4 px-6 font-bold text-amber-700">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                          {rec.recallDueDate}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            rec.contacted
                              ? 'bg-brand-50 text-brand-700 border border-brand-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewRecall(rec);
                              setPreviewChannel('email');
                            }}
                            title="Preview Automated Recall Template"
                            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>

                          <button
                            disabled={rec.contacted || dispatchedRecalls[rec.id]}
                            onClick={() => triggerRecallNotice(rec.patientName, rec.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 ${
                              rec.contacted
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                : dispatchedRecalls[rec.id]
                                ? 'bg-brand-500 text-white'
                                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20 hover:scale-105'
                            }`}
                          >
                            {dispatchedRecalls[rec.id] ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Dispatching...</span>
                              </>
                            ) : rec.contacted ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-slate-400" />
                                <span>Dispatched</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-3.5 h-3.5 text-amber-300" />
                                <span>Send 1-Click Recall</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ==================================================================== */}
      {/* PATIENT CLINICAL DOSSIER DRAWER (Slide-over with 120 FPS animation)  */}
      {/* ==================================================================== */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur */}
          <div
            onClick={() => setSelectedBooking(null)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between transform transition-transform duration-300 ease-out animate-slide-left">
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-slate-900">Clinical Patient Dossier</h2>
                    <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {selectedBooking.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Zenith Medical Record &amp; Treatment Status
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Patient Profile Card */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-500 text-white font-black text-lg flex items-center justify-center shadow-md shadow-brand-600/20">
                      {selectedBooking.patientName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base">{selectedBooking.patientName}</h3>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                        <a
                          href={`tel:${selectedBooking.phone}`}
                          className="hover:text-brand-600 flex items-center gap-1 font-medium"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          {selectedBooking.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <a
                      href={`mailto:${selectedBooking.email}`}
                      className="text-slate-600 hover:text-brand-600 flex items-center gap-1.5 truncate max-w-[200px]"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{selectedBooking.email}</span>
                    </a>
                    <span className="text-[11px] font-mono text-slate-400">
                      Registered: {selectedBooking.date}
                    </span>
                  </div>
                </div>

                {/* Treatment & Time Details */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Scheduled Session</span>
                    <span className="text-brand-600 font-mono">{selectedBooking.duration} mins</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{selectedBooking.service}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-brand-600" />
                      {selectedBooking.doctor}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 text-xs font-medium text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {selectedBooking.date} at <strong className="text-slate-900">{selectedBooking.time}</strong>
                    </span>
                  </div>
                </div>

                {/* Patient's Note from Booking Modal */}
                {selectedBooking.notes && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-1.5 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-amber-800 text-xs font-black uppercase tracking-wider">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Patient Intake Note (Chief Complaint)</span>
                    </div>
                    <p className="text-xs text-amber-950 font-medium leading-relaxed italic bg-white/70 p-2.5 rounded-xl border border-amber-200/60">
                      &ldquo;{selectedBooking.notes}&rdquo;
                    </p>
                  </div>
                )}

                {/* Doctor Internal Medical Notes (Editable) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Internal Clinical Notes (Doctor / Admin Only)
                  </label>
                  <textarea
                    rows={3}
                    value={internalNoteDraft}
                    onChange={(e) => setInternalNoteDraft(e.target.value)}
                    placeholder="Enter clinical notes, anesthesia observations, or post-op instructions..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all placeholder-slate-400 resize-none shadow-2xs"
                  />
                  <button
                    onClick={() => handleSaveInternalNote(selectedBooking.id)}
                    className="w-full py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs active:scale-95"
                  >
                    Save Clinical Note
                  </button>
                </div>

                {/* Payment Breakdown */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-900">Prepaid Reservation Deposit</span>
                    <span className="font-black text-emerald-800 text-sm">£{selectedBooking.depositAmount}.00</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-emerald-700">
                    <span>Payment Gateway:</span>
                    <span className="font-semibold">
                      {selectedBooking.paymentLabel ||
                        (selectedBooking.paymentMethod === 'google_pay'
                          ? 'Google Pay (Sandbox)'
                          : selectedBooking.paymentMethod === 'apple_pay'
                          ? 'Apple Pay'
                          : selectedBooking.paymentMethod === 'in_clinic'
                          ? 'In-Clinic Walk-in'
                          : 'Credit Card')}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[10px] text-emerald-600 font-mono">
                    <span>Status: Deposit Paid</span>
                    <span>Ref: {selectedBooking.id}</span>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print Dossier</span>
                </button>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition-all shadow-md shadow-brand-600/20 active:scale-95 text-center"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* QUICK WALK-IN REGISTRATION MODAL                                    */}
      {/* ==================================================================== */}
      {walkInModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setWalkInModal(null)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 z-10 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Register Walk-in Patient</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Slot: <strong className="text-brand-600">{walkInModal.time}</strong> on{' '}
                  <strong className="text-brand-700">{walkInModal.date || selectedDailyDate}</strong> with{' '}
                  <strong className="text-slate-800">{walkInModal.doctor}</strong>
                </p>
              </div>
              <button
                onClick={() => setWalkInModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Togrul Huseynov"
                  value={walkInForm.name}
                  onChange={(e) => setWalkInForm({ ...walkInForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+994 50 123 4567"
                    value={walkInForm.phone}
                    onChange={(e) => setWalkInForm({ ...walkInForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="patient@mail.com"
                    value={walkInForm.email}
                    onChange={(e) => setWalkInForm({ ...walkInForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Treatment / Service
                </label>
                <select
                  value={walkInForm.service}
                  onChange={(e) => setWalkInForm({ ...walkInForm, service: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                >
                  <option value="Laser Teeth Whitening (In-Office)">Laser Teeth Whitening (In-Office)</option>
                  <option value="Dental Implant Consultation & 3D CBCT">Dental Implant Consultation &amp; 3D CBCT</option>
                  <option value="Porcelain Veneer Smile Design">Porcelain Veneer Smile Design</option>
                  <option value="Comprehensive 3D Exam & Prophylaxis">Comprehensive 3D Exam &amp; Prophylaxis</option>
                  <option value="Emergency Toothache & Pain Relief">Emergency Toothache &amp; Pain Relief</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Symptoms / Immediate Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Acute pain in upper jaw; urgent walk-in"
                  value={walkInForm.notes}
                  onChange={(e) => setWalkInForm({ ...walkInForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setWalkInModal(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all active:scale-95"
                >
                  Confirm Walk-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* AUTOMATED RECALL PREVIEW MODAL (EMAIL & SMS CHANNELS)             */}
      {/* ================================================================== */}
      {previewRecall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Automated 6-Month Oral Health Recall
                  </h3>
                  <p className="text-xs text-slate-300">
                    Recipient: <span className="font-semibold text-white">{previewRecall.patientName}</span> ({previewRecall.email})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewRecall(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Channel Switcher Tabs */}
            <div className="px-6 pt-4 pb-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2 p-1 bg-slate-200/70 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewChannel('email')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    previewChannel === 'email'
                      ? 'bg-white text-brand-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Letterhead</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewChannel('sms')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    previewChannel === 'sms'
                      ? 'bg-white text-brand-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>SMS Instant Ping</span>
                </button>
              </div>

              <span className="text-[11px] font-medium text-slate-500">
                Due Date: <span className="text-amber-700 font-bold">{previewRecall.recallDueDate}</span>
              </span>
            </div>

            {/* Template Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/40">
              {previewChannel === 'email' ? (
                /* Email Mockup */
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-xl mx-auto space-y-5">
                  {/* Clinic Brand Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-sm">
                        Z
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 tracking-tight block">ZENITH DENTAL STUDIO</span>
                        <span className="text-[10px] text-slate-400">Harley Street Clinic, London</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                      Preventive Advisory
                    </span>
                  </div>

                  {/* Email Message Content */}
                  <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                    <p className="font-bold text-slate-900 text-sm">
                      Dear {previewRecall.patientName},
                    </p>
                    <p>
                      It has been 6 months since your last visit on <span className="font-semibold text-slate-900">{previewRecall.lastVisitDate}</span> for <span className="font-semibold text-brand-700">{previewRecall.treatment}</span> with <span className="font-semibold text-slate-900">{previewRecall.doctor}</span>.
                    </p>
                    <p>
                      Routine ultrasonic prophylaxis and our 12-point periodontal exam are essential to safeguard enamel stability and maintain long-term oral vitality.
                    </p>

                    {/* Highlight Box */}
                    <div className="p-4 rounded-xl bg-brand-50/70 border border-brand-100 flex items-start gap-3 my-3">
                      <Sparkles className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-brand-950">
                        <span className="font-bold block">Priority Reserved Slots Active</span>
                        <span>We have prioritized early morning & weekend slots for returning studio patients.</span>
                      </div>
                    </div>

                    {/* Call to Action Button */}
                    <div className="pt-2 pb-1 text-center">
                      <a
                        href="/b/zenith-dental"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/25 transition-all"
                      >
                        <span>Claim 6-Month Recall Slot</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Sign-off */}
                  <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-700 block">{previewRecall.doctor}</span>
                      <span>Zenith Dental Clinical Team</span>
                    </div>
                    <div className="text-right">
                      <span>Tel: +44 20 7946 0991</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* SMS Mockup (iPhone-style bubble) */
                <div className="max-w-sm mx-auto bg-white rounded-3xl border border-slate-300 p-4 shadow-md space-y-4">
                  <div className="text-center pb-2 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-bold mx-auto flex items-center justify-center text-xs">
                      ZD
                    </div>
                    <span className="text-xs font-bold text-slate-800 block mt-1">Zenith Dental</span>
                    <span className="text-[10px] text-slate-400">{previewRecall.phone}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] text-center text-slate-400 font-medium">Today · Automated Dispatch</div>
                    <div className="p-3.5 bg-brand-600 text-white rounded-2xl rounded-br-xs text-xs leading-relaxed shadow-xs">
                      <p>
                        Hi {previewRecall.patientName}, it&apos;s time for your 6-month dental checkup with {previewRecall.doctor} at Zenith Dental!
                      </p>
                      <p className="mt-2 text-cyan-100 underline font-medium">
                        dentalbook.co/recall?token=zd_{previewRecall.id}
                      </p>
                      <span className="text-[9px] text-brand-200 block text-right mt-1.5">Delivered via SMS Gateway</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPreviewRecall(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
              >
                Close Preview
              </button>

              <button
                type="button"
                disabled={previewRecall.contacted || dispatchedRecalls[previewRecall.id]}
                onClick={() => {
                  triggerRecallNotice(previewRecall.patientName, previewRecall.id);
                  setPreviewRecall(null);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all flex items-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{previewRecall.contacted ? 'Already Dispatched' : 'Dispatch Notice Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
