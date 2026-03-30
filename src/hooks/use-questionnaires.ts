"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { questionnairesService } from "@/services/questionnaires.service";
import type {
  QuestionnaireTemplateFormData,
  AssignQuestionnaireData,
} from "@/lib/validations/questionnaire";
import { toast } from "sonner";

export function useQuestionnaireTemplates() {
  return useQuery({
    queryKey: ["questionnaire-templates"],
    queryFn: () => questionnairesService.getTemplates(),
    staleTime: 60 * 1000,
  });
}

export function useQuestionnaireTemplate(id: string) {
  return useQuery({
    queryKey: ["questionnaire-templates", id],
    queryFn: () => questionnairesService.getTemplateById(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useCreateQuestionnaireTemplate() {
  const queryClient = useQueryClient();
  const t = useTranslations("questionnaires");
  return useMutation({
    mutationFn: (data: QuestionnaireTemplateFormData) =>
      questionnairesService.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionnaire-templates"] });
      toast.success(t("templateCreated"));
    },
    onError: () => {
      toast.error(t("templateCreateError"));
    },
  });
}

export function useUpdateQuestionnaireTemplate() {
  const queryClient = useQueryClient();
  const t = useTranslations("questionnaires");
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: QuestionnaireTemplateFormData;
    }) => questionnairesService.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionnaire-templates"] });
      toast.success(t("templateUpdated"));
    },
    onError: () => {
      toast.error(t("templateUpdateError"));
    },
  });
}

export function useDeleteQuestionnaireTemplate() {
  const queryClient = useQueryClient();
  const t = useTranslations("questionnaires");
  return useMutation({
    mutationFn: (id: string) => questionnairesService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionnaire-templates"] });
      toast.success(t("templateDeleted"));
    },
    onError: () => {
      toast.error(t("templateDeleteError"));
    },
  });
}

export function useDuplicateQuestionnaireTemplate() {
  const queryClient = useQueryClient();
  const t = useTranslations("questionnaires");
  return useMutation({
    mutationFn: (id: string) =>
      questionnairesService.duplicateTemplate(id, t("copySuffix")),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionnaire-templates"] });
      toast.success(t("templateDuplicated"));
    },
    onError: () => {
      toast.error(t("templateDuplicateError"));
    },
  });
}

export function useAssignQuestionnaire() {
  const queryClient = useQueryClient();
  const t = useTranslations("questionnaires");
  return useMutation({
    mutationFn: (data: AssignQuestionnaireData) =>
      questionnairesService.assignToClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-questionnaires"],
      });
      queryClient.invalidateQueries({
        queryKey: ["questionnaire-templates"],
      });
      toast.success(t("questionnaireAssigned"));
    },
    onError: () => {
      toast.error(t("questionnaireAssignError"));
    },
  });
}

export function useClientQuestionnaires(clientId: string) {
  return useQuery({
    queryKey: ["client-questionnaires", clientId],
    queryFn: () => questionnairesService.getClientQuestionnaires(clientId),
    enabled: !!clientId,
    staleTime: 30 * 1000,
  });
}
