"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useClients } from "@/hooks/use-clients";
import { useAssignCoachingPlan, useCoachingPlan } from "@/hooks/use-coaching-plans";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Calendar,
  Dumbbell,
  UtensilsCrossed,
  Shield,
  FileQuestion,
  CheckCircle,
} from "lucide-react";

interface AssignCoachingPlanDialogProps {
  planId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignCoachingPlanDialog({
  planId,
  open,
  onOpenChange,
}: AssignCoachingPlanDialogProps) {
  const t = useTranslations("coachingPlans");
  const tc = useTranslations("common");
  const { data: clientsData } = useClients();
  const { data: plan } = useCoachingPlan(planId);
  const assignPlan = useAssignCoachingPlan();

  const [clientId, setClientId] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");

  const clients = clientsData?.data ?? [];
  const durationWeeks = plan?.duration_weeks ?? 4;

  const endDate = useMemo(() => {
    if (!startDate) return "";
    const start = new Date(startDate);
    start.setDate(start.getDate() + durationWeeks * 7);
    return start.toISOString().split("T")[0];
  }, [startDate, durationWeeks]);

  const handleAssign = () => {
    if (!clientId || !startDate) return;
    assignPlan.mutate(
      {
        client_id: clientId,
        coaching_plan_id: planId,
        start_date: startDate,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setClientId("");
          setNotes("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("assignPlan")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Client selector */}
          <div className="space-y-2">
            <Label>{t("selectClient")}</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectClient")} />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <span className="flex items-center gap-2">
                      {client.full_name}
                      {client.status !== "active" && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1 py-0"
                        >
                          {client.status}
                        </Badge>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {t("startDate")}
              </Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {t("endDate")}
              </Label>
              <Input
                type="date"
                value={endDate}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          {/* Preview: what will be created */}
          {plan && (
            <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
              <p className="text-sm font-medium">{t("assignPreview")}</p>
              <div className="space-y-1.5">
                {plan.routine_template && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    <Dumbbell className="h-3 w-3" />
                    <span>
                      {t("willAssignRoutine")}: {plan.routine_template.name}
                    </span>
                  </div>
                )}
                {plan.meal_plan_template && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    <UtensilsCrossed className="h-3 w-3" />
                    <span>
                      {t("willAssignMealPlan")}: {plan.meal_plan_template.name}
                    </span>
                  </div>
                )}
                {plan.service_tier && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    <Shield className="h-3 w-3" />
                    <span>
                      {t("willAssignTier")}: {plan.service_tier.name}
                    </span>
                  </div>
                )}
                {plan.questionnaire_template_ids &&
                  plan.questionnaire_template_ids.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                      <FileQuestion className="h-3 w-3" />
                      <span>
                        {t("willAssignQuestionnaires", {
                          count: plan.questionnaire_template_ids.length,
                        })}
                      </span>
                    </div>
                  )}
                {!plan.routine_template &&
                  !plan.meal_plan_template &&
                  !plan.service_tier &&
                  (!plan.questionnaire_template_ids ||
                    plan.questionnaire_template_ids.length === 0) && (
                    <p className="text-xs text-muted-foreground italic">
                      {t("noLinkedResources")}
                    </p>
                  )}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>{t("notes")}</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("assignNotesPlaceholder")}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tc("cancel")}
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!clientId || assignPlan.isPending}
          >
            {assignPlan.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("assignPlan")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
