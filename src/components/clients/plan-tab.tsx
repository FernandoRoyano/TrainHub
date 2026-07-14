"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useClientCoachingPlan } from "@/hooks/use-coaching-plans";
import { useClientRoutines } from "@/hooks/use-routines";
import { useClientMealPlans } from "@/hooks/use-nutrition";
import { useClientQuestionnaires } from "@/hooks/use-questionnaires";
import { useClient, useUpdateClient } from "@/hooks/use-clients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { AssignPlanWizardDialog } from "./assign-plan-wizard-dialog";
import { AssignRoutineToClientDialog } from "./assign-routine-to-client-dialog";
import { AssignMealPlanToClientDialog } from "./assign-meal-plan-to-client-dialog";
import Link from "next/link";
import {
  ClipboardList,
  Dumbbell,
  UtensilsCrossed,
  FileQuestion,
  StickyNote,
  Calendar,
  Save,
  ExternalLink,
  Check,
} from "lucide-react";
import type { ServiceTierFeatures } from "@/lib/validations/service-tier";
import { STATUS_STYLES } from "@/lib/ui-tokens";

interface PlanTabProps {
  clientId: string;
}

const featureLabelKeys: Record<string, string> = {
  training: "training",
  nutrition: "nutrition",
  messaging: "messaging",
  progress_tracking: "progressTracking",
  measurements: "measurements",
  checkins: "checkins",
  questionnaires: "questionnaires",
};

