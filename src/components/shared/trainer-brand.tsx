import { Dumbbell } from "lucide-react";
import { TRAINER_BRAND_ACCENTS, type TrainerBrandAccent } from "@/lib/ui-tokens";

interface TrainerBrandProps {
  trainerName?: string | null;
  settings?: Record<string, unknown> | null;
  avatarUrl?: string | null;
  compact?: boolean;
  signature: string;
}

function safeAccent(value: unknown): TrainerBrandAccent {
  return typeof value === "string" && value in TRAINER_BRAND_ACCENTS
    ? (value as TrainerBrandAccent)
    : "green";
}

export function TrainerBrand({ trainerName, settings, avatarUrl, compact = false, signature }: TrainerBrandProps) {
  const professionalName =
    typeof settings?.professional_name === "string" && settings.professional_name.trim()
      ? settings.professional_name
      : trainerName || "TrainHub";
  const logoUrl =
    typeof settings?.brand_logo_url === "string" && settings.brand_logo_url.trim()
      ? settings.brand_logo_url
      : avatarUrl;
  const accent = TRAINER_BRAND_ACCENTS[safeAccent(settings?.brand_accent)];

  return (
    <div className="flex min-w-0 items-center gap-2.5" style={{ "--trainer-accent": accent } as React.CSSProperties}>
      <span
        className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl border"
        style={{
          borderColor: "hsl(var(--trainer-accent) / 0.3)",
          background: "hsl(var(--trainer-accent) / 0.12)",
          color: "hsl(var(--trainer-accent))",
        }}
      >
        {logoUrl ? (
          <img src={logoUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <Dumbbell className="h-[18px] w-[18px]" />
        )}
      </span>
      {!compact && (
        <span className="min-w-0 leading-none">
          <span className="block truncate font-display text-sm font-bold tracking-tight">
            {professionalName}
          </span>
          <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {signature}
          </span>
        </span>
      )}
    </div>
  );
}
