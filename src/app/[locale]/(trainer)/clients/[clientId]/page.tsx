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
import { PlanTab } from "@/components/clients/plan-tab";
import { StatsTab } from "@/components/clients/stats-tab";
import { TrackingTab } from "@/components/clients/tracking-tab";
import { HistoryTab } from "@/components/clients/history-tab";
import { PaymentsTab } from "@/components/clients/payments-tab";
import { FastingTab } from "@/components/clients/fasting-tab";
import { CycleTab } from "@/components/clients/cycle-tab";
import { ResetPasswordDialog } from "@/components/clients/reset-password-dialog";
import { ArrowLeft, Pencil, Trash2, Mail, Phone, Send, Link2, KeyRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { STATUS_STYLES } from "@/lib/ui-tokens";

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
  const [activeTab, setActiveTab] = useState("plan");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!client) {
    return <p className="text-muted-foreground">{tc("notFound")}</p>;
  }

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
                  <Badge variant="outline" className={STATUS_STYLES[client.status] || ""}>
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
            <TabsTrigger value="plan">{t("planTab")}</TabsTrigger>
            <TabsTrigger value="stats">{t("statsTab")}</TabsTrigger>
            <TabsTrigger value="tracking">{t("trackingTab")}</TabsTrigger>
            <TabsTrigger value="historico">{t("historicoTab")}</TabsTrigger>
            <TabsTrigger value="payments">{t("paymentsTab")}</TabsTrigger>
            <TabsTrigger value="fasting">{t("fastingTab")}</TabsTrigger>
            {client.gender === "female" && (
              <TabsTrigger value="cycle">{t("cycleTab")}</TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="plan">
          <PlanTab clientId={client.id} />
        </TabsContent>

        <TabsContent value="stats">
          <StatsTab clientId={client.id} />
        </TabsContent>

        <TabsContent value="tracking">
          <TrackingTab clientId={client.id} />
        </TabsContent>

        <TabsContent value="historico">
          <HistoryTab clientId={client.id} />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsTab clientId={client.id} />
        </TabsContent>

        <TabsContent value="fasting">
          <FastingTab clientId={client.id} />
        </TabsContent>

        {client.gender === "female" && (
          <TabsContent value="cycle">
            <CycleTab clientId={client.id} />
          </TabsContent>
        )}
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