export function PlanTab({ clientId }: PlanTabProps) {
  const t = useTranslations("planTab");
  const tc = useTranslations("common");
  const tMyPlan = useTranslations("myPlan");
  const { data: client } = useClient(clientId);
  const { data: coachingPlan, isLoading: loadingPlan } = useClientCoachingPlan(clientId);
  const { data: routines, isLoading: loadingRoutines } = useClientRoutines(clientId);
  const { data: mealPlans, isLoading: loadingMeals } = useClientMealPlans(clientId);
  const { data: questionnaires, isLoading: loadingQ } = useClientQuestionnaires(clientId);
  const updateClient = useUpdateClient();

  const [notes, setNotes] = useState<string | null>(null);
  const [notesEdited, setNotesEdited] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [routineDialogOpen, setRoutineDialogOpen] = useState(false);
  const [mealPlanDialogOpen, setMealPlanDialogOpen] = useState(false);

  const currentNotes = notes ?? client?.notes ?? "";

  const handleNotesChange = useCallback((value: string) => {
    setNotes(value);
    setNotesEdited(true);
  }, []);

  const handleSaveNotes = useCallback(() => {
    if (!client) return;
    updateClient.mutate(
      { id: client.id, data: { notes: currentNotes } as never },
      {
        onSuccess: () => setNotesEdited(false),
      }
    );
  }, [client, currentNotes, updateClient]);

  const isLoading = loadingPlan || loadingRoutines || loadingMeals || loadingQ;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  const activeRoutine = routines?.find((r) => r.status === "active");
  const activeMealPlan = mealPlans?.find((m: { status: string }) => m.status === "active");
  const pendingQuestionnaires = questionnaires?.filter(
    (q: { status: string }) => q.status === "pending" || q.status === "assigned"
  );

  const tierFeatures = (coachingPlan?.coaching_plan?.service_tier as { features?: ServiceTierFeatures } | undefined)?.features;
  const enabledFeatures = tierFeatures
    ? Object.entries(tierFeatures).filter(([, v]) => v)
    : [];

  return (
    <div className="space-y-4">
      {/* Active Coaching Plan */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              {t("coachingPlan")}
            </CardTitle>
            <Button size="sm" variant="outline" onClick={() => setWizardOpen(true)}>
              {coachingPlan ? t("changePlan") : t("assignPlan")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {coachingPlan ? (
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                {coachingPlan.coaching_plan?.cover_image && (
                  <img
                    src={coachingPlan.coaching_plan.cover_image}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm">
                      {coachingPlan.coaching_plan?.name ?? t("unknownPlan")}
                    </p>
                    <Badge variant="outline" className={STATUS_STYLES[coachingPlan.status] ?? ""}>
                      {tc(coachingPlan.status as "active" | "completed" | "cancelled")}
                    </Badge>
                    {coachingPlan.coaching_plan?.service_tier && (
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: coachingPlan.coaching_plan.service_tier.color ?? undefined,
                          color: coachingPlan.coaching_plan.service_tier.color ?? undefined,
                        }}
                      >
                        {coachingPlan.coaching_plan.service_tier.name}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {coachingPlan.start_date}
                      {coachingPlan.end_date && ` — ${coachingPlan.end_date}`}
                    </span>
                  </div>
                  {coachingPlan.coaching_plan?.price != null && coachingPlan.coaching_plan.price > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("price")}: {coachingPlan.coaching_plan.price}
                      {coachingPlan.coaching_plan.currency ? ` ${coachingPlan.coaching_plan.currency}` : ""}
                    </p>
                  )}
                </div>
              </div>

              {/* Tier features */}
              {enabledFeatures.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {enabledFeatures.map(([key]) => (
                    <span key={key} className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-success" />
                      {tMyPlan(featureLabelKeys[key] ?? key)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t("noCoachingPlan")}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Pending Questionnaires */}
      {pendingQuestionnaires && pendingQuestionnaires.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileQuestion className="h-4 w-4" />
              {t("pendingQuestionnaires")}
              <Badge variant="secondary" className="ml-1">
                {t("pendingCount", { count: pendingQuestionnaires.length })}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingQuestionnaires.map((q: { id: string; status: string; template?: { name: string }; due_date: string | null }) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <p className="text-sm font-medium">
                    {q.template?.name ?? t("unknownQuestionnaire")}
                  </p>
                  <div className="flex items-center gap-2">
                    {q.due_date && (
                      <span className="text-xs text-muted-foreground">{q.due_date}</span>
                    )}
                    <Badge variant="outline" className={STATUS_STYLES[q.status] ?? ""}>
                      {q.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Routine */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              {t("currentRoutine")}
            </CardTitle>
            <Button size="sm" variant="outline" onClick={() => setRoutineDialogOpen(true)}>
              {activeRoutine ? t("changeRoutine") : t("assignRoutine")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeRoutine ? (
            <Link
              href={`/routines/${activeRoutine.routine_id}`}
              className="flex items-start gap-4 hover:opacity-80 transition-opacity"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-primary underline-offset-2 hover:underline">
                    {activeRoutine.routine?.name ?? t("unknownRoutine")}
                  </p>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{activeRoutine.start_date}</span>
                  {activeRoutine.routine?.days_per_week && (
                    <span>
                      · {activeRoutine.routine.days_per_week} {t("daysPerWeek")}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t("noActiveRoutine")}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Current Diet */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              {t("currentDiet")}
            </CardTitle>
            <Button size="sm" variant="outline" onClick={() => setMealPlanDialogOpen(true)}>
              {activeMealPlan ? t("changeMealPlan") : t("assignMealPlan")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeMealPlan ? (
            <Link
              href={`/nutrition/${(activeMealPlan as { meal_plan_id: string }).meal_plan_id}`}
              className="flex items-start gap-4 hover:opacity-80 transition-opacity"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-primary underline-offset-2 hover:underline">
                    {(activeMealPlan as { meal_plan?: { name: string } }).meal_plan?.name ?? t("unknownMealPlan")}
                  </p>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  {(activeMealPlan as { meal_plan?: { goal: string | null } }).meal_plan?.goal && (
                    <span>{(activeMealPlan as { meal_plan?: { goal: string | null } }).meal_plan!.goal}</span>
                  )}
                  {(activeMealPlan as { meal_plan?: { daily_calories: number | null } }).meal_plan?.daily_calories && (
                    <span>
                      {(activeMealPlan as { meal_plan?: { daily_calories: number | null } }).meal_plan!.daily_calories} kcal
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t("noActiveDiet")}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Trainer Notes */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <StickyNote className="h-4 w-4" />
              {t("trainerNotes")}
            </CardTitle>
            {notesEdited && (
              <Button
                size="sm"
                onClick={handleSaveNotes}
                disabled={updateClient.isPending}
              >
                <Save className="mr-1 h-3.5 w-3.5" />
                {tc("save")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={currentNotes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder={t("notesPlaceholder")}
            className="min-h-[100px] resize-y"
          />
        </CardContent>
      </Card>

      {/* Wizard Dialog */}
      <AssignPlanWizardDialog
        clientId={clientId}
        open={wizardOpen}
        onOpenChange={setWizardOpen}
      />

      <AssignRoutineToClientDialog
        clientId={clientId}
        open={routineDialogOpen}
        onOpenChange={setRoutineDialogOpen}
      />

      <AssignMealPlanToClientDialog
        clientId={clientId}
        open={mealPlanDialogOpen}
        onOpenChange={setMealPlanDialogOpen}
      />
    </div>
  );
}
