"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  useCoachingPlans,
  useDeleteCoachingPlan,
  useDuplicateCoachingPlan,
} from "@/hooks/use-coaching-plans";
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
  Briefcase,
  DollarSign,
  Tag,
} from "lucide-react";
import Link from "next/link";

const placeholderGradients = [
  "from-chart-2/20 to-chart-3/20",
  "from-chart-1/20 to-chart-2/20",
  "from-chart-4/20 to-chart-5/20",
  "from-chart-5/20 to-chart-3/20",
  "from-chart-3/20 to-chart-2/20",
  "from-chart-4/20 to-chart-1/20",
];

export function CoachingPlanList() {
  const t = useTranslations("coachingPlans");
  const tc = useTranslations("common");
  const te = useTranslations("empty");
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading } = useCoachingPlans({ search: debouncedSearch });
  const deleteCoachingPlan = useDeleteCoachingPlan();
  const duplicateCoachingPlan = useDuplicateCoachingPlan();

  const plans = data?.data ?? [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
        <Button asChild>
          <Link href="/coaching-plans/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("addPlan")}
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

      {/* Plan Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="h-36 w-full rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-60" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : plans.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={te("coachingPlansTitle")}
          description={te("coachingPlansDescription")}
          actionLabel={t("addPlan")}
          actionHref="/coaching-plans/new"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors overflow-hidden"
              onClick={() => router.push(`/coaching-plans/${plan.id}`)}
            >
              {/* Cover image or gradient placeholder */}
              {plan.cover_image ? (
                <div className="h-36 w-full overflow-hidden">
                  <img
                    src={plan.cover_image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`h-36 w-full bg-gradient-to-br ${placeholderGradients[index % placeholderGradients.length]} flex items-center justify-center`}
                >
                  <Briefcase className="h-12 w-12 text-muted-foreground/30" />
                </div>
              )}

              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{plan.name}</p>
                    {plan.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {plan.description}
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
                          router.push(`/coaching-plans/${plan.id}/edit`);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        {tc("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateCoachingPlan.mutate(plan.id);
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        {t("duplicate")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(plan.id);
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
                  {plan.service_tier && (
                    <Badge
                      variant="outline"
                      style={
                        plan.service_tier.color
                          ? {
                              borderColor: plan.service_tier.color,
                              color: plan.service_tier.color,
                            }
                          : undefined
                      }
                    >
                      {plan.service_tier.name}
                    </Badge>
                  )}
                  {!plan.is_active && (
                    <Badge variant="secondary">{tc("inactive")}</Badge>
                  )}
                  {plan.is_published && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/25">
                      {t("published")}
                    </Badge>
                  )}
                </div>

                {/* Price & duration */}
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {plan.duration_weeks} {t("weeks")}
                  </span>
                  {plan.price != null && plan.price > 0 && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {plan.price} {plan.currency || "EUR"}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {plan.tags && plan.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {plan.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-[10px] px-1.5 py-0"
                      >
                        <Tag className="h-2.5 w-2.5 mr-0.5" />
                        {tag}
                      </Badge>
                    ))}
                    {plan.tags.length > 3 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{plan.tags.length - 3}
                      </span>
                    )}
                  </div>
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
        isLoading={deleteCoachingPlan.isPending}
        onConfirm={() => {
          if (deleteId) {
            deleteCoachingPlan.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            });
          }
        }}
      />
    </div>
  );
}
