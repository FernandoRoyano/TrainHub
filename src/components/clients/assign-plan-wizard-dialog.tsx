"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useCoachingPlans } from "@/hooks/use-coaching-plans";
import { useRoutines } from "@/hooks/use-routines";
import { useMealPlans } from "@/hooks/use-nutrition";
import { useQuestionnaireTemplates } from "@/hooks/use-questionnaires";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Calendar,
  Check,
  ArrowLeft,
  Dumbbell,
  UtensilsCrossed,
  MessageCircle,
  BarChart3,
  Ruler,
  ClipboardCheck,
  FileQuestion,
} from "lucide-react";
import { toast } from "sonner";
import type { CoachingPlan } from "@/services/coaching-plans.service";

interface AssignPlanWizardDialogProps {
  clientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const featureIcons: Record<string, typeof Dumbbell> = {
  training: Dumbbell,
  nutrition: UtensilsCrossed,
  messaging: MessageCircle,
  progress_tracking: BarChart3,
  measurements: Ruler,
  checkins: ClipboardCheck,
  questionnaires: FileQuestion,
};

export function AssignPlanWizardDialog({
  clientId,
  open,
  onOpenChange,
}: AssignPlanWizardDialogProps) {
  const t = useTranslations("assignPlanWizard");
  const tc = useTranslations("common");
  const tMyPlan = useTranslations("myPlan");
  const queryClient = useQueryClient();

  const { data: plansData } = useCoachingPlans({ is_active: true });
  const { data: routinesData } = useRoutines({ is_template: true } as never);
  const { data: mealPlansData } = useMealPlans({ is_template: true } as never);
  const { data: questionnaireTemplates } = useQuestionnaireTemplates();

  const plans = plansData?.data ?? [];
  const routineTemplates = (routinesData as { data?: { id: string; name: string }[] })?.data ??
    (Array.isArray(routinesData) ? routinesData : []);
  const mealPlanTemplates = (mealPlansData as { data?: { id: string; name: string }[] })?.data ??
    (Array.isArray(mealPlansData) ? mealPlansData : []);

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [routineOverrideId, setRoutineOverrideId] = useState("");
  const [mealPlanOverrideId, setMealPlanOverrideId] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedQuestionnaireIds, setSelectedQuestionnaireIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allQuestionnaires = questionnaireTemplates ?? [];

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  const endDate = useMemo(() => {
    if (!startDate || !selectedPlan) return "";
    const start = new Date(startDate);
    start.setDate(start.getDate() + selectedPlan.duration_weeks * 7);
    return start.toISOString().split("T")[0];
  }, [startDate, selectedPlan]);

  // Group plans by whether they have nutrition (via tier features or meal_plan_template)
  const { withNutrition, withoutNutrition } = useMemo(() => {
    const with_: CoachingPlan[] = [];
    const without_: CoachingPlan[] = [];
    for (const plan of plans) {
      const hasNutrition =
        plan.meal_plan_template_id ||
        (plan.service_tier?.features as Record<string, boolean> | undefined)?.nutrition;
      if (hasNutrition) {
        with_.push(plan);
      } else {
        without_.push(plan);
      }
    }
    return { withNutrition: with_, withoutNutrition: without_ };
  }, [plans]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setRoutineOverrideId("");
    setMealPlanOverrideId("");
    // Pre-select all questionnaires linked to this plan
    const plan = plans.find((p) => p.id === planId);
    const linkedIds = (plan as { questionnaire_template_ids?: string[] })?.questionnaire_template_ids ?? [];
    setSelectedQuestionnaireIds(linkedIds.length > 0 ? linkedIds : allQuestionnaires.map((q) => q.id));
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleAssign = async () => {
    if (!selectedPlanId || !startDate) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/coaching-plans/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          coaching_plan_id: selectedPlanId,
          start_date: startDate,
          notes: notes || undefined,
          routine_override_id: routineOverrideId && routineOverrideId !== "default" ? routineOverrideId : undefined,
          meal_plan_override_id: mealPlanOverrideId && mealPlanOverrideId !== "default" ? mealPlanOverrideId : undefined,
          questionnaire_template_ids: selectedQuestionnaireIds.length > 0 ? selectedQuestionnaireIds : undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Assignment failed");
      }
      toast.success(t("planAssigned"));
      queryClient.invalidateQueries({ queryKey: ["client-coaching-plan"] });
      queryClient.invalidateQueries({ queryKey: ["client-routines"] });
      queryClient.invalidateQueries({ queryKey: ["client-meal-plans"] });
      queryClient.invalidateQueries({ queryKey: ["client-service-tier"] });
      queryClient.invalidateQueries({ queryKey: ["coaching-plans"] });
      onOpenChange(false);
      // Reset state
      setStep(1);
      setSelectedPlanId("");
      setNotes("");
      setRoutineOverrideId("");
      setMealPlanOverrideId("");
    } catch {
      toast.error(t("planAssignError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const featureLabel = (key: string) => {
    const labels: Record<string, string> = {
      training: tMyPlan("training"),
      nutrition: tMyPlan("nutrition"),
      messaging: tMyPlan("messaging"),
      progress_tracking: tMyPlan("progressTracking"),
      measurements: tMyPlan("measurements"),
      checkins: tMyPlan("checkins"),
      questionnaires: tMyPlan("questionnaires"),
    };
    return labels[key] ?? key;
  };

  const renderPlanCard = (plan: CoachingPlan) => {
    const features = (plan.service_tier?.features ?? {}) as Record<string, boolean>;
    const enabledFeatures = Object.entries(features).filter(([, v]) => v);

    return (
      <Card
        key={plan.id}
        className="cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => handleSelectPlan(plan.id)}
      >
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">{plan.name}</h3>
            {plan.service_tier && (
              <Badge
                variant="outline"
                style={{
                  borderColor: plan.service_tier.color ?? undefined,
                  color: plan.service_tier.color ?? undefined,
                }}
              >
                {plan.service_tier.name}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{t("duration", { weeks: plan.duration_weeks })}</span>
            {plan.price != null && plan.price > 0 && (
              <span className="font-semibold text-foreground">
                {plan.price}{plan.currency ? ` ${plan.currency}` : ""}{t("perMonth")}
              </span>
            )}
          </div>
          {enabledFeatures.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {enabledFeatures.map(([key]) => {
                const Icon = featureIcons[key] ?? Check;
                return (
                  <span key={key} className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Icon className="h-3 w-3 text-success" />
                    {featureLabel(key)}
                  </span>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const hasPlanNutrition =
    selectedPlan?.meal_plan_template_id ||
    (selectedPlan?.service_tier?.features as Record<string, boolean> | undefined)?.nutrition;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? t("selectPlan") : t("confirmAssignment")}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            {/* Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Without nutrition column */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("withoutNutrition")}
                </h3>
                {withoutNutrition.length > 0 ? (
                  withoutNutrition.map(renderPlanCard)
                ) : (
                  <p className="text-xs text-muted-foreground py-4 text-center">
                    {tc("noResults")}
                  </p>
                )}
              </div>
              {/* With nutrition column */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("withNutrition")}
                </h3>
                {withNutrition.length > 0 ? (
                  withNutrition.map(renderPlanCard)
                ) : (
                  <p className="text-xs text-muted-foreground py-4 text-center">
                    {tc("noResults")}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && selectedPlan && (
          <div className="space-y-4">
            {/* Plan summary */}
            <div className="rounded-lg border bg-muted/50 p-3">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm">{selectedPlan.name}</h3>
                {selectedPlan.service_tier && (
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: selectedPlan.service_tier.color ?? undefined,
                      color: selectedPlan.service_tier.color ?? undefined,
                    }}
                  >
                    {selectedPlan.service_tier.name}
                  </Badge>
                )}
                <Badge variant="secondary" className="ml-auto">
                  {t("selected")}
                </Badge>
              </div>
            </div>

            {/* Date range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {t("startDate")}
                </Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {t("endDate")}
                </Label>
                <Input type="date" value={endDate} disabled className="bg-muted" />
              </div>
            </div>

            {/* Override routine */}
            <div className="space-y-2">
              <Label>{t("overrideRoutine")}</Label>
              <Select value={routineOverrideId} onValueChange={setRoutineOverrideId}>
                <SelectTrigger>
                  <SelectValue placeholder={t("useDefault")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{t("useDefault")}</SelectItem>
                  {(routineTemplates as { id: string; name: string }[]).map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Override meal plan (only if pro/nutrition tier) */}
            {hasPlanNutrition && (
              <div className="space-y-2">
                <Label>{t("overrideMealPlan")}</Label>
                <Select value={mealPlanOverrideId} onValueChange={setMealPlanOverrideId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("useDefault")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">{t("useDefault")}</SelectItem>
                    {(mealPlanTemplates as { id: string; name: string }[]).map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Questionnaires selection */}
            {allQuestionnaires.length > 0 && (
              <div className="space-y-2">
                <Label>{t("questionnaires")}</Label>
                <div className="space-y-1.5 rounded-lg border p-3">
                  {allQuestionnaires.map((qt) => (
                    <label key={qt.id} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={selectedQuestionnaireIds.includes(qt.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedQuestionnaireIds((prev) => [...prev, qt.id]);
                          } else {
                            setSelectedQuestionnaireIds((prev) => prev.filter((id) => id !== qt.id));
                          }
                        }}
                        className="rounded border-input"
                      />
                      {qt.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label>{t("notes")}</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("notesPlaceholder")}
                rows={2}
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-2">
          {step === 2 && (
            <Button variant="ghost" onClick={handleBack} className="mr-auto">
              <ArrowLeft className="mr-1 h-4 w-4" />
              {tc("back")}
            </Button>
          )}
          {step === 1 && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {tc("cancel")}
            </Button>
          )}
          {step === 2 && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {tc("cancel")}
              </Button>
              <Button
                onClick={handleAssign}
                disabled={!selectedPlanId || isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("assignButton")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
