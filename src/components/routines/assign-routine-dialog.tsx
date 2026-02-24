"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useClients } from "@/hooks/use-clients";
import { useAssignRoutine } from "@/hooks/use-routines";
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
import { Loader2 } from "lucide-react";

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
  const assignRoutine = useAssignRoutine();

  const [clientId, setClientId] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const clients = clientsData?.data ?? [];

  const handleAssign = () => {
    if (!clientId || !startDate) return;
    assignRoutine.mutate(
      {
        client_id: clientId,
        routine_id: routineId,
        start_date: startDate,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setClientId("");
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
