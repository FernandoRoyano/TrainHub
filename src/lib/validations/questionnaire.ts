import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = (key: string, values?: any) => string;

export const QUESTION_TYPES = ["text", "textarea", "select", "multi_select", "number", "date", "boolean", "scale"] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export const QUESTIONNAIRE_CATEGORIES = ["medical", "goals", "lifestyle", "nutrition", "general"] as const;
export type QuestionnaireCategory = (typeof QUESTIONNAIRE_CATEGORIES)[number];

export const questionOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const questionSchema = z.object({
  question_text: z.string().min(1),
  question_type: z.enum(QUESTION_TYPES),
  options: z.array(questionOptionSchema).optional(),
  is_required: z.boolean(),
  order_index: z.number().int().min(0),
  config: z.record(z.string(), z.unknown()).optional(),
});

export function createQuestionnaireTemplateSchema(t: T) {
  return z.object({
    name: z.string().min(2, t("minChars", { min: 2 })),
    description: z.string().optional().or(z.literal("")),
    category: z.enum(QUESTIONNAIRE_CATEGORIES).optional(),
    questions: z.array(questionSchema),
  });
}

export const assignQuestionnaireSchema = z.object({
  client_id: z.string().uuid(),
  template_id: z.string().uuid(),
  due_date: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export const questionnaireResponseSchema = z.object({
  question_id: z.string().uuid(),
  answer_text: z.string().optional().or(z.literal("")),
  answer_number: z.number().optional().nullable(),
  answer_boolean: z.boolean().optional().nullable(),
  answer_date: z.string().optional().or(z.literal("")),
  answer_json: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type QuestionnaireTemplateFormData = z.infer<ReturnType<typeof createQuestionnaireTemplateSchema>>;
export type QuestionData = z.infer<typeof questionSchema>;
export type QuestionOptionData = z.infer<typeof questionOptionSchema>;
export type AssignQuestionnaireData = z.infer<typeof assignQuestionnaireSchema>;
export type QuestionnaireResponseData = z.infer<typeof questionnaireResponseSchema>;
