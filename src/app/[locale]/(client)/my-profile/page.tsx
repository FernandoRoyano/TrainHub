"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Globe, Loader2 } from "lucide-react";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";

export default function MyProfilePage() {
  const t = useTranslations("clientApp");
  const ta = useTranslations("auth");
  const { profile, isLoading, signOut, isSigningOut } = useAuth();

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
            <div>
              <p className="text-lg font-semibold">{profile?.full_name || "-"}</p>
              <p className="text-sm text-muted-foreground">{profile?.email || "-"}</p>
              <Badge variant="secondary" className="mt-1">
                {profile?.role || "client"}
              </Badge>
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
