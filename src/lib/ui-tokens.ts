// Estilos de acento y estado centralizados.
// Regla del sistema: NINGÚN color Tailwind literal (emerald-*, cyan-*, …)
// fuera de este archivo — siempre tokens semánticos o chart-1..5.

// Estados de entidades (clientes, rutinas, pagos…)
export const STATUS_STYLES: Record<string, string> = {
  active: "bg-success/10 text-success border-success/25",
  pending: "bg-warning/10 text-warning border-warning/25",
  inactive: "bg-muted text-muted-foreground border-border",
  completed: "bg-success/10 text-success border-success/25",
  cancelled: "bg-destructive/10 text-destructive border-destructive/25",
  expired: "bg-destructive/10 text-destructive border-destructive/25",
  paused: "bg-info/10 text-info border-info/25",
  assigned: "bg-info/10 text-info border-info/25",
  // Niveles de dificultad (ejercicios, rutinas, plantillas)
  beginner: "bg-success/10 text-success border-success/25",
  intermediate: "bg-warning/10 text-warning border-warning/25",
  advanced: "bg-destructive/10 text-destructive border-destructive/25",
  // Objetivos de planes de nutrición
  loss: "bg-destructive/10 text-destructive border-destructive/25",
  maintenance: "bg-info/10 text-info border-info/25",
  gain: "bg-success/10 text-success border-success/25",
  performance: "bg-warning/10 text-warning border-warning/25",
  health: "bg-chart-3/10 text-chart-3 border-chart-3/25",
  // Categorías de cuestionarios
  medical: "bg-destructive/10 text-destructive border-destructive/25",
  goals: "bg-warning/10 text-warning border-warning/25",
  lifestyle: "bg-info/10 text-info border-info/25",
  nutrition: "bg-success/10 text-success border-success/25",
  general: "bg-chart-3/10 text-chart-3 border-chart-3/25",
  // Pagos
  paid: "bg-success/10 text-success border-success/25",
  overdue: "bg-destructive/10 text-destructive border-destructive/25",
  // Tipos de bloque
  warmup: "bg-warning/10 text-warning border-warning/25",
  cooldown: "bg-info/10 text-info border-info/25",
  circuit: "bg-chart-3/10 text-chart-3 border-chart-3/25",
  // Roles de usuario (admin)
  trainer: "bg-info/10 text-info border-info/25",
  client: "bg-success/10 text-success border-success/25",
};

// Acentos decorativos permitidos (KPIs, iconos de sección, features).
// Anclados a la paleta de gráficas para que todo respire igual.
export interface AccentStyle {
  text: string;
  bg: string;
  border: string;
  borderT: string;
  glow: string;
}

// IMPORTANTE: strings literales completos (el JIT de Tailwind los escanea aquí)
export const ACCENT_STYLES: AccentStyle[] = [
  { text: "text-chart-1", bg: "bg-chart-1/10", border: "border-chart-1/25", borderT: "border-t-chart-1/40", glow: "shadow-chart-1/20" },
  { text: "text-chart-2", bg: "bg-chart-2/10", border: "border-chart-2/25", borderT: "border-t-chart-2/40", glow: "shadow-chart-2/20" },
  { text: "text-chart-3", bg: "bg-chart-3/10", border: "border-chart-3/25", borderT: "border-t-chart-3/40", glow: "shadow-chart-3/20" },
  { text: "text-chart-4", bg: "bg-chart-4/10", border: "border-chart-4/25", borderT: "border-t-chart-4/40", glow: "shadow-chart-4/20" },
  { text: "text-chart-5", bg: "bg-chart-5/10", border: "border-chart-5/25", borderT: "border-t-chart-5/40", glow: "shadow-chart-5/20" },
];

// Gradientes para avatares generados (hash del nombre → índice)
export const AVATAR_GRADIENTS = [
  "from-chart-1/80 to-chart-2/80",
  "from-chart-2/80 to-chart-3/80",
  "from-chart-3/80 to-chart-5/80",
  "from-chart-4/80 to-chart-1/80",
  "from-chart-5/80 to-chart-4/80",
  "from-chart-1/80 to-chart-3/80",
  "from-chart-2/80 to-chart-5/80",
];

// Series de gráficas (recharts): usar SIEMPRE estos, nunca hex literales
export const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];
