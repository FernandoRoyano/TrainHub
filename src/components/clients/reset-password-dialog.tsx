"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
  clientId,
  clientName,
}: ResetPasswordDialogProps) {
  const t = useTranslations("clients");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      toast.error(t("passwordMinLength"));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("passwordsMismatch"));
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/reset-client-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, newPassword: password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error");
      }

      toast.success(t("passwordResetSuccess"));
      setPassword("");
      setConfirmPassword("");
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : t("passwordResetError");
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("resetClientPassword")}</DialogTitle>
          <DialogDescription>
            {t("resetClientPasswordDesc", { name: clientName })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("newPassword")}</Label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label>{t("confirmNewPassword")}</Label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="******"
              autoComplete="new-password"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isLoading || !password}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("updatePassword")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
