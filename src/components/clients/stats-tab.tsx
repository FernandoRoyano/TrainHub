"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useClient } from "@/hooks/use-clients";
import { useMeasurements } from "@/hooks/use-measurements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  User,
  Activity,
  Ruler,
  TrendingDown,
} from "lucide-react";

interface StatsTabProps {
  clientId: string;
}

function calculateAge(birthDate: string): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

function calculateTMB(weightKg: number, heightCm: number, age: number, isMale = true): number {
  // Mifflin-St Jeor
  if (isMale) {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

export function StatsTab({ clientId }: StatsTabProps) {
  const t = useTranslations("statsTab");
  const { data: client, isLoading: loadingClient } = useClient(clientId);
  const { data: measurements, isLoading: loadingMeasurements } = useMeasurements(clientId);

  const profileData = useMemo(
    () => ((client?.profile_data ?? {}) as Record<string, unknown>),
    [client]
  );

  const weight = profileData.weight as number | undefined;
  const height = profileData.height as number | undefined;
  const birthDate = profileData.birth_date as string | undefined;
  const age = birthDate ? calculateAge(birthDate) : null;

  const sortedMeasurements = measurements ?? [];
  const latest = sortedMeasurements.length > 0
    ? sortedMeasurements[sortedMeasurements.length - 1]
    : null;

  const effectiveWeight = latest?.weight ?? weight;
  const effectiveHeight = height;

  const bmi = effectiveWeight && effectiveHeight
    ? calculateBMI(effectiveWeight, effectiveHeight)
    : null;

  const tmb = effectiveWeight && effectiveHeight && age
    ? calculateTMB(effectiveWeight, effectiveHeight, age)
    : null;

  const chartData = sortedMeasurements
    .filter((m) => m.weight != null)
    .map((m) => ({
      date: m.date,
      weight: m.weight,
    }));

  const isLoading = loadingClient || loadingMeasurements;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Profile Data */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            {t("profileData")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">{t("weight")}</p>
              <p className="text-lg font-semibold">
                {effectiveWeight != null ? `${effectiveWeight} kg` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("height")}</p>
              <p className="text-lg font-semibold">
                {effectiveHeight != null ? `${effectiveHeight} cm` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("age")}</p>
              <p className="text-lg font-semibold">
                {age != null ? `${age} ${t("years")}` : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Body Composition */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {t("bodyComposition")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">{t("weight")}</p>
              <p className="text-lg font-semibold">
                {effectiveWeight != null ? `${effectiveWeight} kg` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("bodyFat")}</p>
              <p className="text-lg font-semibold">
                {latest?.body_fat_pct != null ? `${latest.body_fat_pct}%` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("bmi")}</p>
              <p className="text-lg font-semibold">
                {bmi != null ? bmi.toFixed(1) : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("tmb")}</p>
              <p className="text-lg font-semibold">
                {tmb != null ? `${Math.round(tmb)} kcal` : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Latest Measurements Grid */}
      {latest && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              {t("latestMeasurements")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              {t("measurementDate")}: {latest.date}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {latest.weight != null && (
                <div>
                  <p className="text-xs text-muted-foreground">{t("weight")}</p>
                  <p className="text-sm font-semibold">{latest.weight} kg</p>
                </div>
              )}
              {latest.body_fat_pct != null && (
                <div>
                  <p className="text-xs text-muted-foreground">{t("bodyFat")}</p>
                  <p className="text-sm font-semibold">{latest.body_fat_pct}%</p>
                </div>
              )}
              {latest.chest_cm != null && (
                <div>
                  <p className="text-xs text-muted-foreground">{t("chest")}</p>
                  <p className="text-sm font-semibold">{latest.chest_cm} cm</p>
                </div>
              )}
              {latest.waist_cm != null && (
                <div>
                  <p className="text-xs text-muted-foreground">{t("waist")}</p>
                  <p className="text-sm font-semibold">{latest.waist_cm} cm</p>
                </div>
              )}
              {latest.hips_cm != null && (
                <div>
                  <p className="text-xs text-muted-foreground">{t("hips")}</p>
                  <p className="text-sm font-semibold">{latest.hips_cm} cm</p>
                </div>
              )}
              {latest.bicep_cm != null && (
                <div>
                  <p className="text-xs text-muted-foreground">{t("bicep")}</p>
                  <p className="text-sm font-semibold">{latest.bicep_cm} cm</p>
                </div>
              )}
              {latest.thigh_cm != null && (
                <div>
                  <p className="text-xs text-muted-foreground">{t("thigh")}</p>
                  <p className="text-sm font-semibold">{latest.thigh_cm} cm</p>
                </div>
              )}
              {latest.calf_cm != null && (
                <div>
                  <p className="text-xs text-muted-foreground">{t("calf")}</p>
                  <p className="text-sm font-semibold">{latest.calf_cm} cm</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weight Chart */}
      {chartData.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              {t("weightEvolution")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={["dataMin - 2", "dataMax + 2"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name={t("weight")}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
