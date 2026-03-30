"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useClients } from "@/hooks/use-clients";
import { useAssignQuestionnaire } from "@/hooks/use-questionnaires";
import type { QuestionnaireTemplate } from "@/services/questionnaires.service";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface AssignQuestionnaireDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: QuestionnaireTemplate | null;
}

export function AssignQuestionnaireDialog({
  open,
  onOpenChange,
  template,
}: AssignQuestionnaireDialogProps) {
  const t = useTranslations("questionnaires");
  const tc = useTranslations("common");

  const { data: clientsData } = useClients();
  const assign = useAssignQuestionnaire();

  const [clientId, setClientId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const clients = clientsData?.data ?? clientsData ?? [];

  function handleSubmit() {
    if (!template || !clientId) return;
    assign.mutate(
      {
        template_id: template.id,
        client_id: clientId,
        due_date: dueDate || undefined,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          setClientId("");
          setDueDate("");
          setNotes("");
          onOpenChange(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("assignToClient")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Client selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("selectClient")}</label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectClient")} />
              </SelectTrigger>
              <SelectContent>
                {(Array.isArray(clients) ? clients : []).map(
                  (client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.full_name || client.email || client.id}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Due date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("dueDate")}</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{t("dueDateHint")}</p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("notes")}</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder={t("notes")}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={assign.isPending}
          >
            {tc("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!clientId || assign.isPending}
          >
            {assign.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("assignToClient")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
