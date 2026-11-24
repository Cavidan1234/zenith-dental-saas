// ============================================================================
// LUXURY WEB AUDIO API SYNTHESIZER (Pure in-browser sensory soundscapes)
// Zero audio assets or MP3s required. Harmonic golden-ratio sine waveforms.
// ============================================================================

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (_) {
    return null;
  }
}

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const val = localStorage.getItem('dentalbook_sound_enabled');
    // Default to true for premium sensory feedback
    return val !== 'false';
  } catch (_) {
    return false;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('dentalbook_sound_enabled', enabled ? 'true' : 'false');
  } catch (_) {}
}

/**
 * Harmonic Golden-Ratio Luxury Chime (432Hz, 540Hz, 648Hz)
 * Used on booking confirmation, recall claimed, and major milestones.
 */
export function playLuxuryChime(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const chord = [432, 540, 648, 864]; // Pure harmonic golden series

  chord.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

    // Ultra-gentle luxury acoustic volume (gain ramp down exponentially)
    gain.gain.setValueAtTime(0.018, now + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.00008, now + idx * 0.08 + 2.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 2.4);
  });
}

/**
 * Micro Haptic Click (1200Hz instant tick)
 * Used on odontogram tooth toggling, stepper tabs, and theme switch.
 */
export function playHapticTick(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

  gain.gain.setValueAtTime(0.012, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}

/**
 * Gentle Success Ping (Dual-tone 528Hz & 660Hz)
 * Used on sync radar, practice settings saved, and reschedule confirmed.
 */
export function playSuccessPing(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  [528, 660].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.06);

    gain.gain.setValueAtTime(0.015, now + idx * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.9);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.06);
    osc.stop(now + idx * 0.06 + 1.0);
  });
}
