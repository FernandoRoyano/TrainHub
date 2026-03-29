"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useClients } from "@/hooks/use-clients";
import { useAssignRoutine, useRoutine } from "@/hooks/use-routines";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, CalendarCheck } from "lucide-react";

interface AssignRoutineDialogProps {
  routineId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignRoutineDialog({
  routineId,
  open,
  onOpenChange,
}: AssignRoutineDialogProps) {
  const t = useTranslations("routines");
  const tc = useTranslations("common");
  const { data: clientsData } = useClients();
  const { data: routine } = useRoutine(routineId);
  const assignRoutine = useAssignRoutine();

  const [clientId, setClientId] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reviewDate, setReviewDate] = useState("");

  const clients = clientsData?.data ?? [];
  const durationWeeks = routine?.duration_weeks ?? 4;

  const endDate = useMemo(() => {
    if (!startDate) return "";
    const start = new Date(startDate);
    start.setDate(start.getDate() + durationWeeks * 7);
    return start.toISOString().split("T")[0];
  }, [startDate, durationWeeks]);

  const handleAssign = () => {
    if (!clientId || !startDate) return;
    assignRoutine.mutate(
      {
        client_id: clientId,
        routine_id: routineId,
        start_date: startDate,
        notes: reviewDate ? `review_date:${reviewDate}|end_date:${endDate}` : `end_date:${endDate}`,
      },
      {
        onSuccess: async () => {
          // Update end_date and review_date via API
          const res = await fetch("/api/update-routine-dates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              routineId,
              clientId,
              endDate,
              reviewDate: reviewDate || null,
            }),
          });
          if (!res.ok) console.error("Failed to set dates");
          onOpenChange(false);
          setClientId("");
          setReviewDate("");
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

          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              {t("durationInfo", { weeks: durationWeeks })}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <CalendarCheck className="h-3.5 w-3.5" />
              {t("reviewDate")}
            </Label>
            <Input
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              min={startDate}
            />
            <p className="text-xs text-muted-foreground">{t("reviewDateHint")}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tc("cancel")}
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!clientId || assignRoutine.isPending}
          >
            {assignRoutine.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("assignToClient")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
