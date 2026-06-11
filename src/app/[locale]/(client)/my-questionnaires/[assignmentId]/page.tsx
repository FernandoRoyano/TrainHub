"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  useMyQuestionnaireDetail,
  useSubmitQuestionnaireResponses,
} from "@/hooks/use-client-app";
import type { QuestionnaireQuestion } from "@/services/questionnaires.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AnswerMap = Record<
  string,
  {
    answer_text?: string | null;
    answer_number?: number | null;
    answer_boolean?: boolean | null;
    answer_date?: string | null;
    answer_json?: Record<string, unknown> | null;
  }
>;

export default function QuestionnaireFormPage() {
  const params = useParams();
  const assignmentId = params.assignmentId as string;
  const router = useRouter();
  const t = useTranslations("clientApp");

  const { data: detail, isLoading } = useMyQuestionnaireDetail(assignmentId);
  const submitMutation = useSubmitQuestionnaireResponses();

  const [answers, setAnswers] = useState<AnswerMap>({});
  const isCompleted = detail?.status === "completed";

  // Pre-fill existing responses
  useEffect(() => {
    if (detail?.responses && detail.responses.length > 0) {
      const existing: AnswerMap = {};
      for (const r of detail.responses) {
        existing[r.question_id] = {
          answer_text: r.answer_text,
          answer_number: r.answer_number,
          answer_boolean: r.answer_boolean,
          answer_date: r.answer_date,
          answer_json: r.answer_json,
        };
      }
      setAnswers(existing);
    }
  }, [detail?.responses]);

  const updateAnswer = (questionId: string, partial: Partial<AnswerMap[string]>) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], ...partial },
    }));
  };

  const handleSubmit = () => {
    if (!detail?.template?.questions) return;

    const responses = detail.template.questions.map((q) => ({
      question_id: q.id,
      answer_text: answers[q.id]?.answer_text ?? null,
      answer_number: answers[q.id]?.answer_number ?? null,
      answer_boolean: answers[q.id]?.answer_boolean ?? null,
      answer_date: answers[q.id]?.answer_date ?? null,
      answer_json: answers[q.id]?.answer_json ?? null,
    }));

    submitMutation.mutate(
      { clientQuestionnaireId: assignmentId, responses },
      { onSuccess: () => router.push("/my-questionnaires") }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!detail) return null;

  const questions = detail.template?.questions ?? [];

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/my-questionnaires")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("back")}
        </Button>
      </div>

      <div>
        <h1 className="text-xl font-bold">
          {detail.template?.name ?? t("fillQuestionnaire")}
        </h1>
        {detail.template?.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {detail.template.description}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {questions.map((question, idx) => (
          <Card key={question.id}>
            <CardContent className="p-4 space-y-2">
              <Label className="text-sm font-medium">
                {idx + 1}. {question.question_text}
                {question.is_required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </Label>
              <QuestionInput
                question={question}
                value={answers[question.id]}
                onChange={(val) => updateAnswer(question.id, val)}
                disabled={isCompleted}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {!isCompleted && questions.length > 0 && (
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={submitMutation.isPending}
        >
          {submitMutation.isPending && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}
          {t("submitQuestionnaire")}
        </Button>
      )}
    </div>
  );
}

function QuestionInput({
  question,
  value,
  onChange,
  disabled,
}: {
  question: QuestionnaireQuestion;
  value: AnswerMap[string] | undefined;
  onChange: (val: Partial<AnswerMap[string]>) => void;
  disabled: boolean;
}) {
  const tc = useTranslations("common");
  const type = question.question_type;
  const options = question.options ?? [];
  const config = question.config ?? {};

  switch (type) {
    case "text":
      return (
        <Input
          value={value?.answer_text ?? ""}
          onChange={(e) => onChange({ answer_text: e.target.value })}
          disabled={disabled}
        />
      );

    case "textarea":
      return (
        <Textarea
          value={value?.answer_text ?? ""}
          onChange={(e) => onChange({ answer_text: e.target.value })}
          disabled={disabled}
          rows={4}
        />
      );

    case "select":
      return (
        <Select
          value={value?.answer_text ?? ""}
          onValueChange={(v) => onChange({ answer_text: v })}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "multi_select": {
      const selected: string[] =
        (value?.answer_json as { selected?: string[] })?.selected ?? [];
      return (
        <div className="space-y-2">
          {options.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <Checkbox
                id={`${question.id}-${opt.value}`}
                checked={selected.includes(opt.value)}
                disabled={disabled}
                onCheckedChange={(checked) => {
                  const next = checked
                    ? [...selected, opt.value]
                    : selected.filter((s) => s !== opt.value);
                  onChange({ answer_json: { selected: next } });
                }}
              />
              <Label
                htmlFor={`${question.id}-${opt.value}`}
                className="text-sm font-normal"
              >
                {opt.label}
              </Label>
            </div>
          ))}
        </div>
      );
    }

    case "number":
      return (
        <Input
          type="number"
          value={value?.answer_number ?? ""}
          onChange={(e) =>
            onChange({
              answer_number: e.target.value ? Number(e.target.value) : null,
            })
          }
          disabled={disabled}
        />
      );

    case "date":
      return (
        <Input
          type="date"
          value={value?.answer_date ?? ""}
          onChange={(e) => onChange({ answer_date: e.target.value || null })}
          disabled={disabled}
        />
      );

    case "boolean":
      return (
        <div className="flex gap-4">
          {[
            { label: tc("yes"), val: true },
            { label: tc("no"), val: false },
          ].map((opt) => (
            <label
              key={String(opt.val)}
              className={cn(
                "flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-colors",
                value?.answer_boolean === opt.val
                  ? "border-primary bg-primary/10"
                  : "border-border",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <input
                type="radio"
                name={`bool-${question.id}`}
                checked={value?.answer_boolean === opt.val}
                onChange={() => onChange({ answer_boolean: opt.val })}
                disabled={disabled}
                className="sr-only"
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      );

    case "scale": {
      const min = (config.min as number) ?? 1;
      const max = (config.max as number) ?? 10;
      const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      return (
        <div className="flex flex-wrap gap-2">
          {range.map((n) => (
            <label
              key={n}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg border cursor-pointer text-sm font-medium transition-colors",
                value?.answer_number === n
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <input
                type="radio"
                name={`scale-${question.id}`}
                checked={value?.answer_number === n}
                onChange={() => onChange({ answer_number: n })}
                disabled={disabled}
                className="sr-only"
              />
              {n}
            </label>
          ))}
        </div>
      );
    }

    default:
      return (
        <Input
          value={value?.answer_text ?? ""}
          onChange={(e) => onChange({ answer_text: e.target.value })}
          disabled={disabled}
        />
      );
  }
}
