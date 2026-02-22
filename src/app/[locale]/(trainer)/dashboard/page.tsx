"use client";

import { useTranslations } from "next-intl";
import { useDashboardStats } from "@/hooks/use-dashboard";
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
} from "lucide-react";
import Link from "next/link";

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

export default function DashboardPage() {
  const t = useTranslations("dashboard");
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
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
      </div>

      {/* KPI Cards - 6 cards in 2x3 grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.label}
              className={`glass-elevated shadow-xl transition-all duration-300 ${kpi.glow}`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-muted-foreground truncate">
                      {kpi.label}
                    </p>
                    <p className={`text-3xl font-bold mt-1 ${kpi.urgent ? "text-rose-400" : ""}`}>
                      {kpi.value}
                    </p>
                  </div>
                  <div
                    className={`h-12 w-12 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}
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
    </div>
  );
}
