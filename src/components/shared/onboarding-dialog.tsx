"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/services/auth.service";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Dumbbell } from "lucide-react";

export function OnboardingDialog() {
  const t = useTranslations("onboarding");
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    bio: "",
    specialty: "",
  });

  const settings = (profile?.settings ?? {}) as Record<string, unknown>;
  const isOpen = !!profile && profile.role === "trainer" && !settings.onboarding_completed;

  const handleComplete = async () => {
    setSaving(true);
    try {
      await authService.updateProfile({
        full_name: form.full_name || profile?.full_name || "",
        bio: form.bio || undefined,
      });
      // Mark onboarding as done
      const currentSettings = (profile?.settings ?? {}) as Record<string, unknown>;
      await authService.updateSettings({
        ...currentSettings,
        onboarding_completed: true,
        specialty: form.specialty,
      });
      queryClient.invalidateQueries({ queryKey: ["auth-profile"] });
      toast.success(t("completed"));
    } catch {
      toast.error(t("error"));
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            <DialogTitle>{t("title")}</DialogTitle>
          </div>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        {step === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("yourName")}</Label>
              <Input
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                placeholder={profile?.full_name || ""}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("specialty")}</Label>
              <Input
                value={form.specialty}
                onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
                placeholder={t("specialtyPlaceholder")}
              />
            </div>
            <Button className="w-full" onClick={() => setStep(1)}>
              {t("next")}
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("bio")}</Label>
              <Textarea
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                placeholder={t("bioPlaceholder")}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(0)} className="flex-1">
                {t("back")}
              </Button>
              <Button
                onClick={handleComplete}
                disabled={saving}
                className="flex-1"
              >
                {saving ? t("saving") : t("finish")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
