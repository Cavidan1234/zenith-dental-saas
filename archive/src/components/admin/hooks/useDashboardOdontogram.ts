'use client';

import { useState } from 'react';
import { playHapticTick } from '@/lib/soundscapes';

export type ToothHealthState = 'sound' | 'restored' | 'surgical' | 'watch';

export function useDashboardOdontogram() {
  const [odontogram, setOdontogram] = useState<Record<number, ToothHealthState>>({});
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  const handleToggleTooth = (toothNumber: number) => {
    playHapticTick();
    setSelectedTooth((prev) => (prev === toothNumber ? null : toothNumber));
    setOdontogram((prev) => {
      const current = prev[toothNumber] || 'sound';
      const order: ToothHealthState[] = ['sound', 'restored', 'surgical', 'watch'];
      const nextIdx = (order.indexOf(current) + 1) % order.length;
      return {
        ...prev,
        [toothNumber]: order[nextIdx],
      };
    });
  };

  const handleSetToothState = (toothNumber: number, state: ToothHealthState) => {
    playHapticTick();
    setOdontogram((prev) => ({
      ...prev,
      [toothNumber]: state,
    }));
  };

  return {
    odontogram,
    selectedTooth,
    setSelectedTooth,
    handleToggleTooth,
    handleSetToothState,
  };
}
