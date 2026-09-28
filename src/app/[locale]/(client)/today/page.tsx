"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  Dumbbell,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  useMyClient,
  useMyQuestionnaires,
  useMyRoutine,
  useWorkoutLogs,
} from "@/hooks/use-client-app";
import { localDateString, localWeekStartMonday } from "@/lib/local-date";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/shared/query-error-state";

export default function TodayPage() {
  const t = useTranslations("clientToday");
  const locale = useLocale();
  const clientQuery = useMyClient();
  const routineQuery = useMyRoutine();
  const questionnairesQuery = useMyQuestionnaires();
  const logsQuery = useWorkoutLogs(routineQuery.data?.id ?? "");

  const isLoading =
    clientQuery.isLoading ||
    routineQuery.isLoading ||
    questionnairesQuery.isLoading ||
    (Boolean(routineQuery.data) && logsQuery.isLoading);

  const isError =
    clientQuery.isError ||
    routineQuery.isError ||
    questionnairesQuery.isError ||
    logsQuery.isError;

  const routine = routineQuery.data;
  const days = routine?.routine?.days ?? [];
  const today = localDateString();
  const weekStart = localWeekStartMonday();
  const completedThisWeek = (logsQuery.data ?? []).filter(
    (log) => log.completed && log.date >= weekStart
  ).length;
  const target = routine?.routine?.days_per_week ?? days.length;
  const progress = target > 0 ? Math.min(100, Math.round((completedThisWeek / target) * 100)) : 0;
  const todayLog = (logsQuery.data ?? []).find((log) => log.date === today);
  const nextDay = days[Math.min(completedThisWeek, Math.max(days.length - 1, 0))];
  const pendingQuestionnaires = (questionnairesQuery.data ?? []).filter(
    (item) => item.status === "pending" || item.status === "assigned"
  );

  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(new Date()),
    [locale]
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-36 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <QueryErrorState
        onRetry={() => {
          void clientQuery.refetch();
          void routineQuery.refetch();
          void questionnairesQuery.refetch();
          void logsQuery.refetch();
        }}
        isRetrying={
          clientQuery.isRefetching ||
          routineQuery.isRefetching ||
          questionnairesQuery.isRefetching ||
          logsQuery.isRefetching
        }
      />
    );
  }

  const firstName = clientQuery.data?.full_name?.split(" ")[0] ?? "";
  const trainerSettings = clientQuery.data?.trainer?.settings;
  const welcomeMessage =
    typeof trainerSettings?.welcome_message === "string"
      ? trainerSettings.welcome_message.trim()
      : "";
  const workoutCompleted = Boolean(todayLog?.completed);
  const workoutInProgress = Boolean(todayLog && !todayLog.completed);

  return (
    <div className="space-y-5 pb-2">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 px-5 py-6 shadow-2xl shadow-background/30 sm:px-7 sm:py-8">
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-2/3 opacity-80"
          style={{
            background:
              "radial-gradient(circle at 80% 20%, hsl(var(--primary) / 0.22), transparent 46%), radial-gradient(circle at 100% 100%, hsl(var(--chart-2) / 0.12), transparent 55%)",
          }}
        />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {dateLabel}
          </p>
          <h1 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {firstName ? t("greeting", { name: firstName }) : t("greetingFallback")}
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {welcomeMessage || (workoutCompleted ? t("dayComplete") : t("dayIntro"))}
          </p>
        </div>
      </section>

      <section aria-labelledby="today-focus-title">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {t("nextStep")}
            </p>
            <h2 id="today-focus-title" className="mt-1 font-display text-xl font-bold">
              {workoutCompleted ? t("recoveryTitle") : t("trainingTitle")}
            </h2>
          </div>
          <div
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full"
            style={{
              background: `conic-gradient(hsl(var(--primary)) ${progress}%, hsl(var(--muted)) ${progress}% 100%)`,
            }}
            aria-label={t("weekProgress", { completed: completedThisWeek, target })}
          >
            <div className="grid h-11 w-11 place-items-center rounded-full bg-card font-display text-xs font-bold tabular-nums">
              {completedThisWeek}/{target || "–"}
            </div>
          </div>
        </div>

        <Card className="group overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card">
          <CardContent className="p-0">
            <Link
              href="/my-routine"
              className="flex min-h-48 flex-col justify-between gap-6 p-5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  {workoutCompleted ? <Check className="h-6 w-6" /> : <Dumbbell className="h-6 w-6" />}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                  {workoutInProgress ? t("continue") : workoutCompleted ? t("review") : t("open")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {routine?.routine?.name ?? t("noRoutine")}
                </p>
                <p className="mt-1 font-display text-2xl font-bold tracking-tight">
                  {nextDay?.name ||
                    (nextDay ? t("routineDay", { number: nextDay.day_number }) : t("askTrainer"))}
                </p>
                {nextDay && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("exerciseCount", { count: nextDay.exercises?.length ?? 0 })}
                  </p>
                )}
              </div>
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="relative pl-5">
        <div aria-hidden className="absolute bottom-5 left-[7px] top-5 w-px bg-border" />
        <div className="space-y-3">
          <Link
            href="/my-progress"
            className="relative flex items-center gap-4 rounded-2xl border bg-card/60 p-4 transition-colors hover:border-primary/30 hover:bg-card"
          >
            <span className="absolute -left-[21px] h-3.5 w-3.5 rounded-full border-4 border-background bg-primary" />
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{t("weeklyProgress")}</p>
              <p className="text-xs text-muted-foreground">
                {t("weekProgress", { completed: completedThisWeek, target })}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          {pendingQuestionnaires.length > 0 && (
            <Link
              href="/my-questionnaires"
              className="relative flex items-center gap-4 rounded-2xl border bg-card/60 p-4 transition-colors hover:border-warning/30 hover:bg-card"
            >
              <span className="absolute -left-[21px] h-3.5 w-3.5 rounded-full border-4 border-background bg-warning" />
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
                <ClipboardCheck className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{t("pendingReview")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("pendingQuestionnaires", { count: pendingQuestionnaires.length })}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          )}

          <Link
            href="/my-messages"
            className="relative flex items-center gap-4 rounded-2xl border bg-card/60 p-4 transition-colors hover:border-info/30 hover:bg-card"
          >
            <span className="absolute -left-[21px] h-3.5 w-3.5 rounded-full border-4 border-background bg-info" />
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10 text-info">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{t("trainerContact")}</p>
              <p className="text-xs text-muted-foreground">{t("trainerContactDescription")}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </section>
    </div>
  );
}
