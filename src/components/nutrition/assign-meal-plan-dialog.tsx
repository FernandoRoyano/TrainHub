"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useClients } from "@/hooks/use-clients";
import { useAssignMealPlan } from "@/hooks/use-nutrition";
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
import { Loader2 } from "lucide-react";

interface AssignMealPlanDialogProps {
  mealPlanId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignMealPlanDialog({
  mealPlanId,
  open,
  onOpenChange,
}: AssignMealPlanDialogProps) {
  const t = useTranslations("nutrition");
  const tc = useTranslations("common");
  const { data: clientsData } = useClients();
  const assignMealPlan = useAssignMealPlan();

  const [clientId, setClientId] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");

  const clients = clientsData?.data ?? [];

  const handleAssign = () => {
    if (!clientId || !startDate) return;
    assignMealPlan.mutate(
      {
        client_id: clientId,
        meal_plan_id: mealPlanId,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("assignToClient")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
                        <Badge variant="outline" className="text-[10px] px-1 py-0">
                          {client.status}
                        </Badge>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("startDate")}</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("notes")}</Label>
            <Textarea
              placeholder={t("assignNotesPlaceholder")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
            disabled={!clientId || assignMealPlan.isPending}
          >
            {assignMealPlan.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("assignToClient")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
