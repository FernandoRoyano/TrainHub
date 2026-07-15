"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useClients, useDeleteClient, useUpdateClient, useClientsActivity } from "@/hooks/use-clients";
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
  UserX,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";
import { STATUS_STYLES } from "@/lib/ui-tokens";

function getComplianceDotClass(
  workoutsThisWeek: number,
  assignedDaysPerWeek: number | null
): string {
  if (assignedDaysPerWeek == null || assignedDaysPerWeek === 0) {
    return "bg-muted-foreground/30";
  }
  const ratio = workoutsThisWeek / assignedDaysPerWeek;
  if (ratio >= 0.8) return "bg-success";
  if (ratio >= 0.4) return "bg-warning";
  return "bg-destructive";
}

// Días desde el último acceso REAL del cliente (heartbeat). null = nunca entró.
function daysSinceAccess(lastConnection: string | null): number | null {
  if (!lastConnection) return null;
  return Math.floor((Date.now() - new Date(lastConnection).getTime()) / 86400000);
}

// Umbral de "lleva varios días parado sin entrar"
const INACTIVE_THRESHOLD_DAYS = 7;

function getAccessText(
  lastConnection: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: string, values?: any) => string
): string {
  const days = daysSinceAccess(lastConnection);
  if (days === null) return `${t("lastAccessLabel")}: ${t("lastAccessNever")}`;
  const rel =
    days === 0 ? t("lastAccessToday")
    : days === 1 ? t("lastAccessYesterday")
    : t("lastAccessDaysAgo", { days });
  return `${t("lastAccessLabel")}: ${rel}`;
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
  const updateClient = useUpdateClient();
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
        <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
        <div className="flex gap-2">
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
      </div>

      {/* Subscription limit warning */}
      {sub && !sub.canAddClient && (
        <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
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
            // Último acceso REAL (heartbeat), NO la fecha de creación
            const accessText = getAccessText(activity?.lastConnection ?? null, t);
            const inactiveDays = daysSinceAccess(activity?.lastConnection ?? null);
            // Aviso solo para clientes activos que llevan varios días sin entrar
            const isInactive =
              client.status === "active" &&
              (inactiveDays === null || inactiveDays >= INACTIVE_THRESHOLD_DAYS);

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
                        {accessText}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant="outline"
                        className={STATUS_STYLES[client.status] || ""}
                      >
                        {tc(client.status as "active" | "inactive" | "paused" | "pending")}
                      </Badge>
                      {isInactive && (
                        <Badge variant="warning" className="gap-1 text-[10px]">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          {inactiveDays === null
                            ? t("neverEntered")
                            : t("inactiveDays", { days: inactiveDays })}
                        </Badge>
                      )}
                    </div>
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
                        {client.status === "active" ? (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              updateClient.mutate({ id: client.id, data: { full_name: client.full_name, email: client.email || "", status: "inactive", tags: client.tags, phone: client.phone || "" } });
                            }}
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            {t("deactivate")}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              updateClient.mutate({ id: client.id, data: { full_name: client.full_name, email: client.email || "", status: "active", tags: client.tags, phone: client.phone || "" } });
                            }}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            {t("reactivate")}
                          </DropdownMenuItem>
                        )}
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
