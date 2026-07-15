"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCoachingPlanSchema,
  type CoachingPlanFormData,
} from "@/lib/validations/coaching-plan";
import {
  useCreateCoachingPlan,
  useUpdateCoachingPlan,
} from "@/hooks/use-coaching-plans";
import { useServiceTiers } from "@/hooks/use-service-tiers";
import { useRoutines } from "@/hooks/use-routines";
import { useMealPlans } from "@/hooks/use-nutrition";
import { useQuestionnaireTemplates } from "@/hooks/use-questionnaires";
import { useUploadMedia } from "@/hooks/use-exercises";
import type { CoachingPlan } from "@/services/coaching-plans.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Loader2,
  X,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

interface CoachingPlanFormProps {
  mode: "create" | "edit";
  plan?: CoachingPlan;
}

export function CoachingPlanForm({ mode, plan }: CoachingPlanFormProps) {
  const t = useTranslations("coachingPlans");
  const tc = useTranslations("common");
  const tv = useTranslations("validation");
  const router = useRouter();

  const schema = createCoachingPlanSchema(tv);
  const createPlan = useCreateCoachingPlan();
  const updatePlan = useUpdateCoachingPlan();
  const uploadMedia = useUploadMedia();

  const { data: serviceTiersData } = useServiceTiers();
  const { data: routinesData } = useRoutines({ is_template: true });
  const { data: mealPlansData } = useMealPlans({ is_template: true });
  const { data: questionnaireTemplatesData } = useQuestionnaireTemplates();

  const serviceTiers = serviceTiersData ?? [];
  const routineTemplates = routinesData?.data ?? [];
  const mealPlanTemplates = mealPlansData?.data ?? [];
  const questionnaireTemplates = questionnaireTemplatesData ?? [];

  const [tagsInput, setTagsInput] = useState(
    plan?.tags?.join(", ") ?? ""
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CoachingPlanFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: plan?.name ?? "",
      description: plan?.description ?? "",
      cover_image: plan?.cover_image ?? "",
      duration_weeks: plan?.duration_weeks ?? 4,
      service_tier_id: plan?.service_tier_id ?? "",
      routine_template_id: plan?.routine_template_id ?? "",
      meal_plan_template_id: plan?.meal_plan_template_id ?? "",
      questionnaire_template_ids: plan?.questionnaire_template_ids ?? [],
      price: plan?.price ?? undefined,
      currency: plan?.currency ?? "EUR",
      tags: plan?.tags ?? [],
      is_active: plan?.is_active ?? true,
      is_published: plan?.is_published ?? false,
    },
  });

  const coverImage = watch("cover_image");
  const selectedQuestionnaires = watch("questionnaire_template_ids") ?? [];
  const isActive = watch("is_active");
  const isPublished = watch("is_published");

  const handleCoverUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      uploadMedia.mutate(
        { file, folder: "coaching-plans" },
        {
          onSuccess: (url) => {
            setValue("cover_image", url);
          },
        }
      );
    },
    [uploadMedia, setValue]
  );

  const onSubmit = (data: CoachingPlanFormData) => {
    // Parse tags from comma-separated input
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const submitData = { ...data, tags };

    if (mode === "create") {
      createPlan.mutate(submitData, {
        onSuccess: () => router.push("/coaching-plans"),
      });
    } else if (plan) {
      updatePlan.mutate(
        { id: plan.id, data: submitData },
        {
          onSuccess: () => router.push(`/coaching-plans/${plan.id}`),
        }
      );
    }
  };

  const isPending = createPlan.isPending || updatePlan.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="shrink-0" asChild>
          <Link href="/coaching-plans">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold">
          {mode === "create" ? t("addPlan") : t("editPlan")}
        </h1>
      </div>

      {/* Cover Image */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("coverImage")}</CardTitle>
        </CardHeader>
        <CardContent>
          {coverImage ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <img
                src={coverImage}
                alt=""
                className="h-full w-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={() => setValue("cover_image", "")}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                {uploadMedia.isPending ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-sm">{t("uploadCoverImage")}</span>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
                disabled={uploadMedia.isPending}
              />
            </label>
          )}
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("basicInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("planName")}</Label>
            <Input
              {...register("name")}
              placeholder={t("planNamePlaceholder")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t("description")}</Label>
            <Textarea
              {...register("description")}
              placeholder={t("descriptionPlaceholder")}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("durationWeeks")}</Label>
              <Input
                type="number"
                min={1}
                max={52}
                {...register("duration_weeks", { valueAsNumber: true })}
              />
              {errors.duration_weeks && (
                <p className="text-xs text-destructive">
                  {errors.duration_weeks.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t("price")}</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  {...register("price", { valueAsNumber: true })}
                  className="flex-1"
                />
                <Select
                  value={watch("currency") || "EUR"}
                  onValueChange={(val) => setValue("currency", val)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("tags")}</Label>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder={t("tagsPlaceholder")}
            />
            <p className="text-xs text-muted-foreground">{t("tagsHint")}</p>
          </div>
        </CardContent>
      </Card>

      {/* Linked Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("linkedResources")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Service Tier */}
          <div className="space-y-2">
            <Label>{t("serviceTier")}</Label>
            <Select
              value={watch("service_tier_id") || "none"}
              onValueChange={(val) =>
                setValue("service_tier_id", val === "none" ? "" : val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectServiceTier")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("noServiceTier")}</SelectItem>
                {serviceTiers.map((tier) => (
                  <SelectItem key={tier.id} value={tier.id}>
                    {tier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Routine Template */}
          <div className="space-y-2">
            <Label>{t("routineTemplate")}</Label>
            <Select
              value={watch("routine_template_id") || "none"}
              onValueChange={(val) =>
                setValue("routine_template_id", val === "none" ? "" : val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectRoutineTemplate")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("noRoutineTemplate")}</SelectItem>
                {routineTemplates.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Meal Plan Template */}
          <div className="space-y-2">
            <Label>{t("mealPlanTemplate")}</Label>
            <Select
              value={watch("meal_plan_template_id") || "none"}
              onValueChange={(val) =>
                setValue("meal_plan_template_id", val === "none" ? "" : val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectMealPlanTemplate")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("noMealPlanTemplate")}</SelectItem>
                {mealPlanTemplates.map((mp) => (
                  <SelectItem key={mp.id} value={mp.id}>
                    {mp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Questionnaire Templates */}
          <div className="space-y-2">
            <Label>{t("questionnaireTemplates")}</Label>
            {questionnaireTemplates.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("noQuestionnaireTemplates")}
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {questionnaireTemplates.map((qt) => (
                  <div key={qt.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`qt-${qt.id}`}
                      checked={selectedQuestionnaires.includes(qt.id)}
                      onCheckedChange={(checked) => {
                        const current = selectedQuestionnaires;
                        if (checked) {
                          setValue("questionnaire_template_ids", [
                            ...current,
                            qt.id,
                          ]);
                        } else {
                          setValue(
                            "questionnaire_template_ids",
                            current.filter((id) => id !== qt.id)
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={`qt-${qt.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {qt.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("status")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t("isActive")}</Label>
              <p className="text-xs text-muted-foreground">
                {t("isActiveHint")}
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => setValue("is_active", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>{t("isPublished")}</Label>
              <p className="text-xs text-muted-foreground">
                {t("isPublishedHint")}
              </p>
            </div>
            <Switch
              checked={isPublished}
              onCheckedChange={(checked) => setValue("is_published", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" asChild>
          <Link href="/coaching-plans">{tc("cancel")}</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? t("addPlan") : tc("save")}
        </Button>
      </div>
    </form>
  );
}
