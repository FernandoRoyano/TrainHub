"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Play, Loader2, Youtube, Globe } from "lucide-react";

// Curated trusted fitness channels
const FAVORITE_CHANNELS: { id: string; name: string; handle: string }[] = [
  { id: "UCVvPWaVaIEyabfjCgNP-q-A", name: "Ritual Gym Global", handle: "@RitualGymGlobal" },
  // Add more here as you discover them
];

interface VideoSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (videoUrl: string) => void;
  defaultQuery?: string;
}

interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  url: string;
  embedUrl: string;
  publishedAt: string;
}

function useYouTubeSearch(query: string, channelId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["youtube-search", query, channelId],
    queryFn: async (): Promise<YouTubeVideo[]> => {
      if (!query || query.length < 2) return [];
      const params = new URLSearchParams({ q: query });
      if (channelId) params.set("channelId", channelId);
      const res = await fetch(`/api/youtube/search?${params}`);
      if (!res.ok) throw new Error("YouTube search failed");
      const data = await res.json();
      return data.videos ?? [];
    },
    enabled: enabled && query.length >= 2,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function VideoSearchDialog({
  open,
  onOpenChange,
  onSelect,
  defaultQuery = "",
}: VideoSearchDialogProps) {
  const t = useTranslations("exercises");
  const [search, setSearch] = useState(defaultQuery);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const { data: videos, isLoading, error } = useYouTubeSearch(
    debouncedSearch,
    selectedChannel,
    open
  );

  function handleSelect(video: YouTubeVideo) {
    onSelect(video.url);
    onOpenChange(false);
    setSearch("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-500" />
            {t("searchVideoTitle")}
          </DialogTitle>
          <DialogDescription>{t("searchVideoDesc")}</DialogDescription>
        </DialogHeader>

        {/* Channel filter */}
        <div className="flex gap-1.5 flex-wrap">
          <Button
            type="button"
            variant={selectedChannel === null ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => setSelectedChannel(null)}
          >
            <Globe className="h-3 w-3" />
            {t("allChannels")}
          </Button>
          {FAVORITE_CHANNELS.map((ch) => (
            <Button
              key={ch.id}
              type="button"
              variant={selectedChannel === ch.id ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => setSelectedChannel(ch.id)}
            >
              <Youtube className="h-3 w-3 text-red-500" />
              {ch.name}
            </Button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchVideoPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoading && debouncedSearch.length >= 2 && (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {t("searchingVideo")}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-video w-full" />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-sm text-destructive">
              {t("videoSearchError")}
            </div>
          )}

          {!isLoading && !error && debouncedSearch.length < 2 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              {t("searchVideoHint")}
            </div>
          )}

          {!isLoading && !error && videos && videos.length === 0 && debouncedSearch.length >= 2 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              {t("noVideoResults")}
            </div>
          )}

          {videos && videos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {videos.map((video) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => handleSelect(video)}
                  className="group text-left rounded-lg overflow-hidden border hover:border-primary hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="relative aspect-video bg-muted">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                      <Play className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="white" />
                    </div>
                  </div>
                  <div className="p-2 space-y-0.5">
                    <p className="text-sm font-medium line-clamp-2 leading-tight">{video.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{video.channel}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
