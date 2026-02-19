"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { sessionNotesService } from "@/services/session-notes.service";
import { toast } from "sonner";

export function useSessionNotes(clientId: string) {
  return useQuery({
    queryKey: ["session-notes", clientId],
    queryFn: () => sessionNotesService.getNotes(clientId),
    enabled: !!clientId,
  });
}

export function useCreateSessionNote() {
  const queryClient = useQueryClient();
  const t = useTranslations("sessionNotes");
  return useMutation({
    mutationFn: (data: {
      client_id: string;
      date: string;
      title?: string;
      content: string;
      tags?: string[];
    }) => sessionNotesService.createNote(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["session-notes", variables.client_id],
      });
      toast.success(t("noteSaved"));
    },
    onError: () => {
      toast.error(t("noteSaveError"));
    },
  });
}

export function useDeleteSessionNote() {
  const queryClient = useQueryClient();
  const t = useTranslations("sessionNotes");
  return useMutation({
    mutationFn: ({ id, clientId }: { id: string; clientId: string }) =>
      sessionNotesService.deleteNote(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["session-notes", variables.clientId],
      });
      toast.success(t("noteDeleted"));
    },
    onError: () => {
      toast.error(t("noteDeleteError"));
    },
  });
}
