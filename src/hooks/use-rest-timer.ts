"use client";

import { useMemo } from "react";
import { useRestTimerStore } from "@/stores/rest-timer-store";

export function useRestTimer() {
  const mode = useRestTimerStore((s) => s.mode);
  const totalSeconds = useRestTimerStore((s) => s.totalSeconds);
  const remainingSeconds = useRestTimerStore((s) => s.remainingSeconds);
  const exerciseName = useRestTimerStore((s) => s.exerciseName);
  const isExpanded = useRestTimerStore((s) => s.isExpanded);
  const isMuted = useRestTimerStore((s) => s.isMuted);

  const startCountdown = useRestTimerStore((s) => s.startCountdown);
  const startStopwatch = useRestTimerStore((s) => s.startStopwatch);
  const pause = useRestTimerStore((s) => s.pause);
  const resume = useRestTimerStore((s) => s.resume);
  const reset = useRestTimerStore((s) => s.reset);
  const dismiss = useRestTimerStore((s) => s.dismiss);
  const toggleExpanded = useRestTimerStore((s) => s.toggleExpanded);
  const toggleMute = useRestTimerStore((s) => s.toggleMute);

  const formattedTime = useMemo(() => {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, [remainingSeconds]);

  const progress = useMemo(() => {
    if (mode === "stopwatch" || totalSeconds === 0) return 0;
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  }, [totalSeconds, remainingSeconds, mode]);

  const isActive = mode !== "idle";

  return {
    mode,
    totalSeconds,
    remainingSeconds,
    exerciseName,
    isExpanded,
    isMuted,
    formattedTime,
    progress,
    isActive,
    startCountdown,
    startStopwatch,
    pause,
    resume,
    reset,
    dismiss,
    toggleExpanded,
    toggleMute,
  };
}
