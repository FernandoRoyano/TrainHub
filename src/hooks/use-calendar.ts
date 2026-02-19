"use client";

import { useQuery } from "@tanstack/react-query";
import { calendarService } from "@/services/calendar.service";

export function useCalendarEvents(monthStart: string, monthEnd: string) {
  return useQuery({
    queryKey: ["calendar-events", monthStart, monthEnd],
    queryFn: () =>
      calendarService.getTrainerCalendarEvents(monthStart, monthEnd),
    enabled: !!monthStart && !!monthEnd,
  });
}
