import type { LucideIcon } from "lucide-react";

interface ClientSectionHeaderProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description?: string;
  metric?: string;
  metricLabel?: string;
}

export function ClientSectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  metric,
  metricLabel,
}: ClientSectionHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/65 p-5 shadow-xl shadow-background/20 sm:p-6">
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-2/3"
        style={{
          background:
            "radial-gradient(circle at 90% 10%, hsl(var(--primary) / 0.17), transparent 55%)",
        }}
      />
      <div className="relative flex items-end justify-between gap-5">
        <div className="min-w-0">
          <span className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {metric && (
          <div className="shrink-0 border-l border-primary/30 pl-4 text-right">
            <p className="font-display text-3xl font-bold tabular-nums">{metric}</p>
            {metricLabel && (
              <p className="mt-1 max-w-20 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {metricLabel}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
