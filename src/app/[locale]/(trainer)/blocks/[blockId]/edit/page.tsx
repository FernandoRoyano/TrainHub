"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBlock } from "@/hooks/use-blocks";
import { BlockBuilder } from "@/components/blocks/block-builder";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditBlockPage() {
  const { blockId } = useParams<{ blockId: string }>();
  const tc = useTranslations("common");
  const { data: block, isLoading } = useBlock(blockId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!block) {
    return <p className="text-muted-foreground">{tc("notFound")}</p>;
  }

  return <BlockBuilder mode="edit" block={block} />;
}
