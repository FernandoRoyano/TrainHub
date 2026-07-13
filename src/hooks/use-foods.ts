"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  foodsService,
  type FoodFilters,
} from "@/services/foods.service";
import { STALE } from "@/lib/query-config";
import { toast } from "sonner";

export function useFoods(filters?: FoodFilters) {
  return useQuery({
    queryKey: ["foods", filters],
    queryFn: () => foodsService.getFoods(filters),
    // Catálogo casi estático; las mutaciones propias invalidan ["foods"]
    staleTime: STALE.catalog,
    placeholderData: keepPreviousData,
  });
}

export function useCreateFood() {
  const queryClient = useQueryClient();
  const t = useTranslations("nutrition");
  return useMutation({
    mutationFn: foodsService.createFood,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      toast.success(t("foodCreated"));
    },
    onError: () => {
      toast.error(t("errorCreatingFood"));
    },
  });
}
