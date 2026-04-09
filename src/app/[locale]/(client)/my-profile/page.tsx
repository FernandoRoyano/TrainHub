"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Globe, Loader2, Pencil, Check, X } from "lucide-react";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { TextSizeSelector } from "@/components/shared/text-size-selector";

export default function MyProfilePage() {
  const t = useTranslations("clientApp");
  const ta = useTranslations("auth");
  const { profile, isLoading, signOut, isSigningOut } = useAuth();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");

  const updateProfile = useMutation({
    mutationFn: (data: { full_name: string }) =>
      authService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-profile"] });
      toast.success(t("profileUpdated"));
      setEditing(false);
    },
    onError: () => {
      toast.error(t("profileUpdateError"));
    },
  });

  const startEditing = () => {
    setFullName(profile?.full_name || "");
    setEditing(true);
  };

  const handleSave = () => {
    if (!fullName.trim()) return;
    updateProfile.mutate({ full_name: fullName.trim() });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("myProfile")}</h1>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {editing ? (
                <div className="space-y-2">
                  <Label>{t("fullName")}</Label>
                  <div className="flex gap-2">
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      autoFocus
                    />
                    <Button
                      size="icon"
                      onClick={handleSave}
                      disabled={updateProfile.isPending || !fullName.trim()}
                    >
                      {updateProfile.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditing(false)}
                      disabled={updateProfile.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-lg font-semibold">
                      {profile?.full_name || "-"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.email || "-"}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {profile?.role || "client"}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto"
                    onClick={startEditing}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {t("changeLanguage")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LocaleSwitcher />
        </CardContent>
      </Card>

      <TextSizeSelector />

      <Button
        variant="outline"
        className="w-full"
        onClick={() => signOut()}
        disabled={isSigningOut}
      >
        {isSigningOut ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="mr-2 h-4 w-4" />
        )}
        {ta("logout")}
      </Button>
    </div>
  );
}
