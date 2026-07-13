// Tiempos de frescura de React Query por tipo de dato.
// Las mutaciones invalidan sus queries, así que un staleTime alto
// solo afecta a cambios hechos desde OTRO dispositivo/sesión.
export const STALE = {
  // Listas que cambian con la actividad diaria (mensajes, notificaciones)
  fast: 30 * 1000,
  // Datos de trabajo (clientes, badges, rutina activa del cliente)
  standard: 60 * 1000,
  // Agregados y editores (dashboard, analytics, rutinas, planes)
  slow: 5 * 60 * 1000,
  // Catálogos casi estáticos (exercises y foods de plataforma)
  catalog: 24 * 60 * 60 * 1000,
} as const;

// Dashboard: agregado caro; sin polling, se invalida desde mutaciones
export const STALE_DASHBOARD = 2 * 60 * 1000;

// Único polling permitido: badges de sidebar y contador de notificaciones
export const BADGE_POLL_INTERVAL = 60 * 1000;

export const GC_DEFAULT = 10 * 60 * 1000;
