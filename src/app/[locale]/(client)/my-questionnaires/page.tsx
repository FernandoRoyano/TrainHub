"use client";

import { useTranslations } from "next-intl";
import { useMyQuestionnaires } from "@/hooks/use-client-app";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { FileQuestion, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function MyQuestionnairesPage() {
  const t = useTranslations("clientApp");
  const { data: questionnaires, isLoading } = useMyQuestionnaires();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">{t("myQuestionnaires")}</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!questionnaires || questionnaires.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">{t("myQuestionnaires")}</h1>
        <EmptyState
          icon={FileQuestion}
          title={t("noQuestionnaires")}
          description={t("noQuestionnairesDescription")}
        />
      </div>
    );
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">{t("pending")}</Badge>;
      case "in_progress":
        return <Badge variant="secondary">{t("inProgress")}</Badge>;
      case "completed":
        return <Badge className="bg-green-600 hover:bg-green-700 text-white">{t("completed")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{t("myQuestionnaires")}</h1>

      {questionnaires.map((q) => (
        <Card key={q.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium truncate">
                    {q.template?.name ?? t("fillQuestionnaire")}
                  </h3>
                  {statusBadge(q.status)}
                </div>
                {q.due_date && (
                  <p className="text-xs text-muted-foreground">
                    {t("dueDate")}: {new Date(q.due_date).toLocaleDateString()}
                  </p>
                )}
                {q.status === "completed" && q.completed_at && (
                  <p className="text-xs text-muted-foreground">
                    {t("completedAt")}: {new Date(q.completed_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div>
                {q.status !== "completed" ? (
                  <Link href={`/my-questionnaires/${q.id}`}>
                    <Button size="sm">{t("fillQuestionnaire")}</Button>
                  </Link>
                ) : (
                  <Link href={`/my-questionnaires/${q.id}`}>
                    <Button size="sm" variant="ghost">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
