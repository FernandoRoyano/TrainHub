"use client";

import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

interface WorkoutTimerProps {
  startedAt: string;
}

export function WorkoutTimer({ startedAt }: WorkoutTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(startedAt).getTime();

    const update = () => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  const formatted = hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-2 text-sm font-mono bg-primary/10 text-primary rounded-lg px-3 py-1.5">
      <Timer className="h-4 w-4" />
      <span>{formatted}</span>
    </div>
  );
}
