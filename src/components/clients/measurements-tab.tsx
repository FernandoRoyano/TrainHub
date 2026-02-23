"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  useMeasurements,
  useCreateMeasurement,
  useDeleteMeasurement,
} from "@/hooks/use-measurements";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Ruler, Plus, Trash2, TrendingDown } from "lucide-react";

interface BodySilhouetteProps {
  chest_cm: number | null;
  waist_cm: number | null;
  hips_cm: number | null;
  bicep_cm: number | null;
  thigh_cm: number | null;
  calf_cm: number | null;
}

function BodySilhouette({ chest_cm, waist_cm, hips_cm, bicep_cm, thigh_cm, calf_cm }: BodySilhouetteProps) {
  const t = useTranslations("measurements");

  const labels: { key: keyof BodySilhouetteProps; value: number | null; top: string; left: string }[] = [
    { key: "chest_cm", value: chest_cm, top: "23%", left: "105%" },
    { key: "waist_cm", value: waist_cm, top: "36%", left: "105%" },
    { key: "hips_cm", value: hips_cm, top: "46%", left: "105%" },
    { key: "bicep_cm", value: bicep_cm, top: "28%", left: "-70%" },
    { key: "thigh_cm", value: thigh_cm, top: "62%", left: "-70%" },
    { key: "calf_cm", value: calf_cm, top: "82%", left: "-70%" },
  ];

  const hasAnyValue = labels.some((l) => l.value != null);
  if (!hasAnyValue) return null;

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="relative w-full max-w-[200px] mx-auto">
          <svg viewBox="0 0 200 400" className="w-full max-w-[200px] mx-auto">
            {/* Head */}
            <circle cx="100" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            {/* Neck */}
            <line x1="100" y1="50" x2="100" y2="65" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            {/* Torso */}
            <path d="M70 65 L60 180 L80 190 L100 195 L120 190 L140 180 L130 65 Z" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            {/* Left arm */}
            <path d="M70 65 L45 130 L40 170" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            {/* Right arm */}
            <path d="M130 65 L155 130 L160 170" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            {/* Left leg */}
            <path d="M80 190 L75 280 L70 370" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            {/* Right leg */}
            <path d="M120 190 L125 280 L130 370" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          </svg>
          {labels.map(
            (label) =>
              label.value != null && (
                <div
                  key={label.key}
                  className="absolute text-[10px] leading-tight whitespace-nowrap text-muted-foreground"
                  style={{ top: label.top, left: label.left }}
                >
                  <span className="font-medium text-foreground">{t(label.key)}</span>
                  <br />
                  <span className="font-semibold text-primary">{label.value} cm</span>
                </div>
              )
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface MeasurementsTabProps {
  clientId: string;
}

const METRIC_FIELDS = [
  "weight",
  "body_fat_pct",
  "chest_cm",
  "waist_cm",
  "hips_cm",
  "bicep_cm",
  "thigh_cm",
  "calf_cm",
] as const;

export function MeasurementsTab({ clientId }: MeasurementsTabProps) {
  const t = useTranslations("measurements");
  const tc = useTranslations("common");
  const te = useTranslations("empty");
  const { data: measurements, isLoading } = useMeasurements(clientId);
  const createMeasurement = useCreateMeasurement();
  const deleteMeasurement = useDeleteMeasurement();

  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({
    date: new Date().toISOString().split("T")[0],
  });

  const handleCreate = () => {
    const data: Record<string, unknown> = {
      client_id: clientId,
      date: form.date,
    };
    for (const field of METRIC_FIELDS) {
      data[field] = form[field] ? parseFloat(form[field]) : null;
    }
    data.notes = form.notes || null;

    createMeasurement.mutate(data as Parameters<typeof createMeasurement.mutate>[0], {
      onSuccess: () => {
        setShowForm(false);
        setForm({ date: new Date().toISOString().split("T")[0] });
      },
    });
  };

  // Chart data
  const chartData = (measurements ?? []).map((m) => ({
    date: m.date,
    weight: m.weight,
    body_fat_pct: m.body_fat_pct,
    waist_cm: m.waist_cm,
  }));

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t("title")}
        </h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          {t("addMeasurement")}
        </Button>
      </div>

      {/* Body Silhouette - latest measurement */}
      {measurements && measurements.length > 0 && (() => {
        const latest = measurements[measurements.length - 1];
        return (
          <BodySilhouette
            chest_cm={latest.chest_cm}
            waist_cm={latest.waist_cm}
            hips_cm={latest.hips_cm}
            bicep_cm={latest.bicep_cm}
            thigh_cm={latest.thigh_cm}
            calf_cm={latest.calf_cm}
          />
        );
      })()}

      {showForm && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">{t("date")}</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {METRIC_FIELDS.map((field) => (
                <div key={field} className="space-y-1">
                  <Label className="text-xs">{t(field)}</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={form[field] ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [field]: e.target.value }))
                    }
                    placeholder="--"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
                {tc("cancel")}
              </Button>
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={createMeasurement.isPending}
              >
                {tc("save")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chart */}
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
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">{m.date}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      {m.weight && (
                        <span>
                          {t("weight")}: <strong>{m.weight}</strong>
                        </span>
                      )}
                      {m.body_fat_pct && (
                        <span>
                          {t("body_fat_pct")}: <strong>{m.body_fat_pct}%</strong>
                        </span>
                      )}
                      {m.waist_cm && (
                        <span>
                          {t("waist_cm")}: <strong>{m.waist_cm}</strong>
                        </span>
                      )}
                      {m.chest_cm && (
                        <span>
                          {t("chest_cm")}: <strong>{m.chest_cm}</strong>
                        </span>
                      )}
                      {m.hips_cm && (
                        <span>
                          {t("hips_cm")}: <strong>{m.hips_cm}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteId(m.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => { if (!open) setDeleteId(null); }}
        title={tc("delete")}
        description={t("deleteConfirm")}
        confirmLabel={tc("delete")}
        cancelLabel={tc("cancel")}
        isLoading={deleteMeasurement.isPending}
        onConfirm={() => {
          if (deleteId) {
            deleteMeasurement.mutate({ id: deleteId, clientId }, {
              onSuccess: () => setDeleteId(null),
            });
          }
        }}
      />
    </div>
  );
}
