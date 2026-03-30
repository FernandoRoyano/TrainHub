"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useClientTimeline } from "@/hooks/use-clients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Calendar,
  ClipboardList,
  Ruler,
  FileText,
  UserPlus,
  Filter,
} from "lucide-react";

interface HistoryTabProps {
  clientId: string;
}

const typeConfig: Record<
  string,
  { color: string; bgColor: string; icon: React.ElementType; label: string }
> = {
  routine_assigned: {
    color: "text-blue-400",
    bgColor: "bg-blue-500",
    icon: ClipboardList,
    label: "routine",
  },
  measurement_taken: {
    color: "text-purple-400",
    bgColor: "bg-purple-500",
    icon: Ruler,
    label: "measurement",
  },
  note_added: {
    color: "text-amber-400",
    bgColor: "bg-amber-500",
    icon: FileText,
    label: "note",
  },
  client_created: {
    color: "text-emerald-400",
    bgColor: "bg-emerald-500",
    icon: UserPlus,
    label: "created",
  },
};

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 30) return `${diffDays}d`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo`;
}

export function HistoryTab({ clientId }: HistoryTabProps) {
  const t = useTranslations("historyTab");
  const { data: timeline, isLoading } = useClientTimeline(clientId);
  const [filter, setFilter] = useState<string | null>(null);

  const eventTypes = useMemo(() => {
    if (!timeline) return [];
    const types = new Set(timeline.map((e) => e.type));
    return Array.from(types);
  }, [timeline]);

  const filteredTimeline = useMemo(() => {
    if (!timeline) return [];
    if (!filter) return timeline;
    return timeline.filter((e) => e.type === filter);
  }, [timeline, filter]);

  function getEventDescription(event: { type: string; description: string }) {
    switch (event.type) {
      case "routine_assigned":
        return t("eventRoutineAssigned", { name: event.description });
      case "measurement_taken":
        return t("eventMeasurementTaken");
      case "note_added":
        return t("eventNoteAdded", { title: event.description });
      case "client_created":
        return t("eventClientCreated");
      default:
        return event.description;
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!timeline || timeline.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title={t("noHistory")}
        description={t("noHistoryDescription")}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      {eventTypes.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Button
            variant={filter === null ? "default" : "outline"}
            size="sm"
            className="text-xs h-7"
            onClick={() => setFilter(null)}
          >
            {t("all")}
          </Button>
          {eventTypes.map((type) => {
            const config = typeConfig[type];
            return (
              <Button
                key={type}
                variant={filter === type ? "default" : "outline"}
                size="sm"
                className="text-xs h-7"
                onClick={() => setFilter(filter === type ? null : type)}
              >
                {t(config?.label ?? type)}
              </Button>
            );
          })}
        </div>
      )}

      {/* Timeline */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />

            <div className="space-y-4">
              {filteredTimeline.map((event) => {
                const config = typeConfig[event.type];
                const Icon = config?.icon ?? Calendar;
                return (
                  <div key={`${event.type}-${event.id}`} className="relative flex gap-3">
                    {/* Dot */}
                    <div
                      className={`relative z-10 flex items-center justify-center h-6 w-6 rounded-full ${config?.bgColor ?? "bg-zinc-500"} shrink-0`}
                    >
                      <Icon className="h-3 w-3 text-white" />
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm leading-tight">
                          {getEventDescription(event)}
                        </p>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {t(config?.label ?? event.type)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(event.timestamp)} · {formatRelativeTime(event.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
