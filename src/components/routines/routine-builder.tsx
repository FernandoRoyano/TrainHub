"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { createRoutineSchema, type RoutineFormData } from "@/lib/validations/routine";
import { useCreateRoutine, useUpdateRoutine } from "@/hooks/use-routines";
import { useRoutineBuilderStore } from "@/stores/routine-builder-store";
import type { BuilderExercise } from "@/stores/routine-builder-store";
import type { Routine } from "@/services/routines.service";
import type { ExerciseBlock } from "@/services/blocks.service";
import { DIFFICULTY_LEVELS } from "@/lib/constants";
import { ExercisePicker } from "./exercise-picker";
import { BlockPicker } from "@/components/blocks/block-picker";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  Trash2,
  GripVertical,
  Link2,
  X,
  Puzzle,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import type { Exercise } from "@/services/exercises.service";

interface RoutineBuilderProps {
  mode: "create" | "edit";
  routine?: Routine;
  defaultTemplate?: boolean;
}

/* ── Sortable exercise row ────────────────────────────────── */
function SortableExerciseItem({
  ex,
  exIndex,
  activeDayIndex,
  prevInSameSuperset,
  locale,
  t,
  te,
  updateExercise,
  toggleSuperset,
  removeExercise,
}: {
  ex: BuilderExercise;
  exIndex: number;
  activeDayIndex: number;
  prevInSameSuperset: boolean;
  locale: string;
  t: ReturnType<typeof useTranslations>;
  te: ReturnType<typeof useTranslations>;
  updateExercise: (di: number, ei: number, data: Partial<BuilderExercise>) => void;
  toggleSuperset: (di: number, ei: number) => void;
  removeExercise: (di: number, ei: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ex.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const inSuperset = ex.superset_group !== null;

  return (
    <div ref={setNodeRef} style={style}>
      {/* Superset indicator */}
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
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground hover:text-foreground"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <span className="text-xs text-muted-foreground font-mono w-5">
            {exIndex + 1}
          </span>
          {(() => {
            const exData = ex.exercise as Exercise | undefined;
            const thumb = exData?.images?.[0] ?? exData?.thumbnail_url ?? null;
            const name = exData
              ? (locale === "es" && exData.name_es ? exData.name_es : exData.name)
              : ex.exercise_id;
            return (
              <>
                <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                  {thumb ? (
                    <img src={thumb} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-3 w-3 text-muted-foreground/40" />
                  )}
                </div>
                <p className="font-medium text-sm flex-1 truncate">{name}</p>
              </>
            );
          })()}
          <div className="flex items-center gap-1">
            {exIndex > 0 && (
              <Button
                type="button"
                variant={inSuperset ? "default" : "ghost"}
                size="icon"
                className="h-7 w-7"
                onClick={() =>
                  toggleSuperset(activeDayIndex, exIndex)
                }
              >
                <Link2 className="h-3 w-3" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={() =>
                removeExercise(activeDayIndex, exIndex)
              }
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Sets / Reps / Rest inline */}
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
                updateExercise(activeDayIndex, exIndex, {
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
                updateExercise(activeDayIndex, exIndex, {
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
                updateExercise(activeDayIndex, exIndex, {
                  rest_seconds: parseInt(e.target.value) || 0,
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
}

/* ── Main builder ─────────────────────────────────────────── */
export function RoutineBuilder({ mode, routine, defaultTemplate }: RoutineBuilderProps) {
  const t = useTranslations("routines");
  const te = useTranslations("exercises");
  const tc = useTranslations("common");
  const tb = useTranslations("blocks");
  const tv = useTranslations("validation");
  const locale = useLocale();
  const router = useRouter();
  const createRoutine = useCreateRoutine();
  const updateRoutine = useUpdateRoutine();

  const {
    days,
    activeDayIndex,
    setDays,
    addDay,
    removeDay,
    updateDay,
    setActiveDayIndex,
    addExercise,
    removeExercise,
    updateExercise,
    toggleSuperset,
    addExercisesFromBlock,
    reorderExercise,
    reset,
  } = useRoutineBuilderStore();

  const [showPicker, setShowPicker] = useState(false);
  const [showBlockPicker, setShowBlockPicker] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const form = useForm<RoutineFormData>({
    resolver: zodResolver(createRoutineSchema(tv)),
    defaultValues: {
      name: routine?.name ?? "",
      description: routine?.description ?? "",
      duration_weeks: routine?.duration_weeks ?? 4,
      days_per_week: routine?.days_per_week ?? 3,
      difficulty: (routine?.difficulty as RoutineFormData["difficulty"]) ?? "beginner",
      target_gender:
        (routine?.target_gender as RoutineFormData["target_gender"]) ?? "unisex",
      is_template: routine?.is_template ?? defaultTemplate ?? false,
      days: [],
    },
  });

  // Load existing routine data into the store
  useEffect(() => {
    if (routine?.days && routine.days.length > 0) {
      const builderDays = routine.days.map((day) => ({
        id: `loaded_${day.id}`,
        day_number: day.day_number,
        name: day.name ?? "",
        notes: day.notes ?? "",
        exercises: day.exercises.map((ex) => ({
          id: `loaded_${ex.id}`,
          exercise_id: ex.exercise_id,
          exercise: ex.exercise,
          order_index: ex.order_index,
          sets: ex.sets,
          reps: ex.reps,
          rest_seconds: ex.rest_seconds,
          notes: ex.notes ?? "",
          superset_group: ex.superset_group,
        })),
      }));
      setDays(builderDays);
    } else {
      reset();
    }
    return () => reset();
  }, [routine, setDays, reset]);

  const isLoading = createRoutine.isPending || updateRoutine.isPending;
  const activeDay = days[activeDayIndex];

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id || !activeDay) return;

      const oldIndex = activeDay.exercises.findIndex((e) => e.id === active.id);
      const newIndex = activeDay.exercises.findIndex((e) => e.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderExercise(activeDayIndex, oldIndex, newIndex);
      }
    },
    [activeDay, activeDayIndex, reorderExercise]
  );

  const handleBlockSelect = useCallback(
    (block: ExerciseBlock) => {
      if (block.exercises && block.exercises.length > 0) {
        addExercisesFromBlock(activeDayIndex, block.exercises);
      }
    },
    [activeDayIndex, addExercisesFromBlock]
  );

  const onSubmit = useCallback(
    (formData: RoutineFormData) => {
      // Merge form data with builder state
      const fullData: RoutineFormData = {
        ...formData,
        days: days.map((day) => ({
          day_number: day.day_number,
          name: day.name,
          notes: day.notes,
          exercises: day.exercises.map((ex) => ({
            exercise_id: ex.exercise_id,
            order_index: ex.order_index,
            sets: ex.sets,
            reps: ex.reps,
            rest_seconds: ex.rest_seconds,
            notes: ex.notes,
            superset_group: ex.superset_group,
          })),
        })),
      };

      if (mode === "create") {
        createRoutine.mutate(fullData, {
          onSuccess: () => router.push("/routines"),
        });
      } else if (routine) {
        updateRoutine.mutate(
          { id: routine.id, data: fullData },
          { onSuccess: () => router.push(`/routines/${routine.id}`) }
        );
      }
    },
    [days, mode, routine, createRoutine, updateRoutine, router]
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/routines">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">
          {mode === "create" ? t("addRoutine") : t("editRoutine")}
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
                      <Input placeholder="Push Pull Legs" {...field} />
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <FormField
                  control={form.control}
                  name="duration_weeks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("durationWeeks")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={52}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="days_per_week"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("daysPerWeek")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={7}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("difficulty")}</FormLabel>
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
                          {DIFFICULTY_LEVELS.map((d) => (
                            <SelectItem key={d} value={d}>
                              {t(d as Parameters<typeof t>[0])}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target_gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("targetGender")}</FormLabel>
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
                          <SelectItem value="unisex">{t("unisex")}</SelectItem>
                          <SelectItem value="male">{t("male")}</SelectItem>
                          <SelectItem value="female">{t("female")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_template"
                render={({ field }) => (
                  <FormItem>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-sm">{t("isTemplate")}</span>
                    </label>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Day Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("builder")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Day selector */}
              <div className="flex items-center gap-2 flex-wrap">
                {days.map((day, i) => (
                  <Button
                    key={day.id}
                    type="button"
                    variant={i === activeDayIndex ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveDayIndex(i)}
                  >
                    {t("day", { number: day.day_number })}
                  </Button>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addDay}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {t("addDay")}
                </Button>
              </div>

              {/* Active Day Editor */}
              {activeDay && (
                <div className="space-y-3">
                  {/* Day config */}
                  <div className="flex gap-2">
                    <Input
                      placeholder={t("dayName")}
                      value={activeDay.name}
                      onChange={(e) =>
                        updateDay(activeDayIndex, { name: e.target.value })
                      }
                      className="flex-1"
                    />
                    {days.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive shrink-0"
                        onClick={() => removeDay(activeDayIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Exercises list with drag & drop */}
                  {activeDay.exercises.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground border rounded-lg border-dashed">
                      {t("noExercisesInDay")}
                    </div>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={activeDay.exercises.map((e) => e.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {activeDay.exercises.map((ex, exIndex) => {
                            const inSuperset = ex.superset_group !== null;
                            const prevInSameSuperset =
                              exIndex > 0 &&
                              activeDay.exercises[exIndex - 1].superset_group ===
                                ex.superset_group &&
                              inSuperset;

                            return (
                              <SortableExerciseItem
                                key={ex.id}
                                ex={ex}
                                exIndex={exIndex}
                                activeDayIndex={activeDayIndex}
                                prevInSameSuperset={prevInSameSuperset}
                                locale={locale}
                                t={t}
                                te={te}
                                updateExercise={updateExercise}
                                toggleSuperset={toggleSuperset}
                                removeExercise={removeExercise}
                              />
                            );
                          })}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowPicker(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t("addExercise")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowBlockPicker(true)}
                    >
                      <Puzzle className="mr-2 h-4 w-4" />
                      {tb("insertBlock")}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" asChild>
              <Link href="/routines">{tc("cancel")}</Link>
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
        onSelect={(exercise) => addExercise(activeDayIndex, exercise)}
      />

      {/* Block Picker Modal */}
      <BlockPicker
        open={showBlockPicker}
        onOpenChange={setShowBlockPicker}
        onSelect={handleBlockSelect}
      />
    </div>
  );
}
