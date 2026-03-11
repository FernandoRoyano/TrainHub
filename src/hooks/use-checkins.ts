import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { checkinsService, type CheckinInput } from "@/services/checkins.service";

export function useMyCheckins() {
  return useQuery({
    queryKey: ["my-checkins"],
    queryFn: () => checkinsService.getMyCheckins(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubmitCheckin() {
  const queryClient = useQueryClient();
  const t = useTranslations("checkins");
  return useMutation({
    mutationFn: (input: Omit<CheckinInput, "week_start"> & { week_start?: string }) =>
      checkinsService.submitCheckin(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-checkins"] });
      toast.success(t("submitted"));
    },
    onError: () => {
      toast.error(t("submitError"));
    },
  });
}

export function useClientCheckins(clientId: string) {
  return useQuery({
    queryKey: ["client-checkins", clientId],
    queryFn: () => checkinsService.getClientCheckins(clientId),
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
  });
}
