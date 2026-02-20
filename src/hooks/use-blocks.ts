"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { blocksService, type BlockFilters } from "@/services/blocks.service";
import type { BlockFormData } from "@/lib/validations/block";
import { toast } from "sonner";

export function useBlocks(filters?: BlockFilters) {
  return useQuery({
    queryKey: ["blocks", filters],
    queryFn: () => blocksService.getBlocks(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function useBlock(id: string) {
  return useQuery({
    queryKey: ["blocks", id],
    queryFn: () => blocksService.getBlockById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateBlock() {
  const queryClient = useQueryClient();
  const t = useTranslations("blocks");
  return useMutation({
    mutationFn: (data: BlockFormData) => blocksService.createBlock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocks"] });
      toast.success(t("blockCreated"));
    },
    onError: () => {
      toast.error(t("blockCreateError"));
    },
  });
}

export function useUpdateBlock() {
  const queryClient = useQueryClient();
  const t = useTranslations("blocks");
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BlockFormData }) =>
      blocksService.updateBlock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocks"] });
      toast.success(t("blockUpdated"));
    },
    onError: () => {
      toast.error(t("blockUpdateError"));
    },
  });
}

export function useDeleteBlock() {
  const queryClient = useQueryClient();
  const t = useTranslations("blocks");
  return useMutation({
    mutationFn: (id: string) => blocksService.deleteBlock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocks"] });
      toast.success(t("blockDeleted"));
    },
    onError: () => {
      toast.error(t("blockDeleteError"));
    },
  });
}
