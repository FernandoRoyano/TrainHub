"use client";

import { useTranslations } from "next-intl";
import { useMyActiveCoachingPlan, useMyQuestionnaires, useMyRoutine } from "@/hooks/use-client-app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";
import {
  ClipboardList,
  Calendar,
  Check,
  Dumbbell,
  UtensilsCrossed,
  MessageCircle,
  BarChart3,
  Ruler,
  ClipboardCheck,
  FileQuestion,
  ChevronRight,
  DollarSign,
} from "lucide-react";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  cancelled: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const featureIcons: Record<string, typeof Dumbbell> = {
  training: Dumbbell,
  nutrition: UtensilsCrossed,
  messaging: MessageCircle,
  progress_tracking: BarChart3,
  measurements: Ruler,
  checkins: ClipboardCheck,
  questionnaires: FileQuestion,
};

export default function MyPlanPage() {
  const t = useTranslations("myPlan");
  const { data: planData, isLoading } = useMyActiveCoachingPlan();
  const { data: routine } = useMyRoutine();
  const { data: questionnaires } = useMyQuestionnaires();

  const pendingQuestionnaires = questionnaires?.filter(
    (q) => q.status === "pending" || q.status === "assigned"
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (!planData) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">{t("title")}</h1>

        {/* Show routine even without coaching plan */}
        {routine?.routine ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                {t("viewRoutine")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/my-routine" className="flex items-center justify-between hover:opacity-80 transition-opacity">
                <div>
                  <p className="font-medium text-sm text-primary">{routine.routine.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {routine.routine.days_per_week} {t("daysPerWeek")} · {routine.routine.duration_weeks} {t("weeks")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            icon={ClipboardList}
            title={t("noPlan")}
            description={t("contactTrainer")}
          />
        )}

        {/* Pending questionnaires */}
        {pendingQuestionnaires && pendingQuestionnaires.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileQuestion className="h-4 w-4" />
                {t("pendingQuestionnaires")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pendingQuestionnaires.map((q) => (
                  <Link
                    key={q.id}
                    href={`/my-questionnaires/${q.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <p className="text-sm font-medium">{q.template?.name ?? "Cuestionario"}</p>
                    <Badge variant="outline" className={statusColors[q.status] ?? ""}>{q.status}</Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/my-routine" className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:bg-accent transition-colors">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="text-xs font-medium">{t("viewRoutine")}</span>
          </Link>
          <Link href="/my-messages" className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:bg-accent transition-colors">
            <MessageCircle className="h-6 w-6 text-primary" />
            <span className="text-xs font-medium">{t("messages")}</span>
          </Link>
        </div>
      </div>
    );
  }

  const plan = planData.coaching_plan;
  const tier = plan?.service_tier as {
    id: string;
    name: string;
    color: string | null;
    features?: Record<string, boolean>;
  } | null;
  const features = tier?.features ?? {};
  const enabledFeatures = Object.entries(features).filter(([, v]) => v);

  const featureLabelKeys: Record<string, string> = {
    training: "training",
    nutrition: "nutrition",
    messaging: "messaging",
    progress_tracking: "progressTracking",
    measurements: "measurements",
    checkins: "checkins",
    questionnaires: "questionnaires",
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{t("title")}</h1>

      {/* Plan Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {plan?.cover_image && (
              <img
                src={plan.cover_image}
                alt=""
                className="w-16 h-16 rounded-lg object-cover shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-semibold text-base">
                  {plan?.name ?? t("title")}
                </h2>
                <Badge variant="outline" className={statusColors[planData.status] ?? ""}>
                  {planData.status}
                </Badge>
                {tier && (
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: tier.color ?? undefined,
                      color: tier.color ?? undefined,
                    }}
                  >
                    {tier.name}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {t("startDate")}: {planData.start_date}
                </span>
                {planData.end_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {t("endDate")}: {planData.end_date}
                  </span>
                )}
                {plan?.price != null && plan.price > 0 && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {t("price")}: {plan.price}{plan.currency ? ` ${plan.currency}` : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Included */}
      {enabledFeatures.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("whatsIncluded")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {enabledFeatures.map(([key]) => {
                const Icon = featureIcons[key] ?? Check;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-2 rounded-lg border p-2.5"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10">
                      <Icon className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <span className="text-sm">
                      {t(featureLabelKeys[key] ?? key)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Questionnaires */}
      {pendingQuestionnaires && pendingQuestionnaires.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileQuestion className="h-4 w-4" />
              {t("pendingQuestionnaires")}
              <Badge variant="secondary" className="ml-1">
                {pendingQuestionnaires.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingQuestionnaires.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <p className="text-sm font-medium truncate">
                    {q.template?.name ?? t("questionnaires")}
                  </p>
                  <Link href={`/my-questionnaires/${q.id}`}>
                    <Button size="sm" variant="outline">
                      {t("fillQuestionnaire")}
                      <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/my-routine">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <Dumbbell className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">{t("viewRoutine")}</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/my-nutrition">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <UtensilsCrossed className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">{t("viewNutrition")}</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
