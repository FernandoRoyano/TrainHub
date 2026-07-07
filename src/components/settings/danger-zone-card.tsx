"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface DangerZoneCardProps {
  email: string;
}

export function DangerZoneCard({ email }: DangerZoneCardProps) {
  const t = useTranslations("settings");
  const router = useRouter();
  const [confirmEmail, setConfirmEmail] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const emailMatches =
    confirmEmail.trim().toLowerCase() === email.toLowerCase();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmEmail }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Delete failed");
      }
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch {
      toast.error(t("deleteAccountError"));
      setDeleting(false);
      setDialogOpen(false);
    }
  };

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {t("dangerZone")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t("deleteAccountDescription")}
        </p>
        <div className="space-y-1">
          <Label>{t("deleteAccountConfirmLabel", { email })}</Label>
          <Input
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder={email}
            autoComplete="off"
          />
        </div>
        <div className="flex justify-end">
          <Button
            variant="destructive"
            disabled={!emailMatches || deleting}
            onClick={() => setDialogOpen(true)}
          >
            {t("deleteAccount")}
          </Button>
        </div>
        <ConfirmDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={t("deleteAccount")}
          description={t("deleteAccountWarning")}
          onConfirm={handleDelete}
          isLoading={deleting}
          variant="destructive"
        />
      </CardContent>
    </Card>
  );
}
