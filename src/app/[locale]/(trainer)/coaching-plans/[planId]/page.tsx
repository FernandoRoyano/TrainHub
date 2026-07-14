"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  useCoachingPlan,
  useDeleteCoachingPlan,
  useDuplicateCoachingPlan,
} from "@/hooks/use-coaching-plans";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { AssignCoachingPlanDialog } from "@/components/coaching-plans/assign-coaching-plan-dialog";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Copy,
  Users,
  Calendar,
  DollarSign,
  Dumbbell,
  UtensilsCrossed,
  Shield,
  FileQuestion,
  Tag,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

export default function CoachingPlanDetailPage() {
  const { planId } = useParams<{ planId: string }>();
  const t = useTranslations("coachingPlans");
  const tc = useTranslations("common");
  const router = useRouter();

  const { data: plan, isLoading } = useCoachingPlan(planId);
  const deletePlan = useDeleteCoachingPlan();
  const duplicatePlan = useDuplicateCoachingPlan();

  const [showDelete, setShowDelete] = useState(false);
  const [showAssign, setShowAssign] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!plan) {
    return <p className="text-muted-foreground">{tc("notFound")}</p>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link href="/coaching-plans">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold truncate">
              {plan.name}
            </h1>
            {plan.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {plan.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={() => setShowAssign(true)}>
            <Users className="mr-1 h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("assignToClient")}</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => duplicatePlan.mutate(plan.id)}
            disabled={duplicatePlan.isPending}
          >
            <Copy className="mr-1 h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("duplicate")}</span>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/coaching-plans/${plan.id}/edit`}>
              <Pencil className="mr-1 h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tc("edit")}</span>
            </Link>
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            <span className="hidden sm:inline">{tc("delete")}</span>
          </Button>
        </div>
      </div>

      {/* Cover image */}
      {plan.cover_image && (
        <div className="h-48 w-full overflow-hidden rounded-lg">
          <img
            src={plan.cover_image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Metadata badges */}
      <div className="flex flex-wrap gap-2">
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
            <Shield className="mr-1 h-3 w-3" />
            {plan.service_tier.name}
          </Badge>
        )}
        <Badge variant="outline">
          <Calendar className="mr-1 h-3 w-3" />
          {plan.duration_weeks} {t("weeks")}
        </Badge>
        {plan.price != null && plan.price > 0 && (
          <Badge variant="outline">
            <DollarSign className="mr-1 h-3 w-3" />
            {plan.price} {plan.currency || "EUR"}
          </Badge>
        )}
        {plan.is_active ? (
          <Badge variant="outline" className="bg-success/10 text-success border-success/25">
            {tc("active")}
          </Badge>
        ) : (
          <Badge variant="secondary">{tc("inactive")}</Badge>
        )}
        {plan.is_published && (
          <Badge variant="outline" className="bg-info/10 text-info border-info/25">
            {t("published")}
          </Badge>
        )}
      </div>

      {/* Tags */}
      {plan.tags && plan.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {plan.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Linked Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("linkedResources")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {plan.routine_template ? (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Dumbbell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t("routineTemplate")}</p>
                <p className="text-xs text-muted-foreground">
                  {plan.routine_template.name}
                </p>
              </div>
            </div>
          ) : null}

          {plan.meal_plan_template ? (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t("mealPlanTemplate")}</p>
                <p className="text-xs text-muted-foreground">
                  {plan.meal_plan_template.name}
                </p>
              </div>
            </div>
          ) : null}

          {plan.questionnaire_template_ids &&
          plan.questionnaire_template_ids.length > 0 ? (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <FileQuestion className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {t("questionnaireTemplates")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {plan.questionnaire_template_ids.length}{" "}
                  {t("questionnairesLinked")}
                </p>
              </div>
            </div>
          ) : null}

          {!plan.routine_template &&
            !plan.meal_plan_template &&
            (!plan.questionnaire_template_ids ||
              plan.questionnaire_template_ids.length === 0) && (
              <p className="text-sm text-muted-foreground italic">
                {t("noLinkedResources")}
              </p>
            )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title={tc("delete")}
        description={t("deleteConfirm")}
        confirmLabel={tc("delete")}
        cancelLabel={tc("cancel")}
        isLoading={deletePlan.isPending}
        onConfirm={() => {
          deletePlan.mutate(plan.id, {
            onSuccess: () => router.push("/coaching-plans"),
          });
        }}
      />

      <AssignCoachingPlanDialog
        planId={plan.id}
        open={showAssign}
        onOpenChange={setShowAssign}
      />
    </div>
  );
}
