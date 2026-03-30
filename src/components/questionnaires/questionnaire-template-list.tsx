"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  useQuestionnaireTemplates,
  useDeleteQuestionnaireTemplate,
  useDuplicateQuestionnaireTemplate,
} from "@/hooks/use-questionnaires";
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
  ClipboardList,
  Send,
} from "lucide-react";
import Link from "next/link";
import { AssignQuestionnaireDialog } from "./assign-questionnaire-dialog";
import type { QuestionnaireTemplate } from "@/services/questionnaires.service";

const categoryColors: Record<string, string> = {
  medical: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  goals: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  lifestyle: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  nutrition: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  general: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

export function QuestionnaireTemplateList() {
  const t = useTranslations("questionnaires");
  const tc = useTranslations("common");
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [assignTemplate, setAssignTemplate] =
    useState<QuestionnaireTemplate | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const { data: templates, isLoading } = useQuestionnaireTemplates();
  const deleteTemplate = useDeleteQuestionnaireTemplate();
  const duplicateTemplate = useDuplicateQuestionnaireTemplate();

  const filtered = (templates ?? []).filter((tpl) => {
    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    return (
      tpl.name.toLowerCase().includes(q) ||
      tpl.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button asChild>
          <Link href="/questionnaires/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("addTemplate")}
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

      {/* Grid */}
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
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={t("noTemplates")}
          description={t("noTemplatesDescription")}
          actionLabel={t("addTemplate")}
          actionHref="/questionnaires/new"
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tpl) => (
            <Card
              key={tpl.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() =>
                router.push(`/questionnaires/${tpl.id}/edit`)
              }
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{tpl.name}</p>
                    {tpl.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {tpl.description}
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
                          router.push(`/questionnaires/${tpl.id}/edit`);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        {tc("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateTemplate.mutate(tpl.id);
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        {t("duplicate")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setAssignTemplate(tpl);
                        }}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        {t("assignToClient")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(tpl.id);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {tc("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Meta badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {tpl.category && (
                    <Badge
                      variant="outline"
                      className={categoryColors[tpl.category] || ""}
                    >
                      {t(`category_${tpl.category}` as Parameters<typeof t>[0])}
                    </Badge>
                  )}
                  {tpl.questions && (
                    <Badge variant="secondary">
                      {tpl.questions.length} {t("questions")}
                    </Badge>
                  )}
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
        isLoading={deleteTemplate.isPending}
        onConfirm={() => {
          if (deleteId) {
            deleteTemplate.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            });
          }
        }}
      />

      {/* Assign dialog */}
      <AssignQuestionnaireDialog
        open={!!assignTemplate}
        onOpenChange={() => setAssignTemplate(null)}
        template={assignTemplate}
      />
    </div>
  );
}
