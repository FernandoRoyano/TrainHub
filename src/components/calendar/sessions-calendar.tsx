"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  isToday,
} from "date-fns";
import { useCalendarEvents } from "@/hooks/use-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Check, Clock } from "lucide-react";
import type { CalendarEvent } from "@/services/calendar.service";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function SessionsCalendar() {
  const t = useTranslations("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = format(startOfMonth(currentMonth), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(currentMonth), "yyyy-MM-dd");

  const { data: events, isLoading } = useCalendarEvents(monthStart, monthEnd);

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Monday-based offset (0=Mon ... 6=Sun)
  const startOffset = useMemo(() => {
    const d = getDay(startOfMonth(currentMonth));
    return d === 0 ? 6 : d - 1;
  }, [currentMonth]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events ?? []) {
      const key = ev.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    return map;
  }, [events]);

  const selectedEvents = useMemo(() => {
    if (!selectedDate) return [];
    const key = format(selectedDate, "yyyy-MM-dd");
    return eventsByDate.get(key) ?? [];
  }, [selectedDate, eventsByDate]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="pt-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground py-1"
              >
                {t(`weekday_${day.toLowerCase()}` as Parameters<typeof t>[0])}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for offset */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="h-14" />
            ))}

            {days.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const dayEvents = eventsByDate.get(dateStr);
              const hasEvents = !!dayEvents && dayEvents.length > 0;
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(day)}
                  className={`h-14 rounded-md flex flex-col items-center justify-start pt-1 text-sm transition-colors relative ${
                    isSelected
                      ? "ring-2 ring-primary bg-primary/5"
                      : isToday(day)
                        ? "border-2 border-primary"
                        : "hover:bg-muted/50"
                  }`}
                >
                  <span
                    className={`text-xs ${isToday(day) ? "font-bold" : ""}`}
                  >
                    {format(day, "d")}
                  </span>
                  {hasEvents && (
                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <div
                          key={ev.id}
                          className={`h-1.5 w-1.5 rounded-full ${
                            ev.completed ? "bg-green-500" : "bg-amber-500"
                          }`}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[8px] text-muted-foreground">
                          +{dayEvents.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          {t("completed")}
        </span>
        <span className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-amber-500" />
          {t("inProgress")}
        </span>
      </div>

      {/* Selected Day Details */}
      {selectedDate && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {format(selectedDate, "EEEE, d MMMM yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEvents.length === 0 ? (
              <div className="text-center py-4">
                <span className="text-5xl inline-block transition-transform hover:animate-bounce cursor-default">{"\uD83D\uDCC5"}</span>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("noSessions")}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{ev.client_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ev.routine_name}
                        {ev.day_name
                          ? ` - ${ev.day_name}`
                          : ev.day_number
                            ? ` - Day ${ev.day_number}`
                            : ""}
                      </p>
                    </div>
                    <Badge
                      variant={ev.completed ? "default" : "secondary"}
                      className="shrink-0"
                    >
                      {ev.completed ? (
                        <>
                          <Check className="mr-1 h-3 w-3" />
                          {t("completed")}
                        </>
                      ) : (
                        <>
                          <Clock className="mr-1 h-3 w-3" />
                          {t("inProgress")}
                        </>
                      )}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
