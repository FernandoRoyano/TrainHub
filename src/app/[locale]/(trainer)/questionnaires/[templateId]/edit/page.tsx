"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuestionnaireTemplate } from "@/hooks/use-questionnaires";
import { QuestionnaireTemplateForm } from "@/components/questionnaires/questionnaire-template-form";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/shared/query-error-state";

export default function EditQuestionnairePage() {
  const params = useParams();
  const templateId = params.templateId as string;
  const tc = useTranslations("common");
  const { data: template, isLoading, isError, refetch, isRefetching } =
    useQuestionnaireTemplate(templateId);

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

  if (isError) {
    return <QueryErrorState onRetry={() => refetch()} isRetrying={isRefetching} />;
  }

  if (!template) {
    return <p className="text-muted-foreground">{tc("notFound")}</p>;
  }

  return <QuestionnaireTemplateForm mode="edit" template={template} />;
}
