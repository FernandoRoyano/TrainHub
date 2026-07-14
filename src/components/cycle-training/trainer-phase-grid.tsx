"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Shield } from "lucide-react";
import type { CyclePhase } from "@/services/menstrual.service";

interface ClientPhaseInfo {
  id: string;
  full_name: string;
  phase: CyclePhase | null;
  cycleDay: number | null;
  energy: number | null;
  anonymous: boolean;
}

const phaseColors: Record<string, string> = {
  menstrual: "bg-destructive",
  follicular: "bg-chart-5",
  ovulation: "bg-chart-3",
  luteal: "bg-chart-2",
};

const phaseBorderColors: Record<string, string> = {
  menstrual: "border-destructive",
  follicular: "border-chart-5",
  ovulation: "border-chart-3",
  luteal: "border-blue-300",
};

function calculatePhase(settings: {
  last_period_start: string | null;
  average_cycle_length: number;
  average_period_length: number;
}): { phase: CyclePhase; cycleDay: number } | null {
  if (!settings.last_period_start) return null;
  const lastStart = new Date(settings.last_period_start);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - lastStart.getTime()) / 86400000);
  const cycleLen = settings.average_cycle_length || 28;
  const periodLen = settings.average_period_length || 5;
  const cycleDay = (diffDays % cycleLen) + 1;

  let phase: CyclePhase;
  if (cycleDay <= periodLen) phase = "menstrual";
  else if (cycleDay <= Math.floor(cycleLen * 0.5)) phase = "follicular";
  else if (cycleDay <= Math.floor(cycleLen * 0.5) + 2) phase = "ovulation";
  else phase = "luteal";

  return { phase, cycleDay };
}

export function TrainerPhaseGrid() {
  const t = useTranslations("cycleTraining");

  const { data: clients, isLoading } = useQuery({
    queryKey: ["trainer-phase-grid"],
    queryFn: async (): Promise<ClientPhaseInfo[]> => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get female clients
      const { data: femaleClients } = await supabase
        .from("clients")
        .select("id, full_name, gender")
        .eq("trainer_id", user.id)
        .eq("gender", "female")
        .eq("status", "active");

      if (!femaleClients?.length) return [];

      const clientIds = femaleClients.map((c) => c.id);

      // Get menstrual settings
      const { data: settings } = await supabase
        .from("menstrual_settings")
        .select("*")
        .in("client_id", clientIds);

      // Get privacy settings
      const { data: privacy } = await supabase
        .from("cycle_privacy_settings")
        .select("*")
        .in("client_id", clientIds);

      const settingsMap = new Map(settings?.map((s) => [s.client_id, s]) ?? []);
      const privacyMap = new Map(privacy?.map((p) => [p.client_id, p]) ?? []);

      return femaleClients.map((client) => {
        const ms = settingsMap.get(client.id);
        const ps = privacyMap.get(client.id);

        if (ps?.anonymous_mode) {
          return {
            id: client.id,
            full_name: client.full_name,
            phase: null,
            cycleDay: null,
            energy: null,
            anonymous: true,
          };
        }

        if (!ms) {
          return {
            id: client.id,
            full_name: client.full_name,
            phase: null,
            cycleDay: null,
            energy: null,
            anonymous: false,
          };
        }

        const phaseInfo = calculatePhase(ms);
        const sharePhase = ps?.share_phase !== false;

        return {
          id: client.id,
          full_name: client.full_name,
          phase: sharePhase ? (phaseInfo?.phase ?? null) : null,
          cycleDay: sharePhase ? (phaseInfo?.cycleDay ?? null) : null,
          energy: null,
          anonymous: false,
        };
      });
    },
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!clients?.length) return null;

  // Group by phase
  const phaseGroups: Record<string, ClientPhaseInfo[]> = {
    menstrual: [],
    follicular: [],
    ovulation: [],
    luteal: [],
    unknown: [],
  };
  for (const client of clients) {
    const key = client.phase ?? "unknown";
    phaseGroups[key].push(client);
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Heart className="h-4 w-4 text-chart-5" />
          {t("phaseGrid")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(["menstrual", "follicular", "ovulation", "luteal"] as CyclePhase[]).map((phase) => (
            <div key={phase} className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${phaseColors[phase]}`} />
                <span className="text-xs font-medium">{t(`phase.${phase}`)}</span>
                <Badge variant="secondary" className="text-[9px] h-4 px-1">
                  {phaseGroups[phase].length}
                </Badge>
              </div>
              <div className="space-y-1">
                {phaseGroups[phase].map((client) => (
                  <div
                    key={client.id}
                    className={`flex items-center gap-1.5 p-1.5 rounded border ${phaseBorderColors[phase]} bg-card`}
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[9px]">
                        {client.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium truncate">{client.full_name}</p>
                      {client.cycleDay && (
                        <p className="text-[9px] text-muted-foreground">
                          {t("day")} {client.cycleDay}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {phaseGroups[phase].length === 0 && (
                  <p className="text-[10px] text-muted-foreground italic p-1.5">—</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Anonymous clients */}
        {phaseGroups.unknown.length > 0 && (
          <div className="mt-3 pt-2 border-t">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Shield className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">{t("privateOrNotTracking")}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {phaseGroups.unknown.map((client) => (
                <Badge key={client.id} variant="outline" className="text-[10px]">
                  {client.full_name}
                  {client.anonymous && " 🔒"}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
