"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Type } from "lucide-react";
import { useTextScaleStore, type TextScale } from "@/stores/text-scale-store";
import { cn } from "@/lib/utils";

const OPTIONS: { value: TextScale; label: string; preview: string }[] = [
  { value: "small", label: "Pequeño", preview: "text-sm" },
  { value: "normal", label: "Normal", preview: "text-base" },
  { value: "large", label: "Grande", preview: "text-lg" },
  { value: "xlarge", label: "Extra grande", preview: "text-xl" },
];

export function TextSizeSelector() {
  const t = useTranslations("clientApp");
  const scale = useTextScaleStore((s) => s.scale);
  const setScale = useTextScaleStore((s) => s.setScale);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Type className="h-4 w-4" />
          {t("textSize")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t("textSizeDesc")}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={scale === opt.value ? "default" : "outline"}
            className={cn(
              "w-full justify-between h-auto py-3 px-4",
              scale === opt.value && "ring-2 ring-primary/50"
            )}
            onClick={() => setScale(opt.value)}
          >
            <span className="font-medium">{opt.label}</span>
            <span className={cn("font-semibold", opt.preview)}>Aa</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
