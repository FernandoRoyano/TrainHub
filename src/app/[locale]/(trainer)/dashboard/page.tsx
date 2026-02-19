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
} from "lucide-react";
import Link from "next/link";

const activityIcons = {
  client_added: UserCheck,
  routine_created: FileText,
  routine_assigned: ArrowRight,
  message_received: MessageCircle,
} as const;

const kpiConfig = [
  { key: "activeClients", icon: Users, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { key: "totalRoutines", icon: ClipboardList, color: "text-blue-400", bg: "bg-blue-400/10" },
  { key: "unreadMessages", icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-400/10" },
  { key: "recentActivity", icon: Activity, color: "text-purple-400", bg: "bg-purple-400/10" },
] as const;

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { data: stats, isLoading } = useDashboardStats();

  const kpiValues = [
    stats?.activeClients ?? 0,
    stats?.totalRoutines ?? 0,
    stats?.unreadMessages ?? 0,
    stats?.recentActivity?.length ?? 0,
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiConfig.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.key} className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t(kpi.key)}
                    </p>
                    <p className="text-3xl font-bold mt-1">{kpiValues[i]}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {t("quickActions")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/clients/new">
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t("addClient")}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/routines/new">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("createRoutine")}
                </Link>
              </Button>
              <Button variant="outline" asChild>
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
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </p>
                      </div>
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
