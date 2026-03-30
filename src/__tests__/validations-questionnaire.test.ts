import { describe, it, expect } from "vitest";
import {
  createQuestionnaireTemplateSchema,
  questionSchema,
  assignQuestionnaireSchema,
  questionnaireResponseSchema,
  QUESTION_TYPES,
} from "@/lib/validations/questionnaire";

const mockT = (key: string, values?: Record<string, unknown>) =>
  values ? `${key}: ${JSON.stringify(values)}` : key;

describe("Questionnaire template schema", () => {
  const schema = createQuestionnaireTemplateSchema(mockT);

  it("accepts valid template data", () => {
    const result = schema.safeParse({
      name: "Intake Form",
      description: "Initial client questionnaire",
      category: "general",
      questions: [
        {
          question_text: "How old are you?",
          question_type: "number",
          is_required: true,
          order_index: 0,
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = schema.safeParse({
      description: "No name",
      questions: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects name shorter than 2 chars", () => {
    const result = schema.safeParse({
      name: "A",
      questions: [],
    });
    expect(result.success).toBe(false);
  });

  it("accepts template with empty questions array", () => {
    const result = schema.safeParse({
      name: "Empty Form",
      questions: [],
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional description as empty string", () => {
    const result = schema.safeParse({
      name: "My Form",
      description: "",
      questions: [],
    });
    expect(result.success).toBe(true);
  });

  it("accepts all valid categories", () => {
    for (const cat of ["medical", "goals", "lifestyle", "nutrition", "general"]) {
      const result = schema.safeParse({
        name: "Test Form",
        category: cat,
        questions: [],
      });
      expect(result.success).toBe(true);
    }
  });
});

describe("Question schema", () => {
  it("accepts a valid question", () => {
    const result = questionSchema.safeParse({
      question_text: "What is your goal?",
      question_type: "text",
      is_required: true,
      order_index: 0,
    });
    expect(result.success).toBe(true);
  });

  it("accepts all 8 question types", () => {
    for (const type of QUESTION_TYPES) {
      const result = questionSchema.safeParse({
        question_text: "Test question",
        question_type: type,
        is_required: false,
        order_index: 0,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid question type", () => {
    const result = questionSchema.safeParse({
      question_text: "Test",
      question_type: "invalid_type",
      is_required: true,
      order_index: 0,
    });
    expect(result.success).toBe(false);
  });

  it("accepts options for select type", () => {
    const result = questionSchema.safeParse({
      question_text: "Pick one",
      question_type: "select",
      is_required: true,
      order_index: 0,
      options: [
        { value: "a", label: "Option A" },
        { value: "b", label: "Option B" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("accepts options for multi_select type", () => {
    const result = questionSchema.safeParse({
      question_text: "Pick many",
      question_type: "multi_select",
      is_required: false,
      order_index: 1,
      options: [
        { value: "x", label: "X" },
        { value: "y", label: "Y" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("accepts scale type with config", () => {
    const result = questionSchema.safeParse({
      question_text: "Rate your pain",
      question_type: "scale",
      is_required: true,
      order_index: 0,
      config: { min: 1, max: 10, step: 1 },
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty question_text", () => {
    const result = questionSchema.safeParse({
      question_text: "",
      question_type: "text",
      is_required: true,
      order_index: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative order_index", () => {
    const result = questionSchema.safeParse({
      question_text: "Test",
      question_type: "text",
      is_required: true,
      order_index: -1,
    });
    expect(result.success).toBe(false);
  });
});

describe("Questionnaire response schema", () => {
  const uuid = "550e8400-e29b-41d4-a716-446655440000";

  it("accepts text answer", () => {
    const result = questionnaireResponseSchema.safeParse({
      question_id: uuid,
      answer_text: "I want to lose weight",
    });
    expect(result.success).toBe(true);
  });

  it("accepts number answer", () => {
    const result = questionnaireResponseSchema.safeParse({
      question_id: uuid,
      answer_number: 42,
    });
    expect(result.success).toBe(true);
  });

  it("accepts boolean answer", () => {
    const result = questionnaireResponseSchema.safeParse({
      question_id: uuid,
      answer_boolean: true,
    });
    expect(result.success).toBe(true);
  });

  it("accepts date answer", () => {
    const result = questionnaireResponseSchema.safeParse({
      question_id: uuid,
      answer_date: "2024-01-15",
    });
    expect(result.success).toBe(true);
  });

  it("accepts json answer", () => {
    const result = questionnaireResponseSchema.safeParse({
      question_id: uuid,
      answer_json: { selected: ["a", "b"] },
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid question_id (not UUID)", () => {
    const result = questionnaireResponseSchema.safeParse({
      question_id: "not-a-uuid",
      answer_text: "test",
    });
    expect(result.success).toBe(false);
  });
});

describe("Assign questionnaire schema", () => {
  const uuid = "550e8400-e29b-41d4-a716-446655440000";

  it("accepts valid assignment data", () => {
    const result = assignQuestionnaireSchema.safeParse({
      client_id: uuid,
      template_id: uuid,
    });
    expect(result.success).toBe(true);
  });

  it("requires client_id", () => {
    const result = assignQuestionnaireSchema.safeParse({
      template_id: uuid,
    });
    expect(result.success).toBe(false);
  });

  it("requires template_id", () => {
    const result = assignQuestionnaireSchema.safeParse({
      client_id: uuid,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-UUID client_id", () => {
    const result = assignQuestionnaireSchema.safeParse({
      client_id: "not-uuid",
      template_id: uuid,
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional due_date and notes", () => {
    const result = assignQuestionnaireSchema.safeParse({
      client_id: uuid,
      template_id: uuid,
      due_date: "2024-12-31",
      notes: "Please complete before next session",
    });
    expect(result.success).toBe(true);
  });
});
