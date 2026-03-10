"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useUseTemplate } from "@/hooks/use-routines";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface UseTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: string;
  templateName: string;
}

export function UseTemplateDialog({
  open,
  onOpenChange,
  templateId,
  templateName,
}: UseTemplateDialogProps) {
  const t = useTranslations("templates");
  const router = useRouter();
  const [name, setName] = useState("");
  const useTemplate = useUseTemplate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const routineName = name.trim() || templateName;
    useTemplate.mutate(
      { id: templateId, name: routineName },
      {
        onSuccess: (routine) => {
          onOpenChange(false);
          setName("");
          router.push(`/routines/${routine.id}/edit`);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("useTemplate")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              {t("useTemplateDescription")}
            </p>
            <div className="space-y-2">
              <Label htmlFor="routine-name">{t("routineName")}</Label>
              <Input
                id="routine-name"
                placeholder={templateName}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={useTemplate.isPending}>
              {useTemplate.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("createRoutine")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
