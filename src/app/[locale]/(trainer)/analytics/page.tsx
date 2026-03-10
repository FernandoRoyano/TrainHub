"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAnalytics } from "@/hooks/use-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Activity,
  UserCheck,
  Dumbbell,
  BarChart3,
} from "lucide-react";

const PIE_COLORS = [
  "hsl(var(--chart-1, 142 71% 45%))",
  "hsl(var(--chart-2, 47 96% 53%))",
  "hsl(var(--chart-3, 0 84% 60%))",
  "hsl(var(--chart-4, 221 83% 53%))",
];

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: 12,
};

function TrendBadge({ current, previous, label }: { current: number; previous: number; label: string }) {
  const diff = current - previous;
  const Icon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;
  const color = diff > 0 ? "text-green-500" : diff < 0 ? "text-red-500" : "text-muted-foreground";

  return (
    <div className="text-center">
      <p className="text-2xl font-bold">{current}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className={`flex items-center justify-center gap-1 mt-1 text-xs ${color}`}>
        <Icon className="h-3 w-3" />
        <span>{diff > 0 ? `+${diff}` : diff}</span>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const t = useTranslations("analytics");
  const tc = useTranslations("common");
  const [days, setDays] = useState(90);
  const { data, isLoading } = useAnalytics(days);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { thisWeek, lastWeek } = data.weeklyComparison;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">{t("last30days")}</SelectItem>
            <SelectItem value="90">{t("last90days")}</SelectItem>
            <SelectItem value="180">{t("last6months")}</SelectItem>
            <SelectItem value="365">{t("lastYear")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Week Comparison KPIs */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("weekOverWeek")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <TrendBadge
              current={thisWeek.sessions}
              previous={lastWeek.sessions}
              label={t("sessions")}
            />
            <TrendBadge
              current={thisWeek.activeClients}
              previous={lastWeek.activeClients}
              label={t("activeClients")}
            />
            <TrendBadge
              current={thisWeek.volume}
              previous={lastWeek.volume}
              label={t("volumeKg")}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Client Growth */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t("clientGrowth")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.clientGrowth.length > 1 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.clientGrowth}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" allowDecimals={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name={t("totalClients")}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">{t("needMoreData")}</p>
            )}
          </CardContent>
        </Card>

        {/* Retention Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              {t("retentionRate")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.retentionRate.length > 1 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.retentionRate}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" domain={[0, 100]} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}%`, ""]} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="hsl(var(--chart-2, 160 60% 45%))"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name={t("retentionRate")}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">{t("needMoreData")}</p>
            )}
          </CardContent>
        </Card>

        {/* Sessions Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {t("sessionsTrend")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.workoutVolumeTrend.length > 1 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.workoutVolumeTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" allowDecimals={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar
                    dataKey="sessions"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    name={t("sessions")}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">{t("needMoreData")}</p>
            )}
          </CardContent>
        </Card>

        {/* Client Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t("clientDistribution")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.clientDistribution.length > 0 ? (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="100%" height={200} className="max-w-[180px]">
                  <PieChart>
                    <Pie
                      data={data.clientDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {data.clientDistribution.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {data.clientDistribution.map((item, i) => (
                    <div key={item.status} className="flex items-center gap-2 text-sm">
                      <div
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      <span className="capitalize">{tc(item.status as "active" | "inactive" | "paused" | "pending")}</span>
                      <span className="text-muted-foreground ml-auto font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">{t("needMoreData")}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Exercises */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            {t("topExercises")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.topExercises.length > 0 ? (
            <div className="space-y-2">
              {data.topExercises.map((ex, i) => {
                const maxSets = data.topExercises[0].totalSets;
                const pct = Math.round((ex.totalSets / maxSets) * 100);
                return (
                  <div key={ex.name} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-5 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate">{ex.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{ex.totalSets} sets</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">{t("needMoreData")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
