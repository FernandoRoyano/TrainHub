"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRoutines, useDeleteRoutine } from "@/hooks/use-routines";
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
import { UseTemplateDialog } from "./use-template-dialog";
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Play,
  Calendar,
  Dumbbell,
  LayoutTemplate,
  Users,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { STATUS_STYLES } from "@/lib/ui-tokens";

const genderLabels: Record<string, string> = {
  male: "M",
  female: "F",
  unisex: "U",
};

export function TemplateList() {
  const t = useTranslations("templates");
  const tr = useTranslations("routines");
  const tc = useTranslations("common");
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [useTemplateData, setUseTemplateData] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading } = useRoutines({
    search: debouncedSearch,
    is_template: true,
  });
  const deleteRoutine = useDeleteRoutine();

  const templates = data?.data ?? [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("subtitle")}
          </p>
        </div>
        <Button asChild>
          <Link href="/routines/new?template=true">
            <Plus className="mr-2 h-4 w-4" />
            {t("createTemplate")}
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

      {/* Template Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <EmptyState
          icon={LayoutTemplate}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          actionLabel={t("createTemplate")}
          actionHref="/routines/new?template=true"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="group hover:border-primary/30 transition-all duration-200"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <LayoutTemplate className="h-4 w-4 text-primary shrink-0" />
                      <p className="font-semibold truncate">{template.name}</p>
                    </div>
                    {template.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                        {template.description}
                      </p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/routines/${template.id}`)
                        }
                      >
                        <Dumbbell className="mr-2 h-4 w-4" />
                        {t("viewDetails")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/routines/${template.id}/edit`)
                        }
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        {tc("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteId(template.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {tc("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Meta badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {template.difficulty && (
                    <Badge
                      variant="outline"
                      className={STATUS_STYLES[template.difficulty] || ""}
                    >
                      {tr(template.difficulty as Parameters<typeof tr>[0])}
                    </Badge>
                  )}
                  {template.target_gender && template.target_gender !== "unisex" && (
                    <Badge variant="outline">
                      <Users className="mr-1 h-3 w-3" />
                      {genderLabels[template.target_gender]}
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {template.duration_weeks}w
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {template.days_per_week}d/w
                  </span>
                </div>

                {/* Use button */}
                <Button
                  size="sm"
                  className="w-full mt-4"
                  onClick={() =>
                    setUseTemplateData({
                      id: template.id,
                      name: template.name,
                    })
                  }
                >
                  <Play className="mr-2 h-3.5 w-3.5" />
                  {t("useTemplate")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Use Template Dialog */}
      {useTemplateData && (
        <UseTemplateDialog
          open={!!useTemplateData}
          onOpenChange={(open) => !open && setUseTemplateData(null)}
          templateId={useTemplateData.id}
          templateName={useTemplateData.name}
        />
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
