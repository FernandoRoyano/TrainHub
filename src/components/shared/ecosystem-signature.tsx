import { ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { WELLNESSREAL_LINKS } from "@/lib/ecosystem";

interface EcosystemSignatureProps {
  className?: string;
  locale?: "es" | "en";
  compact?: boolean;
}

export function EcosystemSignature({
  className,
  locale = "es",
  compact = false,
}: EcosystemSignatureProps) {
  const label = locale === "en"
    ? "Part of the WellnessReal ecosystem"
    : "Parte del ecosistema WellnessReal";
  const newTabLabel = locale === "en" ? "opens in a new tab" : "abre en una pestaña nueva";

  return (
    <a
      href={WELLNESSREAL_LINKS.home}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (${newTabLabel})`}
      className={cn(
        "group inline-flex min-h-11 items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground",
        !compact && "rounded-full border border-border/70 bg-background/60 px-3 py-2 shadow-sm",
        className,
      )}
    >
      <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
      <span>{label}</span>
      <ArrowUpRight
        className="h-3 w-3 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </a>
  );
}
