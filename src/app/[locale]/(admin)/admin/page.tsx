"use client";

import { useTranslations } from "next-intl";
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
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

const roleColors: Record<string, string> = {
  admin: "bg-primary/10 text-primary border-primary/20",
  trainer: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  client: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const { data, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
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
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("recentUsers")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.full_name || user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant="outline"
                    className={roleColors[user.role] || ""}
                  >
                    {user.role}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(user.created_at), {
                      addSuffix: true,
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
