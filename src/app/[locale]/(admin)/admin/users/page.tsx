"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAdminUsers, useUpdateUserRole, useDeleteUser } from "@/hooks/use-admin";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  Search,
  MoreVertical,
  Shield,
  UserCog,
  User,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { STATUS_STYLES } from "@/lib/ui-tokens";

const roleColors: Record<string, string> = {
  admin: "bg-primary/10 text-primary border-primary/20",
  trainer: STATUS_STYLES.trainer,
  client: STATUS_STYLES.client,
};

const roleIcons: Record<string, typeof Shield> = {
  admin: Shield,
  trainer: UserCog,
  client: User,
};

export default function AdminUsersPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const tc = useTranslations("common");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(0);
  const [roleChange, setRoleChange] = useState<{
    userId: string;
    name: string;
    newRole: string;
  } | null>(null);
  const [userToDelete, setUserToDelete] = useState<{
    userId: string;
    name: string;
  } | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading } = useAdminUsers({
    search: debouncedSearch,
    role: roleFilter,
    page,
  });
  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();

  const users = data?.users ?? [];
  const totalCount = data?.count ?? 0;
  const pageSize = 20;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">{t("usersTitle")}</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={tc("search") + "..."}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(v) => {
            setRoleFilter(v === "all" ? "" : v);
            setPage(0);
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("allRoles")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allRoles")}</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="trainer">Trainer</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {/* Header */}
              <div className="hidden md:grid grid-cols-[1fr_150px_120px_140px_48px] gap-4 px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                <span>{t("user")}</span>
                <span>{t("role")}</span>
                <span>{t("tier")}</span>
                <span>{t("joined")}</span>
                <span />
              </div>

              {users.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  {tc("noResults")}
                </div>
              ) : (
                users.map((user) => {
                  const RoleIcon = roleIcons[user.role] || User;
                  return (
                    <div
                      key={user.id}
                      className="grid grid-cols-1 md:grid-cols-[1fr_150px_120px_140px_48px] gap-2 md:gap-4 px-4 py-3 items-center"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.full_name || "---"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className={`${roleColors[user.role] || ""} gap-1`}
                        >
                          <RoleIcon className="h-3 w-3" />
                          {user.role}
                        </Badge>
                      </div>
                      <div>
                        {user.subscription_tier && user.subscription_tier !== "free" ? (
                          <Badge variant="secondary" className="capitalize">
                            {user.subscription_tier}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Free
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(user.created_at), {
                          addSuffix: true,
                          locale: locale === "es" ? es : enUS,
                        })}
                      </div>
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {["admin", "trainer", "client"]
                              .filter((r) => r !== user.role)
                              .map((newRole) => (
                                <DropdownMenuItem
                                  key={newRole}
                                  onClick={() =>
                                    setRoleChange({
                                      userId: user.id,
                                      name: user.full_name || user.email,
                                      newRole,
                                    })
                                  }
                                >
                                  {t("changeRoleTo", { role: newRole })}
                                </DropdownMenuItem>
                              ))}
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() =>
                                setUserToDelete({
                                  userId: user.id,
                                  name: user.full_name || user.email,
                                })
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("deleteUser")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("showingUsers", {
              from: page * pageSize + 1,
              to: Math.min((page + 1) * pageSize, totalCount),
              total: totalCount,
            })}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Role change confirmation */}
      <ConfirmDialog
        open={!!roleChange}
        onOpenChange={() => setRoleChange(null)}
        title={t("changeRole")}
        description={t("changeRoleConfirm", {
          name: roleChange?.name ?? "",
          role: roleChange?.newRole ?? "",
        })}
        confirmLabel={tc("confirm")}
        cancelLabel={tc("cancel")}
        isLoading={updateRole.isPending}
        onConfirm={() => {
          if (roleChange) {
            updateRole.mutate(
              { userId: roleChange.userId, role: roleChange.newRole },
              { onSuccess: () => setRoleChange(null) }
            );
          }
        }}
      />

      {/* Delete user confirmation */}
      <ConfirmDialog
        open={!!userToDelete}
        onOpenChange={() => setUserToDelete(null)}
        title={t("deleteUser")}
        description={t("deleteUserConfirm", { name: userToDelete?.name ?? "" })}
        confirmLabel={tc("confirm")}
        cancelLabel={tc("cancel")}
        isLoading={deleteUser.isPending}
        variant="destructive"
        onConfirm={() => {
          if (userToDelete) {
            deleteUser.mutate(userToDelete.userId, {
              onSuccess: () => setUserToDelete(null),
            });
          }
        }}
      />
    </div>
  );
}
