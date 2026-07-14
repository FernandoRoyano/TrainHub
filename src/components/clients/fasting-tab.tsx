"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Timer, Check, X, Flame, TrendingUp } from "lucide-react";

interface FastingTabProps {
  clientId: string;
}

const protocolLabels: Record<string, string> = {
  "16_8": "16:8",
  "18_6": "18:6",
  "20_4": "20:4",
  "23_1": "OMAD",
  "custom": "Personalizado",
};

export function FastingTab({ clientId }: FastingTabProps) {
  const t = useTranslations("fasting");

  const { data: logs, isLoading } = useQuery({
    queryKey: ["client-fasting", clientId],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("fasting_logs")
        .select("*")
        .eq("client_id", clientId)
        .order("fast_start", { ascending: false })
        .limit(20);
      return data ?? [];
    },
    enabled: !!clientId,
  });

  const { data: settings } = useQuery({
    queryKey: ["client-fasting-settings", clientId],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("fasting_settings")
        .select("*")
        .eq("client_id", clientId)
        .maybeSingle();
      return data;
    },
    enabled: !!clientId,
  });

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  const completedCount = logs?.filter((l) => l.completed).length ?? 0;
  const totalCount = logs?.length ?? 0;
  const avgHours = totalCount > 0
    ? (logs!.filter((l) => l.actual_hours).reduce((sum, l) => sum + (l.actual_hours || 0), 0) / (logs!.filter((l) => l.actual_hours).length || 1)).toFixed(1)
    : "0";

  return (
    <div className="space-y-4">
      {/* Settings */}
      {settings && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Timer className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Protocolo: {protocolLabels[settings.default_protocol] || settings.default_protocol}</p>
                {settings.custom_hours && <p className="text-xs text-muted-foreground">{settings.custom_hours}h de ayuno</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Flame className="h-5 w-5 mx-auto mb-1 text-warning" />
            <p className="text-xl font-bold">{totalCount}</p>
            <p className="text-[10px] text-muted-foreground">{t("totalFasts")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-info" />
            <p className="text-xl font-bold">{avgHours}h</p>
            <p className="text-[10px] text-muted-foreground">{t("avgDuration")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Check className="h-5 w-5 mx-auto mb-1 text-success" />
            <p className="text-xl font-bold">{totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%</p>
            <p className="text-[10px] text-muted-foreground">{t("completionRate")}</p>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t("history")}</CardTitle>
        </CardHeader>
        <CardContent>
          {!logs || logs.length === 0 ? (
            <EmptyState icon={Timer} title={t("noHistory")} />
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(log.fast_start).toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {protocolLabels[log.protocol]} · {log.actual_hours ? `${log.actual_hours}h` : "En curso"}
                    </p>
                  </div>
                  <Badge variant={log.completed ? "default" : "secondary"} className="text-xs">
                    {log.completed ? <Check className="mr-1 h-3 w-3" /> : <X className="mr-1 h-3 w-3" />}
                    {log.completed ? t("completed") : t("cancelled")}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
