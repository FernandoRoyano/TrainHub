"use client";

import { useTranslations } from "next-intl";
import { useCycleInfo } from "@/hooks/use-menstrual";
import { useTrainingSuggestion } from "@/hooks/use-cycle-training";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, TrendingDown, TrendingUp, Minus, AlertCircle } from "lucide-react";

const phaseColors: Record<string, string> = {
  menstrual: "bg-red-500",
  follicular: "bg-pink-400",
  ovulation: "bg-purple-500",
  luteal: "bg-blue-400",
};

const phaseTextColors: Record<string, string> = {
  menstrual: "text-red-600 dark:text-red-400",
  follicular: "text-pink-600 dark:text-pink-400",
  ovulation: "text-purple-600 dark:text-purple-400",
  luteal: "text-blue-600 dark:text-blue-400",
};

interface AdaptiveTrainingCardProps {
  todaySymptoms?: string[];
}

export function AdaptiveTrainingCard({ todaySymptoms = [] }: AdaptiveTrainingCardProps) {
  const t = useTranslations("cycleTraining");
  const { data: cycleInfo, isLoading: loadingCycle } = useCycleInfo();

  const { data: suggestion, isLoading: loadingSuggestion } = useTrainingSuggestion(
    cycleInfo?.cycleDay ?? 0,
    cycleInfo?.currentPhase ?? null,
    todaySymptoms
  );

  const intensityIcon = useMemo(() => {
    if (!suggestion) return null;
    if (suggestion.intensityMod > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (suggestion.intensityMod < 0) return <TrendingDown className="h-4 w-4 text-amber-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  }, [suggestion]);

  if (loadingCycle || loadingSuggestion) return null;
  if (!cycleInfo || !suggestion) return null;

  return (
    <Card className="border-l-4" style={{ borderLeftColor: `var(--phase-${cycleInfo.currentPhase})` }}>
      <CardContent className="pt-4 pb-3 px-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-7 w-7 rounded-full ${phaseColors[cycleInfo.currentPhase]} flex items-center justify-center`}>
              <Dumbbell className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <p className={`text-sm font-semibold ${phaseTextColors[cycleInfo.currentPhase]}`}>
                {t(`phase.${cycleInfo.currentPhase}`)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {t("cycleDay", { day: cycleInfo.cycleDay })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {intensityIcon}
            <Badge variant="outline" className="text-[10px]">
              {suggestion.intensityMod > 0 ? "+" : ""}{suggestion.intensityMod}% {t("intensity")}
            </Badge>
            {suggestion.volumeMod !== 0 && (
              <Badge variant="outline" className="text-[10px]">
                {suggestion.volumeMod > 0 ? "+" : ""}{suggestion.volumeMod}% {t("volume")}
              </Badge>
            )}
          </div>
        </div>

        {suggestion.trainerNotes && (
          <p className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1.5">
            {suggestion.trainerNotes}
          </p>
        )}

        {suggestion.autoSuggestions.length > 0 && (
          <div className="flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              {suggestion.autoSuggestions.map((key) => (
                <p key={key}>{t(key.replace("cycleTraining.", ""))}</p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
