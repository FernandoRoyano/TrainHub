"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useConversations } from "@/hooks/use-messages";
import { MessageThread } from "@/components/messages/message-thread";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const t = useTranslations("messages");
  const te = useTranslations("empty");
  const { data: conversations, isLoading } = useConversations();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
        <EmptyState
          icon={MessageCircle}
          emoji={"\uD83D\uDCAC"}
          title={te("messagesTitle")}
          description={te("messagesDescription")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("title")}</h1>

      {/* Mobile layout: show list OR thread */}
      <div className="md:hidden h-[calc(100vh-12rem)]">
        {selectedId ? (
          <div className="h-full border rounded-lg overflow-hidden">
            <button
              onClick={() => setSelectedId(null)}
              className="w-full flex items-center gap-2 p-3 text-sm text-muted-foreground hover:bg-accent border-b"
            >
              ← {t("backToConversations")}
            </button>
            <div className="h-[calc(100%-3rem)]">
              <MessageThread conversationId={selectedId} />
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conv) => {
              const client = conv.client as { id: string; full_name: string } | undefined;
              const initials = client?.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) ?? "?";

              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium truncate">
                      {client?.full_name ?? "Client"}
                    </p>
                    {conv.last_message && (
                      <p className="text-xs text-muted-foreground truncate">
                        {conv.last_message.content}
                      </p>
                    )}
                  </div>
                  {(conv.unread_count ?? 0) > 0 && (
                    <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                      {conv.unread_count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop layout: sidebar + thread */}
      <div className="hidden md:flex gap-4 h-[calc(100vh-12rem)]">
        <div className="w-80 shrink-0 border rounded-lg overflow-y-auto">
          {conversations.map((conv) => {
            const client = conv.client as { id: string; full_name: string; email: string | null } | undefined;
            const initials = client?.full_name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) ?? "?";

            return (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 text-left hover:bg-accent transition-colors border-b last:border-0",
                  selectedId === conv.id && "bg-accent"
                )}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">
                      {client?.full_name ?? "Client"}
                    </p>
                    {(conv.unread_count ?? 0) > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                        {conv.unread_count}
                      </Badge>
                    )}
                  </div>
                  {conv.last_message && (
                    <p className="text-xs text-muted-foreground truncate">
                      {conv.last_message.content}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex-1 border rounded-lg overflow-hidden">
          {selectedId ? (
            <MessageThread conversationId={selectedId} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              {t("selectConversation")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
