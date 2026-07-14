"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useConversations, useStartConversation } from "@/hooks/use-messages";
import { useClients } from "@/hooks/use-clients";
import { MessageThread } from "@/components/messages/message-thread";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const t = useTranslations("messages");
  const te = useTranslations("empty");
  const { data: conversations, isLoading } = useConversations();
  const { data: clientsData } = useClients();
  const startConversation = useStartConversation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);

  const clients = clientsData?.data ?? [];
  const existingClientIds = new Set(
    (conversations ?? []).map((c) => c.client_id)
  );
  const availableClients = clients.filter(
    (c) => !existingClientIds.has(c.id) && c.user_id
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
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
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
          <Button onClick={() => setShowNewChat(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("newConversation")}
          </Button>
        </div>
        <EmptyState
          icon={MessageCircle}
          title={te("messagesTitle")}
          description={te("messagesDescription")}
        />
        <NewChatDialog
          open={showNewChat}
          onOpenChange={setShowNewChat}
          clients={availableClients}
          onSelect={(clientId) => {
            startConversation.mutate(clientId, {
              onSuccess: (conv) => {
                setShowNewChat(false);
                setSelectedId(conv.id);
              },
            });
          }}
          isLoading={startConversation.isPending}
          t={t}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
        {availableClients.length > 0 && (
          <Button size="sm" onClick={() => setShowNewChat(true)}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            {t("newConversation")}
          </Button>
        )}
      </div>

      {/* Mobile layout: show list OR thread */}
      <div className="md:hidden h-[calc(100vh-12rem)]">
        {selectedId ? (
          <div className="h-full border rounded-lg overflow-hidden">
            <button
              onClick={() => setSelectedId(null)}
              className="w-full flex items-center gap-2 p-3 text-sm font-medium text-muted-foreground hover:bg-accent border-b transition-colors active:bg-accent"
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
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent active:scale-[0.98] transition-all"
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
                    <Badge className="h-5 min-w-5 px-1 flex items-center justify-center text-xs">
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
                  "w-full flex items-center gap-3 p-3 text-left hover:bg-accent transition-all border-b last:border-0",
                  selectedId === conv.id && "bg-accent border-l-2 border-l-primary"
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
                      <Badge className="ml-2 h-5 min-w-5 px-1 flex items-center justify-center text-xs">
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

      <NewChatDialog
        open={showNewChat}
        onOpenChange={setShowNewChat}
        clients={availableClients}
        onSelect={(clientId) => {
          startConversation.mutate(clientId, {
            onSuccess: (conv) => {
              setShowNewChat(false);
              setSelectedId(conv.id);
            },
          });
        }}
        isLoading={startConversation.isPending}
        t={t}
      />
    </div>
  );
}

function NewChatDialog({
  open,
  onOpenChange,
  clients,
  onSelect,
  isLoading,
  t,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Array<{ id: string; full_name: string }>;
  onSelect: (clientId: string) => void;
  isLoading: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("newConversation")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {clients.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t("noAvailableClients")}
            </p>
          ) : (
            clients.map((client) => {
              const initials = client.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <button
                  key={client.id}
                  onClick={() => onSelect(client.id)}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{client.full_name}</span>
                </button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
