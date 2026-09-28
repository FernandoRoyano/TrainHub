"use client";

import { FeatureGate } from "@/components/shared/feature-gate";
import { useTranslations } from "next-intl";
import { useClientConversation } from "@/hooks/use-messages";
import { MessageThread } from "@/components/messages/message-thread";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { QueryErrorState } from "@/components/shared/query-error-state";
import { MessageCircle } from "lucide-react";
import { ClientSectionHeader } from "@/components/shared/client-section-header";

function MyMessagesPageContent() {
  const t = useTranslations("messages");
  const te = useTranslations("empty");
  const tx = useTranslations("clientExperience");
  const { data: conversation, isLoading, isError, refetch, isRefetching } = useClientConversation();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Un fallo de red no es "todavía no tienes conversación"
  if (isError) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold mb-4">{t("title")}</h1>
        <QueryErrorState onRetry={() => refetch()} isRetrying={isRefetching} />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold mb-4">{t("title")}</h1>
        <EmptyState
          icon={MessageCircle}
          title={te("messagesTitle")}
          description={te("clientMessagesDescription")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ClientSectionHeader
        icon={MessageCircle}
        eyebrow={tx("messagesEyebrow")}
        title={t("title")}
        description={tx("messagesDescription")}
      />
      <div className="h-[calc(100vh-20rem)] min-h-[420px] overflow-hidden rounded-3xl border border-border/60 bg-card/45 shadow-xl shadow-background/20">
        <MessageThread conversationId={conversation.id} />
      </div>
    </div>
  );
}

export default function MyMessagesPage() {
  return (
    <FeatureGate feature="messaging">
      <MyMessagesPageContent />
    </FeatureGate>
  );
}
