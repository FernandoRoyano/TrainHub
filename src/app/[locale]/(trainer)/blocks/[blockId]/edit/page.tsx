"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBlock } from "@/hooks/use-blocks";
import { BlockBuilder } from "@/components/blocks/block-builder";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/shared/query-error-state";

export default function EditBlockPage() {
  const { blockId } = useParams<{ blockId: string }>();
  const tc = useTranslations("common");
  const { data: block, isLoading, isError, refetch, isRefetching } = useBlock(blockId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return <QueryErrorState onRetry={() => refetch()} isRetrying={isRefetching} />;
  }

  if (!block) {
    return <p className="text-muted-foreground">{tc("notFound")}</p>;
  }

  return <BlockBuilder mode="edit" block={block} />;
}
