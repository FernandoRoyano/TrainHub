"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useRestTimer } from "@/hooks/use-rest-timer";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  RotateCcw,
  X,
  ChevronUp,
  ChevronDown,
  Timer,
  Volume2,
  VolumeX,
} from "lucide-react";

function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 4,
  children,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export function RestTimer() {
  const t = useTranslations("clientApp");
  const {
    mode,
    formattedTime,
    progress,
    isActive,
    isExpanded,
    isMuted,
    exerciseName,
    startStopwatch,
    pause,
    resume,
    reset,
    dismiss,
    toggleExpanded,
    toggleMute,
  } = useRestTimer();

  const isRunning = mode === "countdown" || mode === "stopwatch";
  const isFinished = mode === "finished";

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="rest-timer"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-[72px] right-4 z-40"
        >
          {isExpanded ? (
            // Expanded card
            <div
              className={`glass-elevated rounded-xl p-4 w-[200px] shadow-lg ${
                isFinished ? "ring-2 ring-primary/50" : ""
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground truncate flex-1 mr-2">
                  {exerciseName ?? t("restTimer")}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleMute}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="h-3 w-3" />
                    ) : (
                      <Volume2 className="h-3 w-3" />
                    )}
                  </button>
                  <button
                    onClick={toggleExpanded}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Minimize"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="flex justify-center mb-3">
                <ProgressRing
                  progress={mode === "stopwatch" ? 0 : progress}
                  size={80}
                  strokeWidth={4}
                >
                  <span
                    className={`text-lg font-semibold tabular-nums ${
                      isFinished ? "text-primary" : ""
                    }`}
                  >
                    {formattedTime}
                  </span>
                </ProgressRing>
              </div>

              {/* Finished message */}
              {isFinished && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-primary text-center mb-2 font-medium"
                >
                  {t("timerFinished")}
                </motion.p>
              )}

              {/* Controls */}
              <div className="flex items-center justify-center gap-2">
                {isRunning ? (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={pause}
                    aria-label={t("pause")}
                  >
                    <Pause className="h-4 w-4" />
                  </Button>
                ) : mode === "paused" ? (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={resume}
                    aria-label={t("resume")}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                ) : null}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={reset}
                  aria-label={t("reset")}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={dismiss}
                  aria-label={t("dismiss")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Stopwatch toggle - only in countdown/paused modes */}
              {(mode === "countdown" || mode === "paused") && (
                <button
                  onClick={startStopwatch}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors mt-3 mx-auto"
                >
                  <Timer className="h-3 w-3" />
                  {t("stopwatch")}
                </button>
              )}
            </div>
          ) : (
            // Minimized pill
            <button
              onClick={toggleExpanded}
              className={`glass rounded-full px-3 py-2 flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow ${
                isFinished ? "ring-2 ring-primary/50" : ""
              }`}
              aria-label={t("restTimer")}
            >
              <Timer className={`h-3.5 w-3.5 ${isFinished ? "text-primary" : "text-muted-foreground"}`} />
              <span
                className={`text-sm font-medium tabular-nums ${
                  isFinished ? "text-primary" : ""
                }`}
              >
                {formattedTime}
              </span>
              <ChevronUp className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
