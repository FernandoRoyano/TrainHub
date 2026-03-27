"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMyMeasurements, useAddMyMeasurement } from "@/hooks/use-client-app";
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
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Ruler, TrendingDown, Plus, Loader2 } from "lucide-react";

export default function MyMeasurementsPage() {
  const t = useTranslations("measurements");
  const tc = useTranslations("clientApp");
  const te = useTranslations("empty");
  const { data: measurements, isLoading } = useMyMeasurements();
  const addMeasurement = useAddMyMeasurement();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    weight: "",
    body_fat_pct: "",
    chest_cm: "",
    waist_cm: "",
    hips_cm: "",
    bicep_cm: "",
    thigh_cm: "",
    calf_cm: "",
    notes: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addMeasurement.mutate(
      {
        date: form.date,
        weight: form.weight ? parseFloat(form.weight) : null,
        body_fat_pct: form.body_fat_pct ? parseFloat(form.body_fat_pct) : null,
        chest_cm: form.chest_cm ? parseFloat(form.chest_cm) : null,
        waist_cm: form.waist_cm ? parseFloat(form.waist_cm) : null,
        hips_cm: form.hips_cm ? parseFloat(form.hips_cm) : null,
        bicep_cm: form.bicep_cm ? parseFloat(form.bicep_cm) : null,
        thigh_cm: form.thigh_cm ? parseFloat(form.thigh_cm) : null,
        calf_cm: form.calf_cm ? parseFloat(form.calf_cm) : null,
        notes: form.notes || null,
      },
      {
        onSuccess: () => {
          setShowForm(false);
          setForm({
            date: new Date().toISOString().split("T")[0],
            weight: "",
            body_fat_pct: "",
            chest_cm: "",
            waist_cm: "",
            hips_cm: "",
            bicep_cm: "",
            thigh_cm: "",
            calf_cm: "",
            notes: "",
          });
        },
      }
    );
  }

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{tc("myMeasurements")}</h1>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="mr-1 h-4 w-4" />
          {t("addMeasurement")}
        </Button>
      </div>

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
          title={te("measurementsTitle")}
          description={tc("addFirstMeasurement")}
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
                      <p className="font-semibold">{m.weight} kg</p>
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
                      <p className="font-semibold">{m.chest_cm} cm</p>
                    </div>
                  )}
                  {m.waist_cm != null && (
                    <div>
                      <span className="text-muted-foreground">{t("waist_cm")}</span>
                      <p className="font-semibold">{m.waist_cm} cm</p>
                    </div>
                  )}
                  {m.hips_cm != null && (
                    <div>
                      <span className="text-muted-foreground">{t("hips_cm")}</span>
                      <p className="font-semibold">{m.hips_cm} cm</p>
                    </div>
                  )}
                  {m.bicep_cm != null && (
                    <div>
                      <span className="text-muted-foreground">{t("bicep_cm")}</span>
                      <p className="font-semibold">{m.bicep_cm} cm</p>
                    </div>
                  )}
                  {m.thigh_cm != null && (
                    <div>
                      <span className="text-muted-foreground">{t("thigh_cm")}</span>
                      <p className="font-semibold">{m.thigh_cm} cm</p>
                    </div>
                  )}
                  {m.calf_cm != null && (
                    <div>
                      <span className="text-muted-foreground">{t("calf_cm")}</span>
                      <p className="font-semibold">{m.calf_cm} cm</p>
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

      {/* Add measurement dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("addMeasurement")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-medium">{t("date")}</label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">{t("weight")} (kg)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  placeholder="75.0"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">{t("body_fat_pct")} (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.body_fat_pct}
                  onChange={(e) => setForm({ ...form, body_fat_pct: e.target.value })}
                  placeholder="20.0"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">{t("chest_cm")} (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.chest_cm}
                  onChange={(e) => setForm({ ...form, chest_cm: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">{t("waist_cm")} (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.waist_cm}
                  onChange={(e) => setForm({ ...form, waist_cm: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">{t("hips_cm")} (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.hips_cm}
                  onChange={(e) => setForm({ ...form, hips_cm: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">{t("bicep_cm")} (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.bicep_cm}
                  onChange={(e) => setForm({ ...form, bicep_cm: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">{t("thigh_cm")} (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.thigh_cm}
                  onChange={(e) => setForm({ ...form, thigh_cm: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">{t("calf_cm")} (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.calf_cm}
                  onChange={(e) => setForm({ ...form, calf_cm: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{t("notes")}</label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                placeholder={t("notesPlaceholder")}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={addMeasurement.isPending} className="w-full">
                {addMeasurement.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
