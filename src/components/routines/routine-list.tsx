"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRoutines, useDeleteRoutine, useDuplicateRoutine } from "@/hooks/use-routines";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
  Calendar,
  Dumbbell,
} from "lucide-react";
import Link from "next/link";

const difficultyColors: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export function RoutineList() {
  const t = useTranslations("routines");
  const tc = useTranslations("common");
  const te = useTranslations("empty");
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading } = useRoutines({ search: debouncedSearch });
  const deleteRoutine = useDeleteRoutine();
  const duplicateRoutine = useDuplicateRoutine();

  const routines = data?.data ?? [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button asChild>
          <Link href="/routines/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("addRoutine")}
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={tc("search") + "..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 max-w-md"
        />
      </div>

      {/* Routine Grid */}
      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-60" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : routines.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          emoji={"\uD83D\uDCCB"}
          title={te("routinesTitle")}
          description={te("routinesDescription")}
          actionLabel={t("addRoutine")}
          actionHref="/routines/new"
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {routines.map((routine) => (
            <Card
              key={routine.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => router.push(`/routines/${routine.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{routine.name}</p>
                    {routine.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {routine.description}
                      </p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/routines/${routine.id}/edit`);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        {tc("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateRoutine.mutate(routine.id);
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        {t("duplicate")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(routine.id);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {tc("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {routine.difficulty && (
                    <Badge
                      variant="outline"
                      className={difficultyColors[routine.difficulty] || ""}
                    >
                      {t(routine.difficulty as Parameters<typeof t>[0])}
                    </Badge>
                  )}
                  {routine.is_template && (
                    <Badge variant="secondary">{t("templateRoutine")}</Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {routine.duration_weeks}w / {routine.days_per_week}d
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
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
        isLoading={deleteRoutine.isPending}
        onConfirm={() => {
          if (deleteId) {
            deleteRoutine.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            });
          }
        }}
      />
    </div>
  );
}
