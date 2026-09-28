"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/services/auth.service";
import { PASSWORD_REGEX } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { WeightUnitSelector } from "@/components/shared/weight-unit-selector";
import { toast } from "sonner";
import { User, Languages, Lock, Palette } from "lucide-react";
import { SubscriptionCard } from "@/components/settings/subscription-card";
import { DangerZoneCard } from "@/components/settings/danger-zone-card";
import { TrainerBrand } from "@/components/shared/trainer-brand";
import { TRAINER_BRAND_ACCENTS, type TrainerBrandAccent } from "@/lib/ui-tokens";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const { profile, isLoading } = useAuth();
  const queryClient = useQueryClient();

  const [profileForm, setProfileForm] = useState({
    full_name: "",
    bio: "",
    specialty: "",
    professional_name: "",
    welcome_message: "",
    brand_logo_url: "",
    brand_accent: "green" as TrainerBrandAccent,
  });
  const [saving, setSaving] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      const settings = (profile.settings ?? {}) as Record<string, unknown>;
      setProfileForm({
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        specialty: (settings.specialty as string) || "",
        professional_name: (settings.professional_name as string) || "",
        welcome_message: (settings.welcome_message as string) || "",
        brand_logo_url: (settings.brand_logo_url as string) || "",
        brand_accent:
          typeof settings.brand_accent === "string" && settings.brand_accent in TRAINER_BRAND_ACCENTS
            ? (settings.brand_accent as TrainerBrandAccent)
            : "green",
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await authService.updateProfile({
        full_name: profileForm.full_name,
        bio: profileForm.bio || undefined,
      });
      // Save specialty in settings JSONB
      const currentSettings = (profile?.settings ?? {}) as Record<string, unknown>;
      await authService.updateSettings({
        ...currentSettings,
        specialty: profileForm.specialty || null,
        professional_name: profileForm.professional_name || null,
        welcome_message: profileForm.welcome_message || null,
        brand_logo_url: profileForm.brand_logo_url || null,
        brand_accent: profileForm.brand_accent,
      });
      queryClient.invalidateQueries({ queryKey: ["auth-profile"] });
      toast.success(t("saved"));
    } catch {
      toast.error(tc("errorDescription"));
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }
    if (!PASSWORD_REGEX.test(passwordForm.newPassword)) {
      toast.error(t("passwordTooShort"));
      return;
    }
    setSavingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });
      if (error) throw error;
      setPasswordForm({ newPassword: "", confirmPassword: "" });
      toast.success(t("passwordChanged"));
    } catch {
      toast.error(tc("errorDescription"));
    } finally {
      setSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display text-2xl font-bold">{t("title")}</h1>

      {/* Subscription */}
      <SubscriptionCard />

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            {t("profile")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>{t("fullName")}</Label>
            <Input
              value={profileForm.full_name}
              onChange={(e) =>
                setProfileForm((f) => ({ ...f, full_name: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label>{t("email")}</Label>
            <Input value={profile?.email ?? ""} disabled />
          </div>
          <div className="space-y-1">
            <Label>{t("specialty")}</Label>
            <Input
              value={profileForm.specialty}
              onChange={(e) =>
                setProfileForm((f) => ({ ...f, specialty: e.target.value }))
              }
              placeholder={t("specialtyPlaceholder")}
            />
          </div>
          <div className="space-y-1">
            <Label>{t("bio")}</Label>
            <Textarea
              value={profileForm.bio}
              onChange={(e) =>
                setProfileForm((f) => ({ ...f, bio: e.target.value }))
              }
              rows={3}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving ? tc("loading") : tc("save")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-primary/5 via-card to-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="h-4 w-4" />
            {t("clientBrand")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t("clientBrandDescription")}</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-2xl border border-border/60 bg-background/55 p-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{t("preview")}</p>
            <TrainerBrand
              trainerName={profile?.full_name}
              avatarUrl={profile?.avatar_url}
              settings={{ professional_name: profileForm.professional_name, brand_logo_url: profileForm.brand_logo_url, brand_accent: profileForm.brand_accent }}
              signature={t("poweredByTrainHub")}
            />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {profileForm.welcome_message || t("welcomeMessagePreview")}
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>{t("professionalName")}</Label>
            <Input value={profileForm.professional_name} onChange={(e) => setProfileForm((form) => ({ ...form, professional_name: e.target.value }))} placeholder={profile?.full_name || t("professionalNamePlaceholder")} maxLength={60} />
          </div>
          <div className="space-y-1.5">
            <Label>{t("welcomeMessage")}</Label>
            <Textarea value={profileForm.welcome_message} onChange={(e) => setProfileForm((form) => ({ ...form, welcome_message: e.target.value }))} placeholder={t("welcomeMessagePlaceholder")} rows={3} maxLength={180} />
          </div>
          <div className="space-y-1.5">
            <Label>{t("logoUrl")}</Label>
            <Input type="url" value={profileForm.brand_logo_url} onChange={(e) => setProfileForm((form) => ({ ...form, brand_logo_url: e.target.value }))} placeholder="https://..." />
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">{t("brandAccent")}</legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(TRAINER_BRAND_ACCENTS) as TrainerBrandAccent[]).map((accent) => (
                <button key={accent} type="button" onClick={() => setProfileForm((form) => ({ ...form, brand_accent: accent }))} className="grid h-10 w-10 place-items-center rounded-xl border transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" style={{ borderColor: profileForm.brand_accent === accent ? `hsl(${TRAINER_BRAND_ACCENTS[accent]})` : "hsl(var(--border))" }} aria-label={t(`accent_${accent}`)} aria-pressed={profileForm.brand_accent === accent}>
                  <span className="h-5 w-5 rounded-full" style={{ background: `hsl(${TRAINER_BRAND_ACCENTS[accent]})` }} />
                </button>
              ))}
            </div>
          </fieldset>
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} disabled={saving}>{saving ? tc("loading") : tc("save")}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Languages className="h-4 w-4" />
            {t("language")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t("languageDescription")}
            </p>
            <LocaleSwitcher />
          </div>
        </CardContent>
      </Card>

      {/* Weight unit */}
      <WeightUnitSelector />

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4" />
            {t("changePassword")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>{t("newPassword")}</Label>
            <Input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label>{t("confirmNewPassword")}</Label>
            <Input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm((f) => ({
                  ...f,
                  confirmPassword: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleChangePassword}
              disabled={savingPassword || !passwordForm.newPassword}
            >
              {savingPassword ? tc("loading") : t("changePassword")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      {profile?.email && <DangerZoneCard email={profile.email} />}
    </div>
  );
}
