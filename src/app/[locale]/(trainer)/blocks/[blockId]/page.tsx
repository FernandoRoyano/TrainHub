"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBlock, useDeleteBlock } from "@/hooks/use-blocks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { STATUS_STYLES } from "@/lib/ui-tokens";

const blockTypeColors: Record<string, string> = {
  warmup: STATUS_STYLES.warmup,
  cooldown: STATUS_STYLES.cooldown,
  circuit: STATUS_STYLES.circuit,
  custom: "bg-muted text-muted-foreground border-border",
};

export default function BlockDetailPage() {
  const { blockId } = useParams<{ blockId: string }>();
  const t = useTranslations("blocks");
  const te = useTranslations("exercises");
  const tc = useTranslations("common");
  const router = useRouter();

  const { data: block, isLoading } = useBlock(blockId);
  const deleteBlock = useDeleteBlock();

  const [showDelete, setShowDelete] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!block) {
    return <p className="text-muted-foreground">{tc("notFound")}</p>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/blocks">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold">{block.name}</h1>
            {block.description && (
              <p className="text-sm text-muted-foreground">
                {block.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/blocks/${block.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              {tc("edit")}
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setShowDelete(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            {tc("delete")}
          </Button>
        </div>
      </div>

      {/* Type badge */}
      <div className="flex gap-2">
        <Badge
          variant="outline"
          className={blockTypeColors[block.block_type] || ""}
        >
          {t(block.block_type as Parameters<typeof t>[0])}
        </Badge>
        {block.exercises && (
          <Badge variant="outline">
            {t("exerciseCount", { count: block.exercises.length })}
          </Badge>
        )}
      </div>

      {/* Exercises */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("exercises")}</CardTitle>
        </CardHeader>
        <CardContent>
          {!block.exercises || block.exercises.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("noExercises")}
            </p>
          ) : (
            <div className="space-y-2">
              {block.exercises.map((ex, i) => {
                const inSuperset = ex.superset_group !== null;
                return (
                  <div
                    key={ex.id}
                    className={`flex items-center gap-3 p-2 rounded ${inSuperset ? "bg-primary/5 border border-primary/20" : "bg-muted/50"}`}
                  >
                    <span className="text-xs text-muted-foreground font-mono w-5">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {ex.exercise?.name ?? ex.exercise_id}
                      </p>
                      <div className="flex gap-1 mt-0.5">
                        {ex.exercise?.muscle_groups
                          ?.slice(0, 2)
                          .map((mg) => (
                            <Badge
                              key={mg}
                              variant="outline"
                              className="text-[10px] px-1 py-0"
                            >
                              {te(
                                `muscle_${mg}` as Parameters<typeof te>[0]
                              )}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground shrink-0">
                      <span>
                        {ex.sets}x{ex.reps}
                      </span>
                      <span>{ex.rest_seconds}s</span>
                    </div>
                    {inSuperset && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] shrink-0"
                      >
                        SS
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete dialog */}
      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title={tc("delete")}
        description={t("deleteConfirm")}
        confirmLabel={tc("delete")}
        cancelLabel={tc("cancel")}
        isLoading={deleteBlock.isPending}
        onConfirm={() => {
          deleteBlock.mutate(block.id, {
            onSuccess: () => router.push("/blocks"),
          });
        }}
      />
    </div>
  );
}
