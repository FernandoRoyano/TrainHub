"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  clientsService,
  type ClientFilters,
  type TimelineEvent,
  type ClientCompliance,
  type ClientWorkoutHistoryItem,
} from "@/services/clients.service";
import type { ClientFormData } from "@/lib/validations/client";
import { toast } from "sonner";

export function useClients(filters?: ClientFilters) {
  return useQuery({
    queryKey: ["clients", filters],
    queryFn: () => clientsService.getClients(filters),
    staleTime: 30 * 1000,
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => clientsService.getClientById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function useClientStats() {
  return useQuery({
    queryKey: ["clients", "stats"],
    queryFn: () => clientsService.getClientStats(),
    staleTime: 60 * 1000,
  });
}

export function useClientsActivity(clientIds: string[]) {
  return useQuery({
    queryKey: ["clients", "activity", clientIds],
    queryFn: () => clientsService.getClientsActivity(clientIds),
    staleTime: 2 * 60 * 1000,
    enabled: clientIds.length > 0,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  const t = useTranslations("clients");
  return useMutation({
    mutationFn: (data: ClientFormData) => clientsService.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success(t("clientCreated"));
    },
    onError: (error: Error) => {
      if (error.message === "CLIENT_LIMIT_REACHED") {
        toast.error(t("clientLimitReachedToast"));
      } else {
        toast.error(t("clientCreateError"));
      }
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  const t = useTranslations("clients");
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClientFormData> }) =>
      clientsService.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success(t("clientUpdated"));
    },
    onError: () => {
      toast.error(t("clientUpdateError"));
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  const t = useTranslations("clients");
  return useMutation({
    mutationFn: (id: string) => clientsService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success(t("clientDeleted"));
    },
    onError: () => {
      toast.error(t("clientDeleteError"));
    },
  });
}

export function useInviteClient() {
  const queryClient = useQueryClient();
  const t = useTranslations("clients");
  return useMutation({
    mutationFn: async (clientId: string) => {
      const res = await fetch("/api/invite-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Invite failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success(t("inviteSent"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("inviteError"));
    },
  });
}

export function useGenerateInviteLink() {
  const t = useTranslations("clients");
  return useMutation({
    mutationFn: async (clientId: string) => {
      const res = await fetch("/api/generate-invite-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      return res.json();
    },
    onSuccess: async (data: { link: string }) => {
      // iOS Safari bloquea el clipboard si no está en el gesto de usuario
      // original. Aquí el fetch async corta el gesto, así que envolvemos en
      // try/catch y mostramos el link en el toast para copia manual.
      let copied = false;
      try {
        await navigator.clipboard?.writeText(data.link);
        copied = true;
      } catch {
        copied = false;
      }
      toast.success(copied ? t("inviteLinkCopied") : t("inviteLinkCopyManually"), {
        description: data.link,
        duration: copied ? 4000 : 15000,
      });
    },
    onError: (error: Error) => {
      if (error.message === "Client already has an account") {
        toast.info(t("clientAlreadyRegistered"));
      } else {
        toast.error(t("inviteLinkError"));
      }
    },
  });
}

export function useClientTimeline(clientId: string) {
  return useQuery<TimelineEvent[]>({
    queryKey: ["client-timeline", clientId],
    queryFn: () => clientsService.getClientTimeline(clientId),
    enabled: !!clientId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useClientWorkoutHistory(clientId: string) {
  return useQuery<ClientWorkoutHistoryItem[]>({
    queryKey: ["client-workout-history", clientId],
    queryFn: () => clientsService.getClientWorkoutHistory(clientId),
    enabled: !!clientId,
    staleTime: 60 * 1000,
  });
}

export function useClientCompliance(clientId: string) {
  return useQuery<ClientCompliance>({
    queryKey: ["client-compliance", clientId],
    queryFn: () => clientsService.getClientCompliance(clientId),
    enabled: !!clientId,
    staleTime: 60 * 1000,
  });
}
