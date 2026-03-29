"use client";

import { useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { messagesService, type Message } from "@/services/messages.service";
import { toast } from "sonner";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => messagesService.getConversations(),
    staleTime: 30 * 1000,
  });
}

export function useMessages(conversationId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => messagesService.getMessages(conversationId),
    enabled: !!conversationId,
    refetchInterval: false,
  });

  // Subscribe to realtime messages
  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = messagesService.subscribeToMessages(
      conversationId,
      (newMessage: Message) => {
        queryClient.setQueryData(
          ["messages", conversationId],
          (old: Message[] | undefined) => {
            if (!old) return [newMessage];
            // Avoid duplicates
            if (old.some((m) => m.id === newMessage.id)) return old;
            return [...old, newMessage];
          }
        );
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    );

    return unsubscribe;
  }, [conversationId, queryClient]);

  return query;
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const t = useTranslations("messages");
  return useMutation({
    mutationFn: ({
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    }) => messagesService.sendMessage(conversationId, content),
    onSuccess: (msg, variables) => {
      queryClient.setQueryData(
        ["messages", msg.conversation_id],
        (old: Message[] | undefined) => {
          if (!old) return [msg];
          if (old.some((m) => m.id === msg.id)) return old;
          return [...old, msg];
        }
      );
      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      // Fire-and-forget email notification
      fetch("/api/notifications/unread-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: msg.conversation_id,
          messageContent: variables.content,
        }),
      }).catch(() => {});
    },
    onError: () => {
      toast.error(t("sendError"));
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) =>
      messagesService.markAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useStartConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientId: string) =>
      messagesService.getOrCreateConversation(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useClientConversation() {
  return useQuery({
    queryKey: ["client-conversation"],
    queryFn: () => messagesService.getClientConversation(),
    staleTime: 30 * 1000,
  });
}
