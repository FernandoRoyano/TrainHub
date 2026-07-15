"use client";

import { useEffect } from "react";

// Registra el acceso real del cliente al abrir su app (fire-and-forget).
// El throttle vive en el servidor (/api/heartbeat, ~15 min).
export function useHeartbeat() {
  useEffect(() => {
    fetch("/api/heartbeat", { method: "POST" }).catch(() => {});
  }, []);
}
