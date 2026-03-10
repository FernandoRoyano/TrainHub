"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useClients, useDeleteClient, useClientsActivity } from "@/hooks/use-clients";
import { useSubscription } from "@/hooks/use-subscription";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Search,
  UserPlus,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
  MessageCircle,
  ClipboardList,
  Eye,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  inactive: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  paused: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  pending: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

function getComplianceDotClass(
  workoutsThisWeek: number,
  assignedDaysPerWeek: number | null
): string {
  if (assignedDaysPerWeek == null || assignedDaysPerWeek === 0) {
    return "bg-muted-foreground/30";
  }
  const ratio = workoutsThisWeek / assignedDaysPerWeek;
  if (ratio >= 0.8) return "bg-emerald-400";
  if (ratio >= 0.4) return "bg-amber-400";
  return "bg-rose-400";
}

function getLastActiveText(
  lastWorkoutDate: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: string, values?: any) => string
): string {
  if (!lastWorkoutDate) return t("lastActiveNever");

  const now = new Date();
  const last = new Date(lastWorkoutDate);
  const diffMs = now.getTime() - last.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return t("lastActiveToday");
  return t("lastActiveDaysAgo", { days: diffDays });
}

export function ClientList() {
  const t = useTranslations("clients");
  const tc = useTranslations("common");
  const te = useTranslations("empty");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading } = useClients({
    search: debouncedSearch,
    status,
  });
  const deleteClient = useDeleteClient();
  const { data: sub } = useSubscription();

  const clients = data?.data ?? [];

  const clientIds = useMemo(
    () => clients.map((c) => c.id),
    [clients]
  );

  const { data: activityMap } = useClientsActivity(clientIds);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        {sub?.canAddClient !== false ? (
          <Button asChild>
            <Link href="/clients/new">
              <UserPlus className="mr-2 h-4 w-4" />
              {t("addClient")}
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href="/settings">
              <UserPlus className="mr-2 h-4 w-4" />
              {t("addClient")}
            </Link>
          </Button>
        )}
      </div>

      {/* Subscription limit warning */}
      {sub && !sub.canAddClient && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <span className="text-muted-foreground">
            {t("clientLimit", { count: sub.activeClientCount, max: sub.clientLimit })}
            {" — "}
            <Link href="/settings" className="text-primary underline">
              {t("upgradeNeeded")}
            </Link>
          </span>
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={tc("search") + "..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={status} onValueChange={setStatus}>
          <TabsList>
            <TabsTrigger value="all">{tc("all")}</TabsTrigger>
            <TabsTrigger value="active">{tc("active")}</TabsTrigger>
            <TabsTrigger value="inactive">{tc("inactive")}</TabsTrigger>
            <TabsTrigger value="paused">{tc("paused")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Client List */}
      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : clients.length === 0 ? (
        <EmptyState
          icon={Users}
          emoji={"\uD83C\uDFCB\uFE0F"}
          title={te("clientsTitle")}
          description={te("clientsDescription")}
          actionLabel={t("addClient")}
          actionHref="/clients/new"
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => {
            const initials = client.full_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            const activity = activityMap?.[client.id];
            const complianceDotClass = getComplianceDotClass(
              activity?.workoutsThisWeek ?? 0,
              activity?.assignedDaysPerWeek ?? null
            );
            const lastActiveText = getLastActiveText(
              activity?.lastWorkoutDate ?? null,
              t
            );

            return (
              <Card
                key={client.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => router.push(`/clients/${client.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-block h-2 w-2 rounded-full shrink-0 ${complianceDotClass}`}
                        />
                        <p className="font-medium truncate">
                          {client.full_name}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {client.email || client.phone || "--"}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">
                        {lastActiveText}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={statusColors[client.status] || ""}
                    >
                      {tc(client.status as "active" | "inactive" | "paused" | "pending")}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/clients/${client.id}/edit`);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          {tc("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(client.id);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {tc("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {client.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {client.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {/* Quick action buttons */}
                  <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border/50">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={t("sendMessage")}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push("/messages");
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={t("assignRoutine")}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push("/routines");
                      }}
                    >
                      <ClipboardList className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={t("viewDetails")}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/clients/${client.id}`);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title={tc("delete")}
        description={t("deleteConfirm")}
        confirmLabel={tc("delete")}
        cancelLabel={tc("cancel")}
        isLoading={deleteClient.isPending}
        onConfirm={() => {
          if (deleteId) {
            deleteClient.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            });
          }
        }}
      />
    </div>
  );
}
