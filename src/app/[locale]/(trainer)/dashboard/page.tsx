"use client";

import { useTranslations, useLocale } from "next-intl";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ClipboardList,
  MessageSquare,
  Activity,
  UserPlus,
  Plus,
  Mail,
  UserCheck,
  FileText,
  ArrowRight,
  MessageCircle,
  TrendingUp,
  AlertCircle,
  CalendarCheck,
  Dumbbell,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { TrainerPhaseGrid } from "@/components/cycle-training/trainer-phase-grid";

const activityIcons = {
  client_added: UserCheck,
  routine_created: FileText,
  routine_assigned: ArrowRight,
  message_received: MessageCircle,
} as const;

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function getGreetingKey(): "greetingMorning" | "greetingAfternoon" | "greetingEvening" {
  const h = new Date().getHours();
  if (h < 12) return "greetingMorning";
  if (h < 20) return "greetingAfternoon";
  return "greetingEvening";
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tCal = useTranslations("calendar");
  const locale = useLocale();
  const { profile } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-52" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  // Map day codes to translated labels for the chart
  const dayLabelMap: Record<string, string> = {
    Mon: tCal("weekday_mon"),
    Tue: tCal("weekday_tue"),
    Wed: tCal("weekday_wed"),
    Thu: tCal("weekday_thu"),
    Fri: tCal("weekday_fri"),
    Sat: tCal("weekday_sat"),
    Sun: tCal("weekday_sun"),
  };

  const chartData = (stats?.weeklyActivity ?? []).map((d) => ({
    day: dayLabelMap[d.day] ?? d.day,
    workouts: d.workouts,
  }));

  const kpis = [
    {
      label: t("activeClients"),
      value: stats?.activeClients ?? 0,
      icon: Users,
      color: "text-emerald-400",
      bg: "bg-emerald-400/15",
      glow: "shadow-emerald-500/20 hover:shadow-emerald-500/30",
    },
    {
      label: t("trackingRate"),
      value: `${stats?.trackingRate ?? 0}%`,
      subtitle: t("trackingRateDesc"),
      icon: TrendingUp,
      color: "text-cyan-400",
      bg: "bg-cyan-400/15",
      glow: "shadow-cyan-500/20 hover:shadow-cyan-500/30",
      progress: stats?.trackingRate ?? 0,
    },
    {
      label: t("totalRoutines"),
      value: stats?.totalRoutines ?? 0,
      icon: ClipboardList,
      color: "text-blue-400",
      bg: "bg-blue-400/15",
      glow: "shadow-blue-500/20 hover:shadow-blue-500/30",
    },
    {
      label: t("pendingReviews"),
      value: stats?.pendingReviews ?? 0,
      subtitle: t("pendingReviewsDesc"),
      icon: AlertCircle,
      color: "text-rose-400",
      bg: "bg-rose-400/15",
      glow: "shadow-rose-500/20 hover:shadow-rose-500/30",
      urgent: (stats?.pendingReviews ?? 0) > 0,
    },
    {
      label: t("weekSessions"),
      value: stats?.weekSessions ?? 0,
      icon: CalendarCheck,
      color: "text-violet-400",
      bg: "bg-violet-400/15",
      glow: "shadow-violet-500/20 hover:shadow-violet-500/30",
    },
    {
      label: t("unreadMessages"),
      value: stats?.unreadMessages ?? 0,
      icon: MessageSquare,
      color: "text-amber-400",
      bg: "bg-amber-400/15",
      glow: "shadow-amber-500/20 hover:shadow-amber-500/30",
    },
  ];

  const summary = stats?.weekSummary;

  const greeting = t(getGreetingKey());
  const trainerName = profile?.full_name?.split(" ")[0] ?? "";
  const today = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const accentBorder: Record<string, string> = {
    "text-emerald-400": "border-t-emerald-400/40",
    "text-cyan-400": "border-t-cyan-400/40",
    "text-blue-400": "border-t-blue-400/40",
    "text-rose-400": "border-t-rose-400/40",
    "text-violet-400": "border-t-violet-400/40",
    "text-amber-400": "border-t-amber-400/40",
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl px-6 py-8 animate-fade-in-up">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(60% 80% at 0% 0%, hsl(160 70% 45% / 0.18), transparent 60%), radial-gradient(50% 80% at 100% 0%, hsl(190 80% 50% / 0.15), transparent 60%)",
          }}
        />
        <p className="text-sm text-muted-foreground capitalize">{today}</p>
        <h1 className="mt-1 text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
          {greeting}{trainerName ? `, ${trainerName}` : ""} 👋
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("greetingSubtitle")}
        </p>
      </div>

      {/* KPI Cards - 6 cards in 2x3 grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.label}
              style={{ animationDelay: `${idx * 80}ms` }}
              className={`glass-elevated shadow-xl border-t-2 ${accentBorder[kpi.color] ?? "border-t-transparent"} transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-default animate-fade-in-up ${kpi.glow}`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-muted-foreground truncate">
                      {kpi.label}
                    </p>
                    <p className={`text-3xl font-bold mt-1 tabular-nums ${kpi.urgent ? "text-rose-400 animate-pulse" : ""}`}>
                      {kpi.value}
                    </p>
                  </div>
                  <div
                    className={`h-12 w-12 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}
                  >
                    <Icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
                {kpi.progress !== undefined && (
                  <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                      style={{ width: `${Math.min(kpi.progress, 100)}%` }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Week Summary */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-primary" />
              {t("weekSummary")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{summary?.workouts ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("workoutsThisWeek")}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{summary?.newClients ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("newClientsThisWeek")}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{summary?.messagesSent ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("messagesSentThisWeek")}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <Button asChild size="sm">
                <Link href="/clients/new">
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t("addClient")}
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/routines/new">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("createRoutine")}
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/messages">
                  <Mail className="mr-2 h-4 w-4" />
                  {t("viewMessages")}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              {t("recentActivity")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivity.slice(0, 5).map((item) => {
                  const Icon = activityIcons[item.type];
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate">
                          <Badge variant="outline" className="mr-2 text-[10px]">
                            {t(`activity_${item.type}`)}
                          </Badge>
                          {item.description}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {timeAgo(item.timestamp)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("noActivity")}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            {t("weeklyActivity")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={32}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  width={24}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  formatter={(value) => [value, t("workoutsLabel")]}
                />
                <Bar dataKey="workouts" fill="#6dbd57" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cycle Phase Grid */}
      <TrainerPhaseGrid />

      {/* Client Compliance + Clients at Risk */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Client Compliance */}
        {(stats?.clientCompliance?.length ?? 0) > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {t("clientCompliance")}
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-xs" asChild>
                  <Link href="/clients">
                    {t("viewAllClients")} <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats!.clientCompliance.slice(0, 8).map((client) => {
                  const color =
                    client.compliancePercent >= 75
                      ? "bg-emerald-400"
                      : client.compliancePercent >= 50
                        ? "bg-amber-400"
                        : "bg-rose-400";
                  return (
                    <div key={client.clientId} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium truncate mr-2">{client.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {t("complianceRate", {
                            done: client.workoutsThisWeek,
                            total: client.assignedDays || "–",
                          })}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${color} transition-all duration-500`}
                          style={{ width: `${Math.min(client.compliancePercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Clients at Risk */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              {t("clientsAtRisk")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(stats?.clientsAtRisk?.length ?? 0) > 0 ? (
              <div className="space-y-3">
                {stats!.clientsAtRisk.slice(0, 8).map((client) => (
                  <Link
                    key={client.clientId}
                    href={`/clients/${client.clientId}`}
                    className="flex items-center justify-between gap-2 text-sm rounded-lg border p-3 hover:bg-accent/50 hover:border-border transition-all active:scale-[0.98]"
                  >
                    <span className="font-medium truncate">{client.name}</span>
                    <Badge variant="outline" className="text-rose-400 border-rose-500/20 shrink-0">
                      {client.daysSinceLastWorkout === -1
                        ? t("neverTrained")
                        : t("daysSinceWorkout", { days: client.daysSinceLastWorkout })}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-2" />
                <p className="text-sm text-muted-foreground">{t("allClientsOnTrack")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
