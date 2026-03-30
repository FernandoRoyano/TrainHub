"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  createQuestionnaireTemplateSchema,
  QUESTION_TYPES,
  QUESTIONNAIRE_CATEGORIES,
  type QuestionnaireTemplateFormData,
  type QuestionType,
} from "@/lib/validations/questionnaire";
import {
  useCreateQuestionnaireTemplate,
  useUpdateQuestionnaireTemplate,
} from "@/hooks/use-questionnaires";
import type { QuestionnaireTemplate } from "@/services/questionnaires.service";
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
import { Switch } from "@/components/ui/switch";
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
import {
  Loader2,
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  X,
} from "lucide-react";
import Link from "next/link";

interface QuestionnaireTemplateFormProps {
  mode: "create" | "edit";
  template?: QuestionnaireTemplate;
}

/* ── Sortable question row ────────────────────────────────── */
function SortableQuestionItem({
  id,
  index,
  remove,
  form,
  t,
}: {
  id: string;
  index: number;
  remove: (index: number) => void;
  form: ReturnType<typeof useForm<QuestionnaireTemplateFormData>>;
  t: ReturnType<typeof useTranslations>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const questionType = form.watch(`questions.${index}.question_type`);
  const needsOptions = questionType === "select" || questionType === "multi_select";
  const isScale = questionType === "scale";

  return (
    <div ref={setNodeRef} style={style} className="border rounded-lg p-4 space-y-3 bg-card">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        <span className="text-sm font-medium text-muted-foreground">
          #{index + 1}
        </span>

        <div className="flex-1" />

        <FormField
          control={form.control}
          name={`questions.${index}.is_required`}
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormLabel className="text-xs">{t("required")}</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={() => remove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Question text */}
      <FormField
        control={form.control}
        name={`questions.${index}.question_text`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("questionText")}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t("questionText")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Question type */}
      <FormField
        control={form.control}
        name={`questions.${index}.question_type`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("questionType")}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {QUESTION_TYPES.map((qt) => (
                  <SelectItem key={qt} value={qt}>
                    {t(`type_${qt}` as Parameters<typeof t>[0])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Options for select / multi_select */}
      {needsOptions && (
        <QuestionOptions form={form} questionIndex={index} t={t} />
      )}

      {/* Config for scale */}
      {isScale && (
        <ScaleConfig form={form} questionIndex={index} t={t} />
      )}
    </div>
  );
}

/* ── Options sub-form ─────────────────────────────────────── */
function QuestionOptions({
  form,
  questionIndex,
  t,
}: {
  form: ReturnType<typeof useForm<QuestionnaireTemplateFormData>>;
  questionIndex: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `questions.${questionIndex}.options`,
  });

  return (
    <div className="space-y-2 pl-6 border-l-2 border-muted">
      <p className="text-sm font-medium">{t("options")}</p>
      {fields.map((opt, optIdx) => (
        <div key={opt.id} className="flex items-center gap-2">
          <FormField
            control={form.control}
            name={`questions.${questionIndex}.options.${optIdx}.value`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input {...field} placeholder={t("optionValue")} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`questions.${questionIndex}.options.${optIdx}.label`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input {...field} placeholder={t("optionLabel")} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => remove(optIdx)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ value: "", label: "" })}
      >
        <Plus className="mr-1 h-3 w-3" />
        {t("addOption")}
      </Button>
    </div>
  );
}

/* ── Scale config sub-form ────────────────────────────────── */
function ScaleConfig({
  form,
  questionIndex,
  t,
}: {
  form: ReturnType<typeof useForm<QuestionnaireTemplateFormData>>;
  questionIndex: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const configPath = `questions.${questionIndex}.config` as const;

  // Initialize config if missing
  useEffect(() => {
    const current = form.getValues(configPath);
    if (!current || typeof current !== "object") {
      form.setValue(configPath, { min: 1, max: 10, minLabel: "", maxLabel: "" });
    }
  }, [form, configPath]);

  const config = (form.watch(configPath) as Record<string, unknown>) ?? {};

  return (
    <div className="space-y-2 pl-6 border-l-2 border-muted">
      <p className="text-sm font-medium">{t("scaleConfig")}</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground">{t("minValue")}</label>
          <Input
            type="number"
            value={(config.min as number) ?? 1}
            onChange={(e) =>
              form.setValue(configPath, {
                ...config,
                min: Number(e.target.value),
              })
            }
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">{t("maxValue")}</label>
          <Input
            type="number"
            value={(config.max as number) ?? 10}
            onChange={(e) =>
              form.setValue(configPath, {
                ...config,
                max: Number(e.target.value),
              })
            }
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">{t("minLabel")}</label>
          <Input
            value={(config.minLabel as string) ?? ""}
            onChange={(e) =>
              form.setValue(configPath, {
                ...config,
                minLabel: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">{t("maxLabel")}</label>
          <Input
            value={(config.maxLabel as string) ?? ""}
            onChange={(e) =>
              form.setValue(configPath, {
                ...config,
                maxLabel: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

/* ── Main form ────────────────────────────────────────────── */
export function QuestionnaireTemplateForm({
  mode,
  template,
}: QuestionnaireTemplateFormProps) {
  const t = useTranslations("questionnaires");
  const tc = useTranslations("common");
  const tv = useTranslations("validation");
  const router = useRouter();

  const createTemplate = useCreateQuestionnaireTemplate();
  const updateTemplate = useUpdateQuestionnaireTemplate();
  const isSaving = createTemplate.isPending || updateTemplate.isPending;

  const schema = createQuestionnaireTemplateSchema(tv);

  const form = useForm<QuestionnaireTemplateFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: template?.name ?? "",
      description: template?.description ?? "",
      category: template?.category ?? undefined,
      questions:
        (template?.questions?.map((q) => ({
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options ?? [],
          is_required: q.is_required,
          order_index: q.order_index,
          config: q.config ?? {},
        })) ?? []) as QuestionnaireTemplateFormData["questions"],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
    move: moveQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questionFields.findIndex((f) => f.id === active.id);
    const newIndex = questionFields.findIndex((f) => f.id === over.id);
    moveQuestion(oldIndex, newIndex);
  }

  function addQuestion() {
    appendQuestion({
      question_text: "",
      question_type: "text" as QuestionType,
      is_required: false,
      order_index: questionFields.length,
      options: undefined,
      config: undefined,
    });
  }

  function onSubmit(data: QuestionnaireTemplateFormData) {
    // Re-index order
    const normalized = {
      ...data,
      questions: data.questions.map((q, i) => ({ ...q, order_index: i })),
    };

    if (mode === "edit" && template) {
      updateTemplate.mutate(
        { id: template.id, data: normalized },
        { onSuccess: () => router.push("/questionnaires") }
      );
    } else {
      createTemplate.mutate(normalized, {
        onSuccess: () => router.push("/questionnaires"),
      });
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back link */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/questionnaires">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {tc("back")}
        </Link>
      </Button>

      <h1 className="text-2xl font-bold">
        {mode === "create" ? t("addTemplate") : t("editTemplate")}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Metadata card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("name")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t("description")}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("category")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("category")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {QUESTIONNAIRE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {t(`category_${cat}` as Parameters<typeof t>[0])}
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

          {/* Questions card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{t("questions")}</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                <Plus className="mr-1 h-4 w-4" />
                {t("addQuestion")}
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {questionFields.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  {t("addQuestion")}
                </p>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={questionFields.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {questionFields.map((field, index) => (
                      <SortableQuestionItem
                        key={field.id}
                        id={field.id}
                        index={index}
                        remove={removeQuestion}
                        form={form}
                        t={t}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" asChild>
              <Link href="/questionnaires">{tc("cancel")}</Link>
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {tc("save")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
