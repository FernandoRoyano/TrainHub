"use client";

import { useTranslations } from "next-intl";

interface MacroSummaryProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
  compact?: boolean;
}

interface MacroBarProps {
  label: string;
  value: number;
  target?: number;
  unit: string;
  color: string;
  bgColor: string;
  compact?: boolean;
}

function MacroBar({
  label,
  value,
  target,
  unit,
  color,
  bgColor,
  compact,
}: MacroBarProps) {
  const percent = target && target > 0 ? Math.min((value / target) * 100, 100) : 0;
  const hasTarget = target !== undefined && target > 0;

  return (
    <div className={compact ? "space-y-0.5" : "space-y-1"}>
      <div className="flex items-center justify-between">
        <span
          className={`font-medium ${compact ? "text-[11px]" : "text-xs"}`}
        >
          {label}
        </span>
        <span
          className={`text-muted-foreground ${compact ? "text-[10px]" : "text-xs"}`}
        >
          {Math.round(value)}
          {unit}
          {hasTarget && (
            <span className="text-muted-foreground/60">
              {" "}
              / {Math.round(target)}
              {unit}
            </span>
          )}
        </span>
      </div>
      <div
        className={`w-full rounded-full ${bgColor} ${compact ? "h-1.5" : "h-2"}`}
      >
        <div
          className={`rounded-full transition-all duration-300 ${color} ${compact ? "h-1.5" : "h-2"}`}
          style={{ width: hasTarget ? `${percent}%` : "0%" }}
        />
      </div>
    </div>
  );
}

export function MacroSummary({
  calories,
  protein,
  carbs,
  fat,
  targetCalories,
  targetProtein,
  targetCarbs,
  targetFat,
  compact = false,
}: MacroSummaryProps) {
  const t = useTranslations("nutrition");

  const macros: MacroBarProps[] = [
    {
      label: t("calories"),
      value: calories,
      target: targetCalories,
      unit: " kcal",
      color: "bg-orange-500",
      bgColor: "bg-orange-500/10",
      compact,
    },
    {
      label: t("protein"),
      value: protein,
      target: targetProtein,
      unit: "g",
      color: "bg-blue-500",
      bgColor: "bg-blue-500/10",
      compact,
    },
    {
      label: t("carbs"),
      value: carbs,
      target: targetCarbs,
      unit: "g",
      color: "bg-yellow-500",
      bgColor: "bg-yellow-500/10",
      compact,
    },
    {
      label: t("fat"),
      value: fat,
      target: targetFat,
      unit: "g",
      color: "bg-red-500",
      bgColor: "bg-red-500/10",
      compact,
    },
  ];

  return (
    <div className={compact ? "space-y-1.5" : "space-y-2.5"}>
      {macros.map((macro) => (
        <MacroBar key={macro.label} {...macro} />
      ))}
    </div>
  );
}
