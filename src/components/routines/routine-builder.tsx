"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { createRoutineSchema, type RoutineFormData } from "@/lib/validations/routine";
import { useCreateRoutine, useUpdateRoutine } from "@/hooks/use-routines";
import { useRoutineBuilderStore } from "@/stores/routine-builder-store";
import type { BuilderExercise, GroupType } from "@/stores/routine-builder-store";
import type { Routine } from "@/services/routines.service";
import type { ExerciseBlock } from "@/services/blocks.service";
import { DIFFICULTY_LEVELS } from "@/lib/constants";
import { useUploadMedia } from "@/hooks/use-exercises";
import { ExercisePicker } from "./exercise-picker";
import { ExerciseSidebar } from "./exercise-sidebar";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
  ChevronDown,
  MoreVertical,
  Repeat,
  Timer,
  Zap,
  Layers,
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
    updateDayDescription,
    setActiveDayIndex,
    addExercise,
    removeExercise,
    updateExercise,
    toggleSuperset,
    addExercisesFromBlock,
    reorderExercise,
    addGroup,
    removeGroup,
    updateGroup,
    addExerciseToGroup,
    changeGroupType,
    reset,
  } = useRoutineBuilderStore();

  const [showPicker, setShowPicker] = useState(false);
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [groupPickerIndex, setGroupPickerIndex] = useState<number | null>(null);
  const uploadMedia = useUploadMedia();
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(routine?.cover_image ?? null);

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
      cover_image: routine?.cover_image ?? "",
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
        description: day.description ?? "",
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
      // Merge form data with builder state — normalize order_index by array position
      let globalExIdx = 0;
      const fullData: RoutineFormData = {
        ...formData,
        days: days.map((day) => {
          globalExIdx = 0;
          return {
            day_number: day.day_number,
            name: day.name,
            notes: day.notes,
            description: day.description,
            groups: day.groups.map((g, gi) => ({
              group_type: g.group_type,
              order_index: gi,
              rounds: g.rounds,
              time_limit_seconds: g.time_limit_seconds,
              rest_between_rounds: g.rest_between_rounds,
              label: g.label,
              notes: g.notes,
              exercises: g.exercises.map((ex) => {
                const idx = globalExIdx++;
                return {
                  exercise_id: ex.exercise_id,
                  order_index: idx,
                  sets: ex.sets,
                  reps: ex.reps,
                  rest_seconds: ex.rest_seconds,
                  notes: ex.notes,
                  superset_group: ex.superset_group,
                };
              }),
            })),
            exercises: day.exercises.map((ex, i) => ({
              exercise_id: ex.exercise_id,
              order_index: i,
              sets: ex.sets,
              reps: ex.reps,
              rest_seconds: ex.rest_seconds,
              notes: ex.notes,
              superset_group: ex.superset_group,
            })),
          };
        }),
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
          <div className="flex gap-4">
            {/* Exercise sidebar - desktop only */}
            <div className="hidden lg:block w-[30%] shrink-0">
              <div className="sticky top-20">
                <ExerciseSidebar onSelect={(exercise) => addExercise(activeDayIndex, exercise)} />
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0 space-y-4">
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

              {/* Cover Image */}
              <div>
                <label className="text-sm font-medium">{t("coverImage")}</label>
                <div className="flex items-center gap-4 mt-2">
                  {coverPreview ? (
                    <div className="relative">
                      <img
                        src={coverPreview}
                        alt=""
                        className="h-24 w-40 rounded-lg object-cover border"
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5"
                        onClick={() => {
                          setCoverPreview(null);
                          form.setValue("cover_image", "");
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="h-24 w-40 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/50 transition-colors">
                      {isUploadingCover ? (
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{t("uploadCover")}</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploadingCover(true);
                          try {
                            const url = await uploadMedia.mutateAsync({
                              file,
                              folder: "routine-covers",
                            });
                            setCoverPreview(url);
                            form.setValue("cover_image", url);
                          } finally {
                            setIsUploadingCover(false);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

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

                  {/* Day description */}
                  <div>
                    <label className="text-xs text-muted-foreground">
                      {t("dayDescription")}
                    </label>
                    <Textarea
                      placeholder={t("dayDescriptionPlaceholder")}
                      value={activeDay?.description || ""}
                      onChange={(e) =>
                        updateDayDescription(activeDayIndex, e.target.value)
                      }
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  {/* Group-based exercises */}
                  {activeDay.groups.length === 0 ? (
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
                        <div className="space-y-3">
                          {activeDay.groups.map((group, groupIndex) => {
                            if (group.group_type === "solo") {
                              // Solo: render exercises directly (no group wrapper)
                              return group.exercises.map((ex) => {
                                const flatIndex = activeDay.exercises.findIndex((e) => e.id === ex.id);
                                return (
                                  <SortableExerciseItem
                                    key={ex.id}
                                    ex={ex}
                                    exIndex={flatIndex}
                                    activeDayIndex={activeDayIndex}
                                    prevInSameSuperset={false}
                                    locale={locale}
                                    t={t}
                                    te={te}
                                    updateExercise={updateExercise}
                                    toggleSuperset={toggleSuperset}
                                    removeExercise={removeExercise}
                                  />
                                );
                              });
                            }

                            // Non-solo group rendering
                            const isSuperset = group.group_type === "superset" || group.group_type === "triset";
                            const isTimedGroup = group.group_type === "circuit" || group.group_type === "emom" || group.group_type === "amrap";

                            const groupBadgeColor: Record<string, string> = {
                              superset: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                              triset: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
                              circuit: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                              emom: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
                              amrap: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                            };

                            const groupBorderColor: Record<string, string> = {
                              superset: "border-purple-200 dark:border-purple-800",
                              triset: "border-indigo-200 dark:border-indigo-800",
                              circuit: "border-orange-200 dark:border-orange-800",
                              emom: "border-rose-200 dark:border-rose-800",
                              amrap: "border-emerald-200 dark:border-emerald-800",
                            };

                            const groupLabel: Record<string, string> = {
                              superset: t("supersetGroup"),
                              triset: t("trisetGroup"),
                              circuit: t("circuitGroup"),
                              emom: t("emomGroup"),
                              amrap: t("amrapGroup"),
                            };

                            const groupIcon: Record<string, React.ReactNode> = {
                              superset: <Link2 className="h-3 w-3" />,
                              triset: <Layers className="h-3 w-3" />,
                              circuit: <Repeat className="h-3 w-3" />,
                              emom: <Timer className="h-3 w-3" />,
                              amrap: <Zap className="h-3 w-3" />,
                            };

                            return (
                              <div
                                key={group.id}
                                className={`border-2 rounded-lg p-3 space-y-2 ${groupBorderColor[group.group_type] || "border-muted"}`}
                              >
                                {/* Group header */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${groupBadgeColor[group.group_type] || ""}`}>
                                      {groupIcon[group.group_type]}
                                      {groupLabel[group.group_type] || group.group_type}
                                    </span>
                                    {group.exercises.length > 0 && (
                                      <span className="text-xs text-muted-foreground">
                                        {group.exercises.length} {group.exercises.length === 1 ? "ejercicio" : "ejercicios"}
                                      </span>
                                    )}
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7">
                                        <MoreVertical className="h-3.5 w-3.5" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      {(["superset", "triset", "circuit", "emom", "amrap"] as GroupType[])
                                        .filter((gt) => gt !== group.group_type)
                                        .map((gt) => (
                                          <DropdownMenuItem
                                            key={gt}
                                            onClick={() => changeGroupType(activeDayIndex, groupIndex, gt)}
                                          >
                                            {groupLabel[gt]}
                                          </DropdownMenuItem>
                                        ))}
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => removeGroup(activeDayIndex, groupIndex)}
                                      >
                                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                                        {tc("delete")}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                {/* Group config fields for timed groups */}
                                {isTimedGroup && (
                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <label className="text-xs text-muted-foreground">
                                        {t("roundsLabel")}
                                      </label>
                                      <Input
                                        type="number"
                                        min={1}
                                        max={50}
                                        value={group.rounds ?? ""}
                                        onChange={(e) =>
                                          updateGroup(activeDayIndex, groupIndex, {
                                            rounds: e.target.value ? parseInt(e.target.value) : null,
                                          })
                                        }
                                        placeholder="3"
                                        className="h-8 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-muted-foreground">
                                        {t("timeLimitLabel")}
                                      </label>
                                      <Input
                                        type="number"
                                        min={0}
                                        max={3600}
                                        value={group.time_limit_seconds ?? ""}
                                        onChange={(e) =>
                                          updateGroup(activeDayIndex, groupIndex, {
                                            time_limit_seconds: e.target.value ? parseInt(e.target.value) : null,
                                          })
                                        }
                                        placeholder="60"
                                        className="h-8 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-muted-foreground">
                                        {t("restBetweenRoundsLabel")}
                                      </label>
                                      <Input
                                        type="number"
                                        min={0}
                                        max={600}
                                        value={group.rest_between_rounds ?? ""}
                                        onChange={(e) =>
                                          updateGroup(activeDayIndex, groupIndex, {
                                            rest_between_rounds: e.target.value ? parseInt(e.target.value) : null,
                                          })
                                        }
                                        placeholder="60"
                                        className="h-8 text-sm"
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Superset/triset connecting line indicator */}
                                {isSuperset && group.exercises.length > 1 && (
                                  <div className="flex items-center gap-1 ml-2">
                                    <div className={`w-0.5 h-3 rounded ${group.group_type === "superset" ? "bg-purple-400" : "bg-indigo-400"}`} />
                                    <span className="text-[10px] text-muted-foreground">{t("superset")}</span>
                                  </div>
                                )}

                                {/* Group exercises */}
                                <div className="space-y-2">
                                  {group.exercises.map((ex) => {
                                    const flatIndex = activeDay.exercises.findIndex((e) => e.id === ex.id);
                                    return (
                                      <SortableExerciseItem
                                        key={ex.id}
                                        ex={ex}
                                        exIndex={flatIndex}
                                        activeDayIndex={activeDayIndex}
                                        prevInSameSuperset={false}
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

                                {/* Add exercise to group button */}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="w-full border border-dashed"
                                  onClick={() => {
                                    setGroupPickerIndex(groupIndex);
                                    setShowPicker(true);
                                  }}
                                >
                                  <Plus className="h-3.5 w-3.5 mr-1" />
                                  {t("addExercise")}
                                </Button>
                              </div>
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
                      className="flex-1 lg:hidden"
                      onClick={() => {
                        setGroupPickerIndex(null);
                        setShowPicker(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t("addExercise")}
                    </Button>

                    {/* Add Group dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" variant="outline" className="flex-1">
                          <Layers className="mr-2 h-4 w-4" />
                          {t("addGroup")}
                          <ChevronDown className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => addGroup(activeDayIndex, "superset")}>
                          <Link2 className="h-3.5 w-3.5 mr-2" />
                          Superserie
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addGroup(activeDayIndex, "triset")}>
                          <Layers className="h-3.5 w-3.5 mr-2" />
                          Triserie
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addGroup(activeDayIndex, "circuit")}>
                          <Repeat className="h-3.5 w-3.5 mr-2" />
                          Circuito
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addGroup(activeDayIndex, "emom")}>
                          <Timer className="h-3.5 w-3.5 mr-2" />
                          EMOM
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addGroup(activeDayIndex, "amrap")}>
                          <Zap className="h-3.5 w-3.5 mr-2" />
                          AMRAP
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

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
            </div>{/* end main content */}
          </div>{/* end flex layout */}
        </form>
      </Form>

      {/* Exercise Picker Modal */}
      <ExercisePicker
        open={showPicker}
        onOpenChange={(open) => {
          setShowPicker(open);
          if (!open) setGroupPickerIndex(null);
        }}
        onSelect={(exercise) => {
          if (groupPickerIndex !== null) {
            addExerciseToGroup(activeDayIndex, groupPickerIndex, exercise);
          } else {
            addExercise(activeDayIndex, exercise);
          }
        }}
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
