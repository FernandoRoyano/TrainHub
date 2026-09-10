"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale } from "lucide-react";
import { useWeightUnit } from "@/hooks/use-weight-unit";
import { cn } from "@/lib/utils";

export function WeightUnitSelector() {
  const t = useTranslations("clientApp");
  const { unit, setUnit, isSavingUnit } = useWeightUnit();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Scale className="h-4 w-4" />
          {t("weightUnit")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t("weightUnitDesc")}</p>
      </CardHeader>
      <CardContent className="flex gap-2">
        {(["kg", "lb"] as const).map((opt) => (
          <Button
            key={opt}
            variant={unit === opt ? "default" : "outline"}
            className={cn("flex-1", unit === opt && "ring-2 ring-primary/50")}
            disabled={isSavingUnit}
            onClick={() => setUnit(opt)}
          >
            {opt === "kg" ? t("weightUnitKg") : t("weightUnitLb")}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
