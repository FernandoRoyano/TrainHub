import { createClient } from "@/lib/supabase/client";
import type {
  QuestionnaireTemplateFormData,
  AssignQuestionnaireData,
  QuestionType,
  QuestionnaireCategory,
} from "@/lib/validations/questionnaire";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface QuestionConfig {
  [key: string]: unknown;
}

export interface QuestionnaireQuestion {
  id: string;
  template_id: string;
  question_text: string;
  question_type: QuestionType;
  options: QuestionOption[] | null;
  is_required: boolean;
  order_index: number;
  config: QuestionConfig | null;
}

export interface QuestionnaireTemplate {
  id: string;
  trainer_id: string;
  name: string;
  description: string | null;
  category: QuestionnaireCategory | null;
  created_at: string;
  updated_at: string;
  questions?: QuestionnaireQuestion[];
}

export interface QuestionnaireResponse {
  id: string;
  client_questionnaire_id: string;
  question_id: string;
  answer_text: string | null;
  answer_number: number | null;
  answer_boolean: boolean | null;
  answer_date: string | null;
  answer_json: Record<string, unknown> | null;
  question?: QuestionnaireQuestion;
}

export interface ClientQuestionnaire {
  id: string;
  client_id: string;
  template_id: string;
  trainer_id: string;
  status: string;
  assigned_at: string;
  completed_at: string | null;
  due_date: string | null;
  notes: string | null;
  template?: QuestionnaireTemplate;
  responses?: QuestionnaireResponse[];
}

export const questionnairesService = {
  async getTemplates() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("questionnaire_templates")
      .select("*")
      .eq("trainer_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as QuestionnaireTemplate[];
  },

  async getTemplateById(id: string) {
    const supabase = createClient();

    // Get template
    const { data: template, error: templateError } = await supabase
      .from("questionnaire_templates")
      .select("*")
      .eq("id", id)
      .single();
    if (templateError) throw templateError;

    // Get questions
    const { data: questions, error: questionsError } = await supabase
      .from("questionnaire_questions")
      .select("*")
      .eq("template_id", id)
      .order("order_index", { ascending: true });
    if (questionsError) throw questionsError;

    return {
      ...template,
      questions: (questions ?? []) as QuestionnaireQuestion[],
    } as QuestionnaireTemplate;
  },

  async createTemplate(data: QuestionnaireTemplateFormData) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // 1. Create template
    const { data: template, error: templateError } = await supabase
      .from("questionnaire_templates")
      .insert({
        trainer_id: user.id,
        name: data.name,
        description: data.description || null,
        category: data.category || null,
      })
      .select()
      .single();
    if (templateError) throw templateError;

    // 2. Create questions
    if (data.questions.length > 0) {
      const questionsToInsert = data.questions.map((q) => ({
        template_id: template.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options ?? null,
        is_required: q.is_required,
        order_index: q.order_index,
        config: q.config ?? null,
      }));

      const { error: questionsError } = await supabase
        .from("questionnaire_questions")
        .insert(questionsToInsert);
      if (questionsError) throw questionsError;
    }

    return template as QuestionnaireTemplate;
  },

  async updateTemplate(id: string, data: QuestionnaireTemplateFormData) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // 1. Update template metadata
    const { error: templateError } = await supabase
      .from("questionnaire_templates")
      .update({
        name: data.name,
        description: data.description || null,
        category: data.category || null,
      })
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (templateError) throw templateError;

    // 2. Delete existing questions
    const { error: deleteError } = await supabase
      .from("questionnaire_questions")
      .delete()
      .eq("template_id", id);
    if (deleteError) throw deleteError;

    // 3. Re-create questions
    if (data.questions.length > 0) {
      const questionsToInsert = data.questions.map((q) => ({
        template_id: id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options ?? null,
        is_required: q.is_required,
        order_index: q.order_index,
        config: q.config ?? null,
      }));

      const { error: questionsError } = await supabase
        .from("questionnaire_questions")
        .insert(questionsToInsert);
      if (questionsError) throw questionsError;
    }
  },

  async deleteTemplate(id: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("questionnaire_templates")
      .delete()
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },

  async duplicateTemplate(id: string, copySuffix = "(copia)") {
    const template = await this.getTemplateById(id);
    const formData: QuestionnaireTemplateFormData = {
      name: `${template.name} ${copySuffix}`,
      description: template.description ?? "",
      category: template.category ?? undefined,
      questions: (template.questions ?? []).map((q) => ({
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options ?? undefined,
        is_required: q.is_required,
        order_index: q.order_index,
        config: q.config ?? undefined,
      })),
    };
    return this.createTemplate(formData);
  },

  async assignToClient(data: AssignQuestionnaireData) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: assignment, error } = await supabase
      .from("client_questionnaires")
      .insert({
        client_id: data.client_id,
        template_id: data.template_id,
        trainer_id: user.id,
        due_date: data.due_date || null,
        notes: data.notes || null,
      })
      .select()
      .single();
    if (error) throw error;
    return assignment as ClientQuestionnaire;
  },

  async getClientQuestionnaires(clientId: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("client_questionnaires")
      .select("*, template:questionnaire_templates(id, name, category)")
      .eq("client_id", clientId)
      .eq("trainer_id", user.id)
      .order("assigned_at", { ascending: false });
    if (error) throw error;
    return data as ClientQuestionnaire[];
  },

  async getClientQuestionnaireDetail(id: string) {
    const supabase = createClient();

    // Get client questionnaire
    const { data: clientQ, error: cqError } = await supabase
      .from("client_questionnaires")
      .select("*, template:questionnaire_templates(*)")
      .eq("id", id)
      .single();
    if (cqError) throw cqError;

    // Get questions for the template
    const { data: questions, error: questionsError } = await supabase
      .from("questionnaire_questions")
      .select("*")
      .eq("template_id", clientQ.template_id)
      .order("order_index", { ascending: true });
    if (questionsError) throw questionsError;

    // Get responses
    const { data: responses, error: responsesError } = await supabase
      .from("questionnaire_responses")
      .select("*")
      .eq("client_questionnaire_id", id);
    if (responsesError) throw responsesError;

    // Attach question to each response
    const assembledResponses: QuestionnaireResponse[] = (responses ?? []).map(
      (r) => ({
        ...r,
        question: (questions ?? []).find((q) => q.id === r.question_id) ?? undefined,
      })
    ) as QuestionnaireResponse[];

    return {
      ...clientQ,
      template: {
        ...clientQ.template,
        questions: (questions ?? []) as QuestionnaireQuestion[],
      },
      responses: assembledResponses,
    } as ClientQuestionnaire;
  },
};
