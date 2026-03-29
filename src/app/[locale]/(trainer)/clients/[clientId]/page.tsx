"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useClient, useDeleteClient, useInviteClient, useGenerateInviteLink } from "@/hooks/use-clients";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { OverviewTab } from "@/components/clients/overview-tab";
import { SessionNotesTab } from "@/components/clients/session-notes-tab";
import { MeasurementsTab } from "@/components/clients/measurements-tab";
import { CheckinsTab } from "@/components/clients/checkins-tab";
import { WorkoutsTab } from "@/components/clients/workouts-tab";
import { ResetPasswordDialog } from "@/components/clients/reset-password-dialog";
import { ArrowLeft, Pencil, Trash2, Mail, Phone, Send, Link2, KeyRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  inactive: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  paused: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  pending: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function ClientDetailPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const t = useTranslations("clients");
  const tc = useTranslations("common");
  const router = useRouter();
  const { data: client, isLoading } = useClient(clientId);
  const deleteClient = useDeleteClient();
  const inviteClient = useInviteClient();
  const generateLink = useGenerateInviteLink();
  const [showDelete, setShowDelete] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!client) {
    return <p className="text-muted-foreground">Client not found</p>;
  }

  const profileData = (client.profile_data ?? {}) as Record<string, unknown>;
  const initials = client.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="shrink-0" asChild>
          <Link href="/clients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold truncate">{t("clientDetail")}</h1>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        <CardContent className="pt-6 overflow-hidden">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16 shrink-0">
                <AvatarFallback className="text-base sm:text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold truncate">{client.full_name}</h2>
                  <Badge variant="outline" className={statusColors[client.status] || ""}>
                    {tc(client.status as "active" | "inactive" | "paused" | "pending")}
                  </Badge>
                </div>
                <div className="flex flex-col gap-0.5 mt-1 text-sm text-muted-foreground">
                  {client.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3 shrink-0" /> <span className="truncate text-xs">{client.email}</span>
                    </span>
                  )}
                  {client.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3 shrink-0" /> <span className="text-xs">{client.phone}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            {client.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {client.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex gap-2 flex-wrap w-full">
              {client.email && !client.user_id && (
                <Button
                  size="sm"
                  className="flex-1 sm:flex-none"
                  onClick={() => inviteClient.mutate(client.id)}
                  disabled={inviteClient.isPending}
                >
                  <Send className="mr-1 h-3.5 w-3.5" />
                  {t("invite")}
                </Button>
              )}
              {!client.user_id && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={() => generateLink.mutate(client.id)}
                  disabled={generateLink.isPending}
                >
                  <Link2 className="mr-1 h-3.5 w-3.5" />
                  {t("copyInviteLink")}
                </Button>
              )}
              {client.user_id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResetPassword(true)}
                >
                  <KeyRound className="mr-1 h-3.5 w-3.5" />
                  <span className="text-xs">{t("resetPassword")}</span>
                </Button>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href={`/clients/${client.id}/edit`}>
                  <Pencil className="mr-1 h-3.5 w-3.5" />
                  <span className="text-xs">{tc("edit")}</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => setShowDelete(true)}
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                <span className="text-xs">{tc("delete")}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto scrollbar-thin pb-1">
          <TabsList className="inline-flex w-max">
            <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
            <TabsTrigger value="physical">{t("physicalData")}</TabsTrigger>
            <TabsTrigger value="notes">{t("notes")}</TabsTrigger>
            <TabsTrigger value="workouts">{t("workoutsTab")}</TabsTrigger>
            <TabsTrigger value="session-notes">{t("sessionNotes")}</TabsTrigger>
            <TabsTrigger value="measurements">{t("measurements")}</TabsTrigger>
            <TabsTrigger value="checkins">{t("checkins")}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <OverviewTab clientId={client.id} onTabChange={setActiveTab} />
        </TabsContent>

        <TabsContent value="physical">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {"weight" in profileData && profileData.weight != null && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t("weight")}</p>
                    <p className="text-lg font-semibold">{String(profileData.weight)} kg</p>
                  </div>
                )}
                {"height" in profileData && profileData.height != null && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t("height")}</p>
                    <p className="text-lg font-semibold">{String(profileData.height)} cm</p>
                  </div>
                )}
                {"birth_date" in profileData && profileData.birth_date != null && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t("birthDate")}</p>
                    <p className="text-lg font-semibold">{String(profileData.birth_date)}</p>
                  </div>
                )}
              </div>
              {"goals" in profileData && profileData.goals != null && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">{t("goals")}</p>
                  <p className="mt-1">{String(profileData.goals)}</p>
                </div>
              )}
              {"injuries" in profileData && profileData.injuries != null && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">{t("injuries")}</p>
                  <p className="mt-1">{String(profileData.injuries)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardContent className="pt-6">
              <p className="whitespace-pre-wrap">
                {client.notes || <span className="text-muted-foreground">{t("noNotes")}</span>}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workouts">
          <WorkoutsTab clientId={client.id} />
        </TabsContent>

        <TabsContent value="session-notes">
          <SessionNotesTab clientId={client.id} />
        </TabsContent>

        <TabsContent value="measurements">
          <MeasurementsTab clientId={client.id} />
        </TabsContent>

        <TabsContent value="checkins">
          <CheckinsTab clientId={client.id} />
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title={tc("delete")}
        description={t("deleteConfirm")}
        confirmLabel={tc("delete")}
        cancelLabel={tc("cancel")}
        isLoading={deleteClient.isPending}
        onConfirm={() => {
          deleteClient.mutate(client.id, {
            onSuccess: () => router.push("/clients"),
          });
        }}
      />

      {client.user_id && (
        <ResetPasswordDialog
          open={showResetPassword}
          onOpenChange={setShowResetPassword}
          clientId={client.id}
          clientName={client.full_name}
        />
      )}
    </div>
  );
}
