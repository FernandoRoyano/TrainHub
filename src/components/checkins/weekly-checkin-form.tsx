"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMyCheckins, useSubmitCheckin } from "@/hooks/use-checkins";
import { checkinsService } from "@/services/checkins.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const METRICS = ["energy", "sleep_quality", "adherence", "stress"] as const;

const EMOJI_MAP: Record<number, string> = {
  1: "😞",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😄",
};

function ScoreSelector({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              "flex-1 h-10 rounded-md border text-lg transition-colors",
              value === n
                ? "border-primary bg-primary/10 text-primary"
                : "border-muted hover:border-primary/50"
            )}
          >
            {EMOJI_MAP[n]}
          </button>
        ))}
      </div>
    </div>
  );
}

export function WeeklyCheckinForm() {
  const t = useTranslations("checkins");
  const { data: checkins } = useMyCheckins();
  const submit = useSubmitCheckin();

  const currentWeek = checkinsService.getWeekStart();
  const alreadySubmitted = checkins?.some((c) => c.week_start === currentWeek);

  const [scores, setScores] = useState({ energy: 3, sleep_quality: 3, adherence: 3, stress: 3 });
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    submit.mutate({ ...scores, notes: notes.trim() || null });
  };

  if (alreadySubmitted) {
    const current = checkins?.find((c) => c.week_start === currentWeek);
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-green-500" />
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">{t("alreadySubmitted")}</p>
          <div className="grid grid-cols-2 gap-3">
            {METRICS.map((m) => (
              <div key={m} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                <span className="text-xs text-muted-foreground">{t(m)}</span>
                <span className="text-lg">{EMOJI_MAP[current?.[m] ?? 3]}</span>
              </div>
            ))}
          </div>
          {current?.notes && (
            <p className="mt-3 text-sm text-muted-foreground italic">"{current.notes}"</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4" />
          {t("title")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {METRICS.map((m) => (
          <ScoreSelector
            key={m}
            label={t(m)}
            value={scores[m]}
            onChange={(v) => setScores((prev) => ({ ...prev, [m]: v }))}
          />
        ))}

        <div className="space-y-1">
          <p className="text-sm font-medium">{t("notes")}</p>
          <Textarea
            placeholder={t("notesPlaceholder")}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>

        <Button onClick={handleSubmit} disabled={submit.isPending} className="w-full">
          {submit.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("submit")}
        </Button>
      </CardContent>
    </Card>
  );
}
