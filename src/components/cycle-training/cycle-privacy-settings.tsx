"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCyclePrivacySettings, useUpdateCyclePrivacy } from "@/hooks/use-cycle-training";
import { cyclePrivacySchema, type CyclePrivacyFormData } from "@/lib/validations/cycle-training";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Loader2 } from "lucide-react";

export function CyclePrivacySettings() {
  const t = useTranslations("cycleTraining");
  const { data: privacy, isLoading } = useCyclePrivacySettings();
  const updateMutation = useUpdateCyclePrivacy();

  const form = useForm<CyclePrivacyFormData>({
    resolver: zodResolver(cyclePrivacySchema),
    defaultValues: {
      share_phase: true,
      share_symptoms: false,
      share_mood: false,
      share_flow: false,
      share_energy: true,
      share_predictions: false,
      anonymous_mode: false,
    },
  });

  useEffect(() => {
    if (privacy) {
      form.reset({
        share_phase: privacy.share_phase,
        share_symptoms: privacy.share_symptoms,
        share_mood: privacy.share_mood,
        share_flow: privacy.share_flow,
        share_energy: privacy.share_energy,
        share_predictions: privacy.share_predictions,
        anonymous_mode: privacy.anonymous_mode,
      });
    }
  }, [privacy, form]);

  const anonymousMode = form.watch("anonymous_mode");

  async function onSubmit(data: CyclePrivacyFormData) {
    await updateMutation.mutateAsync(data);
  }

  if (isLoading) return <Skeleton className="h-48 w-full" />;

  const PRIVACY_FIELDS: { name: keyof CyclePrivacyFormData; labelKey: string; descKey: string }[] = [
    { name: "share_phase", labelKey: "sharePhase", descKey: "sharePhaseDesc" },
    { name: "share_energy", labelKey: "shareEnergy", descKey: "shareEnergyDesc" },
    { name: "share_symptoms", labelKey: "shareSymptoms", descKey: "shareSymptomsDesc" },
    { name: "share_mood", labelKey: "shareMood", descKey: "shareMoodDesc" },
    { name: "share_flow", labelKey: "shareFlow", descKey: "shareFlowDesc" },
    { name: "share_predictions", labelKey: "sharePredictions", descKey: "sharePredictionsDesc" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="h-4 w-4" />
          {t("privacyTitle")}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{t("privacyDescription")}</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* Anonymous mode - overrides everything */}
            <FormField
              control={form.control}
              name="anonymous_mode"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-3">
                  <div>
                    <FormLabel className="text-sm font-medium">{t("anonymousMode")}</FormLabel>
                    <p className="text-[11px] text-muted-foreground">{t("anonymousModeDesc")}</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Individual toggles - disabled when anonymous */}
            <div className={anonymousMode ? "opacity-40 pointer-events-none" : ""}>
              {PRIVACY_FIELDS.map((pf) => (
                <FormField
                  key={pf.name}
                  control={form.control}
                  name={pf.name}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <FormLabel className="text-xs font-medium">{t(pf.labelKey)}</FormLabel>
                        <p className="text-[10px] text-muted-foreground">{t(pf.descKey)}</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                          disabled={anonymousMode}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <Button type="submit" size="sm" className="w-full" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("savePrivacy")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
