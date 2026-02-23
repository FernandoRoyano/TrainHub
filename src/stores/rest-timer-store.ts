import { create } from "zustand";

type TimerMode = "idle" | "countdown" | "paused" | "finished" | "stopwatch";

interface RestTimerState {
  mode: TimerMode;
  totalSeconds: number;
  remainingSeconds: number;
  exerciseName: string | null;
  isExpanded: boolean;
  isMuted: boolean;
  _intervalId: ReturnType<typeof setInterval> | null;
  _previousMode: TimerMode;

  startCountdown: (seconds: number, exerciseName?: string) => void;
  startStopwatch: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  dismiss: () => void;
  toggleExpanded: () => void;
  toggleMute: () => void;
}

let _audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (_audioCtx && _audioCtx.state !== "closed") return _audioCtx;
  try {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    _audioCtx = new AudioCtx();
    return _audioCtx;
  } catch {
    return null;
  }
}

function playTimerAlert(isMuted: boolean) {
  if (isMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    const playBeep = (startTime: number, frequency: number) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.15);
    };
    const now = ctx.currentTime;
    playBeep(now, 880);
    playBeep(now + 0.2, 880);
    playBeep(now + 0.4, 1760);
  } catch {
    // AudioContext not available
  }

  try {
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  } catch {
    // Vibration API not available
  }
}

export const useRestTimerStore = create<RestTimerState>((set, get) => ({
  mode: "idle",
  totalSeconds: 0,
  remainingSeconds: 0,
  exerciseName: null,
  isExpanded: true,
  isMuted: false,
  _intervalId: null,
  _previousMode: "idle",

  startCountdown: (seconds, exerciseName) => {
    if (seconds <= 0) return;
    const { _intervalId } = get();
    if (_intervalId) clearInterval(_intervalId);

    const id = setInterval(() => {
      const state = get();
      if (state.mode !== "countdown") return;

      if (state.remainingSeconds <= 1) {
        clearInterval(state._intervalId!);
        playTimerAlert(state.isMuted);
        set({ remainingSeconds: 0, mode: "finished", _intervalId: null });
      } else {
        set({ remainingSeconds: state.remainingSeconds - 1 });
      }
    }, 1000);

    set({
      mode: "countdown",
      totalSeconds: seconds,
      remainingSeconds: seconds,
      exerciseName: exerciseName ?? null,
      isExpanded: true,
      _intervalId: id,
      _previousMode: "countdown",
    });
  },

  startStopwatch: () => {
    const { _intervalId } = get();
    if (_intervalId) clearInterval(_intervalId);

    const id = setInterval(() => {
      const state = get();
      if (state.mode !== "stopwatch") return;
      set({ remainingSeconds: state.remainingSeconds + 1 });
    }, 1000);

    set({
      mode: "stopwatch",
      totalSeconds: 0,
      remainingSeconds: 0,
      exerciseName: null,
      isExpanded: true,
      _intervalId: id,
      _previousMode: "stopwatch",
    });
  },

  pause: () => {
    const { _intervalId, mode } = get();
    if (_intervalId) clearInterval(_intervalId);
    set({ mode: "paused", _intervalId: null, _previousMode: mode });
  },

  resume: () => {
    const { _previousMode, _intervalId } = get();
    if (_intervalId) clearInterval(_intervalId);
    const isStopwatch = _previousMode === "stopwatch";

    const id = setInterval(() => {
      const state = get();
      if (state.mode === "paused" || state.mode === "idle" || state.mode === "finished") return;

      if (isStopwatch) {
        set({ remainingSeconds: state.remainingSeconds + 1 });
      } else {
        if (state.remainingSeconds <= 1) {
          clearInterval(state._intervalId!);
          playTimerAlert(state.isMuted);
          set({ remainingSeconds: 0, mode: "finished", _intervalId: null });
        } else {
          set({ remainingSeconds: state.remainingSeconds - 1 });
        }
      }
    }, 1000);

    set({
      mode: isStopwatch ? "stopwatch" : "countdown",
      _intervalId: id,
    });
  },

  reset: () => {
    const { _intervalId, totalSeconds, _previousMode } = get();
    if (_intervalId) clearInterval(_intervalId);
    const isStopwatch = _previousMode === "stopwatch";
    set({
      mode: "paused",
      remainingSeconds: isStopwatch ? 0 : totalSeconds,
      _intervalId: null,
    });
  },

  dismiss: () => {
    const { _intervalId } = get();
    if (_intervalId) clearInterval(_intervalId);
    set({
      mode: "idle",
      totalSeconds: 0,
      remainingSeconds: 0,
      exerciseName: null,
      isExpanded: true,
      _intervalId: null,
      _previousMode: "idle",
    });
  },

  toggleExpanded: () => set((s) => ({ isExpanded: !s.isExpanded })),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
}));
