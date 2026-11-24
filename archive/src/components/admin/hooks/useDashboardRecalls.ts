'use client';

import { useState, useMemo } from 'react';
import { playLuxuryChime } from '@/lib/soundscapes';
import { DEFAULT_SEED_RECALLS } from '@/data/seedBookings';
import type { RecallRecord } from '@/components/admin/DashboardRecallTab';

export function useDashboardRecalls(
  selectedDoctorFilter: string,
  setNotification: (msg: string | null) => void
) {
  const [recalls, setRecalls] = useState<RecallRecord[]>(DEFAULT_SEED_RECALLS);
  const [dispatchedRecalls, setDispatchedRecalls] = useState<Record<string, boolean>>({});
  const [previewRecall, setPreviewRecall] = useState<RecallRecord | null>(null);

  const triggerRecallNotice = (patientName: string, id: string) => {
    playLuxuryChime();
    setDispatchedRecalls((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setRecalls((prev) =>
        prev.map((r) => (r.id === id ? { ...r, contacted: true, status: 'Sent via BullMQ' } : r))
      );
      setNotification(`Automated 6-month recall invitation dispatched to ${patientName}!`);
      setTimeout(() => setNotification(null), 4000);
    }, 450);
  };

  // Filter 6-month recalls by selected doctor
  const filteredRecalls = useMemo(() => {
    return recalls.filter((r) => {
      if (selectedDoctorFilter === 'all') return true;
      if (selectedDoctorFilter === 'doc-leyla') return r.doctor.toLowerCase().includes('leyla');
      if (selectedDoctorFilter === 'doc-rashad') return r.doctor.toLowerCase().includes('rashad');
      return true;
    });
  }, [recalls, selectedDoctorFilter]);

  return {
    recalls,
    filteredRecalls,
    dispatchedRecalls,
    triggerRecallNotice,
    previewRecall,
    setPreviewRecall,
  };
}
