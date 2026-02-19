"use client";

import { useTranslations } from "next-intl";
import { useClientConversation } from "@/hooks/use-messages";
import { MessageThread } from "@/components/messages/message-thread";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { MessageCircle } from "lucide-react";

export default function MyMessagesPage() {
  const t = useTranslations("messages");
  const { data: conversation, isLoading } = useClientConversation();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
        <EmptyState
          icon={MessageCircle}
          title={t("noMessages")}
          description={t("noMessagesDescription")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <div className="border rounded-lg h-[calc(100vh-12rem)] overflow-hidden">
        <MessageThread conversationId={conversation.id} />
      </div>
    </div>
  );
}
