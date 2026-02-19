"use client";

import { useEffect, useCallback } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createBlockSchema, type BlockFormData } from "@/lib/validations/block";
import { useCreateBlock, useUpdateBlock } from "@/hooks/use-blocks";
import { useBlockBuilderStore } from "@/stores/block-builder-store";
import type { ExerciseBlock } from "@/services/blocks.service";
import { BLOCK_TYPES } from "@/lib/constants";
import { ExercisePicker } from "@/components/routines/exercise-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowLeft,
  Plus,
  ChevronUp,
  ChevronDown,
  Link2,
  X,
} from "lucide-react";
import Link from "next/link";

interface BlockBuilderProps {
  mode: "create" | "edit";
  block?: ExerciseBlock;
}

export function BlockBuilder({ mode, block }: BlockBuilderProps) {
  const t = useTranslations("blocks");
  const te = useTranslations("exercises");
  const tc = useTranslations("common");
  const tv = useTranslations("validation");
  const router = useRouter();
  const createBlock = useCreateBlock();
  const updateBlock = useUpdateBlock();

  const {
    exercises,
    setExercises,
    addExercise,
    removeExercise,
    updateExercise,
    moveExercise,
    toggleSuperset,
    reset,
  } = useBlockBuilderStore();

  const [showPicker, setShowPicker] = useState(false);

  const form = useForm<BlockFormData>({
    resolver: zodResolver(createBlockSchema(tv)),
    defaultValues: {
      name: block?.name ?? "",
      description: block?.description ?? "",
      block_type: (block?.block_type as BlockFormData["block_type"]) ?? "custom",
      color: block?.color ?? "",
      exercises: [],
    },
  });

  // Load existing block exercises into the store
  useEffect(() => {
    if (block?.exercises && block.exercises.length > 0) {
      const builderExercises = block.exercises.map((ex) => ({
        id: `loaded_${ex.id}`,
        exercise_id: ex.exercise_id,
        exercise: ex.exercise,
        order_index: ex.order_index,
        sets: ex.sets,
        reps: ex.reps,
        rest_seconds: ex.rest_seconds,
        notes: ex.notes ?? "",
        superset_group: ex.superset_group,
      }));
      setExercises(builderExercises);
    } else {
      reset();
    }
    return () => reset();
  }, [block, setExercises, reset]);

  const isLoading = createBlock.isPending || updateBlock.isPending;

  const onSubmit = useCallback(
    (formData: BlockFormData) => {
      const fullData: BlockFormData = {
        ...formData,
        exercises: exercises.map((ex) => ({
          exercise_id: ex.exercise_id,
          order_index: ex.order_index,
          sets: ex.sets,
          reps: ex.reps,
          rest_seconds: ex.rest_seconds,
          notes: ex.notes,
          superset_group: ex.superset_group,
        })),
      };

      if (mode === "create") {
        createBlock.mutate(fullData, {
          onSuccess: () => router.push("/blocks"),
        });
      } else if (block) {
        updateBlock.mutate(
          { id: block.id, data: fullData },
          { onSuccess: () => router.push(`/blocks/${block.id}`) }
        );
      }
    },
    [exercises, mode, block, createBlock, updateBlock, router]
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/blocks">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">
          {mode === "create" ? t("addBlock") : t("editBlock")}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("metadata")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("namePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("description")}</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="block_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("blockType")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BLOCK_TYPES.map((bt) => (
                          <SelectItem key={bt} value={bt}>
                            {t(bt as Parameters<typeof t>[0])}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Exercises */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("exercises")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {exercises.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground border rounded-lg border-dashed">
                  {t("noExercises")}
                </div>
              ) : (
                <div className="space-y-2">
                  {exercises.map((ex, exIndex) => {
                    const inSuperset = ex.superset_group !== null;
                    const prevInSameSuperset =
                      exIndex > 0 &&
                      exercises[exIndex - 1].superset_group ===
                        ex.superset_group &&
                      inSuperset;

                    return (
                      <div key={ex.id}>
                        {inSuperset && prevInSameSuperset && (
                          <div className="flex items-center gap-2 ml-4 -mt-1 mb-1">
                            <Link2 className="h-3 w-3 text-primary" />
                            <span className="text-xs text-primary font-medium">
                              {t("superset")}
                            </span>
                          </div>
                        )}

                        <div
                          className={`border rounded-lg p-3 ${inSuperset ? "border-primary/30 bg-primary/5" : ""}`}
                        >
                          {/* Exercise header */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-muted-foreground font-mono w-5">
                              {exIndex + 1}
                            </span>
                            <p className="font-medium text-sm flex-1 truncate">
                              {ex.exercise?.name ?? ex.exercise_id}
                            </p>
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                disabled={exIndex === 0}
                                onClick={() =>
                                  moveExercise(exIndex, exIndex - 1)
                                }
                              >
                                <ChevronUp className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                disabled={exIndex === exercises.length - 1}
                                onClick={() =>
                                  moveExercise(exIndex, exIndex + 1)
                                }
                              >
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                              {exIndex > 0 && (
                                <Button
                                  type="button"
                                  variant={inSuperset ? "default" : "ghost"}
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => toggleSuperset(exIndex)}
                                >
                                  <Link2 className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive"
                                onClick={() => removeExercise(exIndex)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Sets / Reps / Rest */}
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-xs text-muted-foreground">
                                {t("sets")}
                              </label>
                              <Input
                                type="number"
                                min={1}
                                max={20}
                                value={ex.sets}
                                onChange={(e) =>
                                  updateExercise(exIndex, {
                                    sets: parseInt(e.target.value) || 1,
                                  })
                                }
                                className="h-8 text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground">
                                {t("reps")}
                              </label>
                              <Input
                                value={ex.reps}
                                onChange={(e) =>
                                  updateExercise(exIndex, {
                                    reps: e.target.value,
                                  })
                                }
                                placeholder="10"
                                className="h-8 text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground">
                                {t("rest")}
                              </label>
                              <Input
                                type="number"
                                min={0}
                                max={600}
                                value={ex.rest_seconds}
                                onChange={(e) =>
                                  updateExercise(exIndex, {
                                    rest_seconds:
                                      parseInt(e.target.value) || 0,
                                  })
                                }
                                className="h-8 text-sm"
                              />
                            </div>
                          </div>

                          {/* Muscle group badges */}
                          {ex.exercise?.muscle_groups &&
                            ex.exercise.muscle_groups.length > 0 && (
                              <div className="flex gap-1 flex-wrap mt-2">
                                {ex.exercise.muscle_groups
                                  .slice(0, 3)
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
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add exercise button */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowPicker(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("addExercise")}
              </Button>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" asChild>
              <Link href="/blocks">{tc("cancel")}</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {tc("save")}
            </Button>
          </div>
        </form>
      </Form>

      {/* Exercise Picker Modal */}
      <ExercisePicker
        open={showPicker}
        onOpenChange={setShowPicker}
        onSelect={(exercise) => addExercise(exercise)}
      />
    </div>
  );
}
