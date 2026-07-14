"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCycleTrainingConfig, useUpsertCycleTrainingConfig } from "@/hooks/use-cycle-training";
import { cycleTrainingConfigSchema, type CycleTrainingConfigFormData } from "@/lib/validations/cycle-training";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import type { CyclePhase } from "@/services/menstrual.service";

interface PhaseConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
}

const PHASES: { key: CyclePhase; color: string }[] = [
  { key: "menstrual", color: "bg-destructive" },
  { key: "follicular", color: "bg-chart-5" },
  { key: "ovulation", color: "bg-chart-3" },
  { key: "luteal", color: "bg-chart-2" },
];

export function PhaseConfigDialog({ open, onOpenChange, clientId }: PhaseConfigDialogProps) {
  const t = useTranslations("cycleTraining");
  const { data: config, isLoading } = useCycleTrainingConfig(clientId);
  const upsertMutation = useUpsertCycleTrainingConfig(clientId);
  const [activePhase, setActivePhase] = useState<CyclePhase>("menstrual");

  const form = useForm<CycleTrainingConfigFormData>({
    resolver: zodResolver(cycleTrainingConfigSchema),
    defaultValues: {
      enabled: true,
      menstrual_intensity: -20,
      menstrual_volume: -15,
      menstrual_notes: "",
      follicular_intensity: 0,
      follicular_volume: 0,
      follicular_notes: "",
      ovulation_intensity: 10,
      ovulation_volume: 5,
      ovulation_notes: "",
      luteal_intensity: -10,
      luteal_volume: -10,
      luteal_notes: "",
      auto_adjust: true,
    },
  });

  useEffect(() => {
    if (config) {
      form.reset({
        enabled: config.enabled,
        menstrual_intensity: config.menstrual_intensity,
        menstrual_volume: config.menstrual_volume,
        menstrual_notes: config.menstrual_notes || "",
        follicular_intensity: config.follicular_intensity,
        follicular_volume: config.follicular_volume,
        follicular_notes: config.follicular_notes || "",
        ovulation_intensity: config.ovulation_intensity,
        ovulation_volume: config.ovulation_volume,
        ovulation_notes: config.ovulation_notes || "",
        luteal_intensity: config.luteal_intensity,
        luteal_volume: config.luteal_volume,
        luteal_notes: config.luteal_notes || "",
        auto_adjust: config.auto_adjust,
      });
    }
  }, [config, form]);

  async function onSubmit(data: CycleTrainingConfigFormData) {
    await upsertMutation.mutateAsync(data);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("configTitle")}</DialogTitle>
          <DialogDescription>{t("configDescription")}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Enable toggle */}
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <FormLabel className="text-sm font-medium">{t("enabled")}</FormLabel>
                      <p className="text-xs text-muted-foreground">{t("enabledDesc")}</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Auto-adjust toggle */}
              <FormField
                control={form.control}
                name="auto_adjust"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <FormLabel className="text-sm font-medium">{t("autoAdjust")}</FormLabel>
                      <p className="text-xs text-muted-foreground">{t("autoAdjustDesc")}</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Phase tabs */}
              <Tabs value={activePhase} onValueChange={(v) => setActivePhase(v as CyclePhase)}>
                <TabsList className="w-full grid grid-cols-4">
                  {PHASES.map((p) => (
                    <TabsTrigger key={p.key} value={p.key} className="text-xs gap-1">
                      <span className={`h-2 w-2 rounded-full ${p.color}`} />
                      {t(`phase.${p.key}`)}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {PHASES.map((p) => (
                  <TabsContent key={p.key} value={p.key} className="space-y-3 mt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name={`${p.key}_intensity` as keyof CycleTrainingConfigFormData}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">{t("intensityAdj")}</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  min={-50}
                                  max={50}
                                  className="h-8"
                                  value={field.value as number}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                                <Badge variant="outline" className="text-[10px] shrink-0">%</Badge>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`${p.key}_volume` as keyof CycleTrainingConfigFormData}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">{t("volumeAdj")}</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  min={-50}
                                  max={50}
                                  className="h-8"
                                  value={field.value as number}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                                <Badge variant="outline" className="text-[10px] shrink-0">%</Badge>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`${p.key}_notes` as keyof CycleTrainingConfigFormData}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">{t("phaseNotes")}</FormLabel>
                          <FormControl>
                            <Textarea
                              className="h-16 text-xs resize-none"
                              placeholder={t("phaseNotesPlaceholder")}
                              value={(field.value as string) || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <p className="text-[11px] text-muted-foreground bg-muted/50 rounded p-2">
                      {t(`phaseTip.${p.key}`)}
                    </p>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={upsertMutation.isPending}>
                  {upsertMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("save")}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
