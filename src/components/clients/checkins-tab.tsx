"use client";

import { useTranslations } from "next-intl";
import { useClientCheckins } from "@/hooks/use-checkins";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const METRICS = ["energy", "sleep_quality", "adherence", "stress"] as const;

const EMOJI_MAP: Record<number, string> = { 1: "😞", 2: "😕", 3: "😐", 4: "🙂", 5: "😄" };

const scoreColor = (v: number) =>
  v >= 4 ? "text-success" : v === 3 ? "text-warning" : "text-destructive";

interface CheckinsTabProps {
  clientId: string;
}

export function CheckinsTab({ clientId }: CheckinsTabProps) {
  const t = useTranslations("checkins");
  const { data: checkins, isLoading } = useClientCheckins(clientId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }

  if (!checkins || checkins.length === 0) {
    return (
      <EmptyState
        icon={ClipboardCheck}
        title={t("noCheckins")}
        description={t("noCheckinsDesc")}
      />
    );
  }

  return (
    <div className="space-y-3">
      {checkins.map((c) => (
        <Card key={c.id}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">{t("weekOf")} {c.week_start}</p>
              <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {METRICS.map((m) => (
                <div key={m} className="flex flex-col items-center gap-1 rounded-md bg-muted/50 p-2">
                  <p className="text-xs text-muted-foreground text-center">{t(m)}</p>
                  <span className={cn("text-2xl", scoreColor(c[m]))}>{EMOJI_MAP[c[m]]}</span>
                  <span className="text-xs font-semibold">{c[m]}/5</span>
                </div>
              ))}
            </div>
            {c.notes && (
              <p className="mt-3 text-sm text-muted-foreground italic border-t pt-2">"{c.notes}"</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
