import { Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductMarkProps {
  compact?: boolean;
  className?: string;
  descriptor?: string;
}

export function ProductMark({ compact = false, className, descriptor }: ProductMarkProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl border border-primary/20 bg-primary/10 text-primary">
        <span aria-hidden className="absolute inset-x-1 bottom-1 h-px bg-primary/50" />
        <Dumbbell className="relative h-[18px] w-[18px]" />
      </span>
      {!compact && (
        <span className="min-w-0 leading-none">
          <span className="block font-display text-base font-bold tracking-[-0.03em]">
            Train<span className="text-primary">Hub</span>
          </span>
          {descriptor && (
            <span className="mt-1 block truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {descriptor}
            </span>
          )}
        </span>
      )}
    </div>
  );
}
