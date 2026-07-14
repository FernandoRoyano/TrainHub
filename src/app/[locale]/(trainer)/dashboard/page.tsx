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
  Inbox,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "@/i18n/navigation";
import { TrainerPhaseGrid } from "@/components/cycle-training/trainer-phase-grid";
import { ACCENT_STYLES, AVATAR_GRADIENTS } from "@/lib/ui-tokens";

const activityIcons = {
  client_added: UserCheck,
  routine_created: FileText,
  routine_assigned: ArrowRight,
  message_received: MessageCircle,
} as const;

function timeAgo(timestamp: string, locale: string): string {
  // Localizado: antes devolvía "now"/"5m" en inglés también en la UI española
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "narrow" });
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return rtf.format(0, "minute");
  if (minutes < 60) return rtf.format(-minutes, "minute");
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return rtf.format(-hours, "hour");
  return rtf.format(-Math.floor(hours / 24), "day");
}

function getGreetingKey(): "greetingMorning" | "greetingAfternoon" | "greetingEvening" {
  const h = new Date().getHours();
  if (h < 12) return "greetingMorning";
  if (h < 20) return "greetingAfternoon";
  return "greetingEvening";
}

function ClientAvatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase() || "?";
  const hash = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0);
  const gradient = AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
  const dim = size === "md" ? "h-9 w-9 text-xs" : "h-7 w-7 text-[10px]";
  return (
    <div
      className={`${dim} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white shrink-0 ring-1 ring-white/10`}
    >
      {initials}
    </div>
  );
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

  // Acentos desde la paleta del sistema (ui-tokens) — un look, cinco tonos
  const kpis = [
    {
      label: t("activeClients"),
      value: stats?.activeClients ?? 0,
      icon: Users,
      accent: ACCENT_STYLES[0],
    },
    {
      label: t("trackingRate"),
      value: `${stats?.trackingRate ?? 0}%`,
      subtitle: t("trackingRateDesc"),
      icon: TrendingUp,
      accent: ACCENT_STYLES[1],
      progress: stats?.trackingRate ?? 0,
    },
    {
      label: t("totalRoutines"),
      value: stats?.totalRoutines ?? 0,
      icon: ClipboardList,
      accent: ACCENT_STYLES[2],
    },
    {
      label: t("pendingReviews"),
      value: stats?.pendingReviews ?? 0,
      subtitle: t("pendingReviewsDesc"),
      icon: AlertCircle,
      accent: ACCENT_STYLES[4],
      urgent: (stats?.pendingReviews ?? 0) > 0,
    },
    {
      label: t("weekSessions"),
      value: stats?.weekSessions ?? 0,
      icon: CalendarCheck,
      accent: ACCENT_STYLES[3],
    },
    {
      label: t("unreadMessages"),
      value: stats?.unreadMessages ?? 0,
      icon: MessageSquare,
      accent: ACCENT_STYLES[1],
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="relative overflow-hidden rounded-2xl px-5 py-6 sm:px-6 sm:py-8 animate-fade-in-up">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(60% 80% at 0% 0%, hsl(var(--primary) / 0.16), transparent 60%), radial-gradient(50% 80% at 100% 0%, hsl(var(--chart-2) / 0.10), transparent 60%)",
          }}
        />
        <p className="text-xs sm:text-sm text-muted-foreground capitalize">{today}</p>
        <h1 className="mt-1 font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          {greeting}
          {trainerName ? (
            <>
              , <span className="text-primary">{trainerName}</span>
            </>
          ) : null}{" "}
          👋
        </h1>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
          {t("greetingSubtitle")}
        </p>
      </div>

      {/* Quick actions - táctiles, lo primero al alcance del pulgar */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {[
          { href: "/clients/new", icon: UserPlus, label: t("addClient"), accent: "text-primary bg-primary/15" },
          { href: "/routines/new", icon: Plus, label: t("createRoutine"), accent: `${ACCENT_STYLES[1].text} ${ACCENT_STYLES[1].bg}` },
          { href: "/messages", icon: Mail, label: t("viewMessages"), accent: `${ACCENT_STYLES[3].text} ${ACCENT_STYLES[3].bg}` },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="glass flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-2xl px-2 py-3 text-center transition-all hover:scale-[1.02] active:scale-[0.97]"
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.accent}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[11px] sm:text-xs font-medium leading-tight">{action.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Hero KPIs - 2 prominentes */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2">
        {kpis.slice(0, 2).map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.label}
              style={{ animationDelay: `${idx * 80}ms` }}
              className={`glass-elevated shadow-xl border-t-2 ${kpi.accent.borderT} transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-default animate-fade-in-up ${kpi.accent.glow}`}
            >
              <CardContent className="pt-4 pb-4 sm:pt-6 sm:pb-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {kpi.label}
                    </p>
                    <p className={`font-display text-3xl sm:text-5xl font-bold mt-1.5 sm:mt-2 tabular-nums tracking-tight ${kpi.urgent ? "text-destructive animate-pulse" : ""}`}>
                      {kpi.value}
                    </p>
                    {kpi.subtitle && (
                      <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground">{kpi.subtitle}</p>
                    )}
                  </div>
                  <div
                    className={`h-11 w-11 sm:h-14 sm:w-14 rounded-2xl ${kpi.accent.bg} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`h-5 w-5 sm:h-7 sm:w-7 ${kpi.accent.text}`} />
                  </div>
                </div>
                {kpi.progress !== undefined && (
                  <div className="mt-4 h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${Math.min(kpi.progress, 100)}%` }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* KPIs secundarios - 4 compactos */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {kpis.slice(2).map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.label}
              style={{ animationDelay: `${(idx + 2) * 80}ms` }}
              className={`glass-elevated shadow-md border-t-2 ${kpi.accent.borderT} transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-default animate-fade-in-up ${kpi.accent.glow}`}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl ${kpi.accent.bg} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`h-5 w-5 ${kpi.accent.text}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-muted-foreground truncate uppercase tracking-wide">
                      {kpi.label}
                    </p>
                    <p className={`font-display text-2xl font-bold tabular-nums leading-tight ${kpi.urgent ? "text-destructive animate-pulse" : ""}`}>
                      {kpi.value}
                    </p>
                  </div>
                </div>
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
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <p className="font-display text-2xl font-bold tabular-nums">{summary?.workouts ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("workoutsThisWeek")}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <p className="font-display text-2xl font-bold tabular-nums">{summary?.newClients ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("newClientsThisWeek")}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <p className="font-display text-2xl font-bold tabular-nums">{summary?.messagesSent ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("messagesSentThisWeek")}</p>
              </div>
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
                        {timeAgo(item.timestamp, locale)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
                  <Inbox className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">{t("noActivity")}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("noActivityHint")}
                </p>
              </div>
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
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.25} />
                  </linearGradient>
                </defs>
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
                <Bar dataKey="workouts" fill="url(#barFill)" radius={[6, 6, 0, 0]} />
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
                      ? "bg-success"
                      : client.compliancePercent >= 50
                        ? "bg-warning"
                        : "bg-destructive";
                  return (
                    <div key={client.clientId} className="flex items-center gap-3">
                      <ClientAvatar name={client.name} />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between text-sm gap-2">
                          <span className="font-medium truncate">{client.name}</span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {t("complianceRate", {
                              done: client.workoutsThisWeek,
                              total: client.assignedDays || "–",
                            })}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${color} transition-all duration-500`}
                            style={{ width: `${Math.min(client.compliancePercent, 100)}%` }}
                          />
                        </div>
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
              <AlertTriangle className="h-4 w-4 text-warning" />
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
                    className="flex items-center gap-3 text-sm rounded-lg border p-3 hover:bg-accent/50 hover:border-border transition-all active:scale-[0.98]"
                  >
                    <ClientAvatar name={client.name} />
                    <span className="font-medium truncate flex-1">{client.name}</span>
                    <Badge variant="outline" className="text-destructive border-destructive/25 shrink-0">
                      {client.daysSinceLastWorkout === -1
                        ? t("neverTrained")
                        : t("daysSinceWorkout", { days: client.daysSinceLastWorkout })}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-success mb-2" />
                <p className="text-sm text-muted-foreground">{t("allClientsOnTrack")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
