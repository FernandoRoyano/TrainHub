"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useBlocks, useDeleteBlock } from "@/hooks/use-blocks";
import { useDebounce } from "@/hooks/use-debounce";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, MoreVertical, Pencil, Trash2, Puzzle } from "lucide-react";
import Link from "next/link";

const blockTypeColors: Record<string, string> = {
  warmup: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  cooldown: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  circuit: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  custom: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export function BlockList() {
  const t = useTranslations("blocks");
  const tc = useTranslations("common");
  const te = useTranslations("empty");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useBlocks({
    search: debouncedSearch,
    block_type: typeFilter === "all" ? undefined : typeFilter,
  });
  const deleteBlock = useDeleteBlock();

  const blocks = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button asChild>
          <Link href="/blocks/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("addBlock")}
          </Link>
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={tc("search") + "..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allTypes")}</SelectItem>
            <SelectItem value="warmup">{t("warmup")}</SelectItem>
            <SelectItem value="cooldown">{t("cooldown")}</SelectItem>
            <SelectItem value="circuit">{t("circuit")}</SelectItem>
            <SelectItem value="custom">{t("custom")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {blocks.length === 0 ? (
        <EmptyState
          icon={Puzzle}
          emoji={"\uD83E\uDDE9"}
          title={te("blocksTitle")}
          description={te("blocksDescription")}
          actionLabel={t("addBlock")}
          actionHref="/blocks/new"
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {blocks.map((block) => (
            <Card
              key={block.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => router.push(`/blocks/${block.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{block.name}</p>
                    {block.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {block.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className={blockTypeColors[block.block_type] || ""}
                      >
                        {t(block.block_type as Parameters<typeof t>[0])}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/blocks/${block.id}/edit`);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        {tc("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(block.id);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {tc("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title={tc("delete")}
        description={t("deleteConfirm")}
        onConfirm={() => {
          if (deleteId) {
            deleteBlock.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
          }
        }}
        isLoading={deleteBlock.isPending}
      />
    </div>
  );
}
