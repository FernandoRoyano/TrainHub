"use client";

import { useTranslations } from "next-intl";
import { useMyMeasurements } from "@/hooks/use-client-app";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Ruler, TrendingDown } from "lucide-react";

export default function MyMeasurementsPage() {
  const t = useTranslations("measurements");
  const tc = useTranslations("clientApp");
  const te = useTranslations("empty");
  const { data: measurements, isLoading } = useMyMeasurements();

  const chartData = (measurements ?? []).map((m) => ({
    date: m.date,
    weight: m.weight,
    body_fat_pct: m.body_fat_pct,
    waist_cm: m.waist_cm,
  }));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{tc("myMeasurements")}</h1>

      {/* Evolution chart */}
      {chartData.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              {t("evolution")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name={t("weight")}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="body_fat_pct"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name={t("body_fat_pct")}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="waist_cm"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name={t("waist_cm")}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Measurements list */}
      {!measurements || measurements.length === 0 ? (
        <EmptyState
          icon={Ruler}
          emoji={"\uD83D\uDCCF"}
          title={te("measurementsTitle")}
          description={te("measurementsDescription")}
        />
      ) : (
        <div className="space-y-2">
          {[...measurements].reverse().map((m) => (
            <Card key={m.id}>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground mb-2">{m.date}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {m.weight != null && (
                    <div>
                      <span className="text-muted-foreground">{t("weight")}</span>
                      <p className="font-semibold">{m.weight}</p>
                    </div>
                  )}
                  {m.body_fat_pct != null && (
                    <div>
                      <span className="text-muted-foreground">{t("body_fat_pct")}</span>
                      <p className="font-semibold">{m.body_fat_pct}%</p>
                    </div>
                  )}
                  {m.chest_cm != null && (
                    <div>
                      <span className="text-muted-foreground">{t("chest_cm")}</span>
                      <p className="font-semibold">{m.chest_cm}</p>
                    </div>
                  )}
                  {m.waist_cm != null && (
                    <div>
                      <span className="text-muted-foreground">{t("waist_cm")}</span>
                      <p className="font-semibold">{m.waist_cm}</p>
                    </div>
                  )}
                  {m.hips_cm != null && (
                    <div>
                      <span className="text-muted-foreground">{t("hips_cm")}</span>
                      <p className="font-semibold">{m.hips_cm}</p>
                    </div>
                  )}
                  {m.bicep_cm != null && (
                    <div>
                      <span className="text-muted-foreground">{t("bicep_cm")}</span>
                      <p className="font-semibold">{m.bicep_cm}</p>
                    </div>
                  )}
                  {m.thigh_cm != null && (
                    <div>
                      <span className="text-muted-foreground">{t("thigh_cm")}</span>
                      <p className="font-semibold">{m.thigh_cm}</p>
                    </div>
                  )}
                  {m.calf_cm != null && (
                    <div>
                      <span className="text-muted-foreground">{t("calf_cm")}</span>
                      <p className="font-semibold">{m.calf_cm}</p>
                    </div>
                  )}
                </div>
                {m.notes && (
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    {m.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
