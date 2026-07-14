"use client";

import { useTranslations, useLocale } from "next-intl";
import { useAdminStats } from "@/hooks/use-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  UserCheck,
  Dumbbell,
  ClipboardList,
  CreditCard,
  Activity,
  Gauge,
  TrendingUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { STATUS_STYLES, ACCENT_STYLES, AVATAR_GRADIENTS } from "@/lib/ui-tokens";

const roleColors: Record<string, string> = {
  admin: "bg-primary/10 text-primary border-primary/20",
  trainer: STATUS_STYLES.trainer,
  client: STATUS_STYLES.client,
};

function UserAvatar({ name }: { name: string }) {
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0])
      .join("")
      .toUpperCase() || "?";
  const hash = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0);
  const gradient = AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
  return (
    <div
      className={`h-8 w-8 shrink-0 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-[10px] font-bold text-white ring-1 ring-white/10`}
    >
      {initials}
    </div>
  );
}

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const { data, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: t("totalUsers"), value: data.totalUsers, icon: Users },
    { label: t("totalTrainers"), value: data.totalTrainers, icon: UserCheck },
    { label: t("totalClients"), value: data.totalClients, icon: Activity },
    { label: t("totalRoutines"), value: data.totalRoutines, icon: ClipboardList },
    { label: t("totalExercises"), value: data.totalExercises, icon: Dumbbell },
    { label: t("paidSubscriptions"), value: data.paidSubscriptions, icon: CreditCard },
  ].map((stat, i) => ({
    ...stat,
    color: ACCENT_STYLES[i % ACCENT_STYLES.length].text,
    bg: ACCENT_STYLES[i % ACCENT_STYLES.length].bg,
  }));

  const paidRate =
    data.totalTrainers > 0
      ? Math.round((data.paidSubscriptions / data.totalTrainers) * 100)
      : 0;
  const avgClients =
    data.totalTrainers > 0
      ? (data.totalClients / data.totalTrainers).toFixed(1)
      : "0";

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl px-5 py-6 sm:px-6 sm:py-7 animate-fade-in-up">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(60% 80% at 0% 0%, hsl(105 58% 45% / 0.18), transparent 60%), radial-gradient(50% 80% at 100% 0%, hsl(190 80% 50% / 0.14), transparent 60%)",
          }}
        />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
          {t("title")}
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              style={{ animationDelay: `${idx * 60}ms` }}
              className="glass-elevated transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-fade-in-up"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-11 shrink-0 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl sm:text-3xl font-bold tabular-nums leading-none">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground truncate">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Platform overview */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Gauge className="h-4 w-4 text-primary" />
            {t("platformOverview")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">{t("paidRate")}</span>
              <span className="font-semibold tabular-nums">{paidRate}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-chart-1 transition-all duration-700"
                style={{ width: `${Math.min(paidRate, 100)}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-success/15 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold tabular-nums leading-none">{avgClients}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("avgClientsPerTrainer")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Users */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("recentUsers")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {data.recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-lg px-2 py-2 -mx-2 hover:bg-accent/50 transition-colors"
              >
                <UserAvatar name={user.full_name || user.email} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {user.full_name || user.email}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge variant="outline" className={roleColors[user.role] || ""}>
                    {user.role}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(user.created_at), {
                      addSuffix: true,
                      locale: locale === "es" ? es : enUS,
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
