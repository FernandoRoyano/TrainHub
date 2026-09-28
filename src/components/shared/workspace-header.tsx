import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WorkspaceHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  metric?: string | number;
  metricLabel?: string;
  actions?: ReactNode;
  className?: string;
}

export function WorkspaceHeader({
  eyebrow,
  title,
  description,
  metric,
  metricLabel,
  actions,
  className,
}: WorkspaceHeaderProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 px-5 py-5 shadow-xl shadow-background/20 sm:px-6 sm:py-6",
        className
      )}
    >
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-1/2"
        style={{
          background:
            "radial-gradient(circle at 90% 15%, hsl(var(--primary) / 0.14), transparent 58%)",
        }}
      />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-end justify-between gap-4 sm:justify-end">
          {metric !== undefined && (
            <div className="border-l border-primary/30 pl-4">
              <p className="font-display text-3xl font-bold tabular-nums">{metric}</p>
              {metricLabel && (
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {metricLabel}
                </p>
              )}
            </div>
          )}
          {actions}
        </div>
      </div>
    </section>
  );
}
