"use client";

import { useParams } from "next/navigation";
import { useQuestionnaireTemplate } from "@/hooks/use-questionnaires";
import { QuestionnaireTemplateForm } from "@/components/questionnaires/questionnaire-template-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditQuestionnairePage() {
  const params = useParams();
  const templateId = params.templateId as string;
  const { data: template, isLoading } = useQuestionnaireTemplate(templateId);

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!template) return null;

  return <QuestionnaireTemplateForm mode="edit" template={template} />;
}
