"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useServiceTiers, useDeleteServiceTier } from "@/hooks/use-service-tiers";
import { FEATURE_KEYS } from "@/lib/validations/service-tier";
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
import { TierBadge } from "./tier-badge";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Check,
  X,
  Layers,
} from "lucide-react";
import Link from "next/link";

export function ServiceTierList() {
  const t = useTranslations("serviceTiers");
  const tc = useTranslations("common");
  const router = useRouter();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: tiers, isLoading } = useServiceTiers();
  const deleteTier = useDeleteServiceTier();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button asChild>
          <Link href="/service-tiers/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("addTier")}
          </Link>
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
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
      ) : !tiers || tiers.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          actionLabel={t("addTier")}
          actionHref="/service-tiers/new"
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className="hover:bg-accent/50 transition-colors overflow-hidden"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <TierBadge
                        name={tier.name}
                        color={tier.color || "#6b7280"}
                        size="md"
                      />
                      <Badge variant={tier.is_active ? "default" : "secondary"}>
                        {tier.is_active ? tc("active") : tc("inactive")}
                      </Badge>
                    </div>
                    {tier.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {tier.description}
                      </p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/service-tiers/${tier.id}/edit`)
                        }
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        {tc("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteId(tier.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {tc("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Price */}
                {tier.price != null && tier.price > 0 && (
                  <p className="text-lg font-semibold mt-3">
                    {tier.price} {tier.currency || "EUR"}
                    {tier.billing_interval && (
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        / {t(`interval_${tier.billing_interval}`)}
                      </span>
                    )}
                  </p>
                )}

                {/* Features */}
                <div className="mt-3 space-y-1">
                  {FEATURE_KEYS.map((key) => {
                    const enabled = tier.features?.[key] ?? false;
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-2 text-xs"
                      >
                        {enabled ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <X className="h-3 w-3 text-muted-foreground/50" />
                        )}
                        <span
                          className={
                            enabled
                              ? "text-foreground"
                              : "text-muted-foreground/50"
                          }
                        >
                          {t(`feature_${key}`)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Revisions */}
                {tier.max_revisions_per_month != null && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {t("maxRevisions")}: {tier.max_revisions_per_month}
                  </p>
                )}
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
        isLoading={deleteTier.isPending}
        onConfirm={() => {
          if (deleteId) {
            deleteTier.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            });
          }
        }}
      />
    </div>
  );
}
