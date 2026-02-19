"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useBlocks } from "@/hooks/use-blocks";
import { blocksService, type ExerciseBlock } from "@/services/blocks.service";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Puzzle } from "lucide-react";

interface BlockPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (block: ExerciseBlock) => void;
}

const blockTypeColors: Record<string, string> = {
  warmup: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  cooldown: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  circuit: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  custom: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export function BlockPicker({ open, onOpenChange, onSelect }: BlockPickerProps) {
  const t = useTranslations("blocks");
  const tc = useTranslations("common");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useBlocks({
    search: debouncedSearch,
    block_type: typeFilter === "all" ? undefined : typeFilter,
  });

  const blocks = data?.data ?? [];

  async function handleSelect(block: ExerciseBlock) {
    setLoading(true);
    try {
      const fullBlock = await blocksService.getBlockById(block.id);
      onSelect(fullBlock);
      onOpenChange(false);
      setSearch("");
      setTypeFilter("all");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("pickBlock")}</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={tc("search") + "..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
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

        <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : blocks.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Puzzle className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">{t("noBlocks")}</p>
            </div>
          ) : (
            blocks.map((block) => (
              <button
                key={block.id}
                type="button"
                disabled={loading}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left disabled:opacity-50"
                onClick={() => handleSelect(block)}
              >
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Puzzle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{block.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1 py-0 ${blockTypeColors[block.block_type] || ""}`}
                    >
                      {t(block.block_type as Parameters<typeof t>[0])}
                    </Badge>
                    {block.description && (
                      <span className="text-[10px] text-muted-foreground truncate">
                        {block.description}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
