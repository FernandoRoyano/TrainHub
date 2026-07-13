import { createClient } from "@/lib/supabase/client";

export interface CalendarEvent {
  id: string;
  date: string;
  completed: boolean;
  client_name: string;
  client_id: string;
  routine_name: string;
  day_name: string | null;
  day_number: number;
}

export const calendarService = {
  async getTrainerCalendarEvents(
    monthStart: string,
    monthEnd: string
  ): Promise<CalendarEvent[]> {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    // Get all workout logs for this trainer's clients in the date range
    const { data: logs, error } = await supabase
      .from("workout_logs")
      .select(
        `
        id,
        date,
        completed,
        client_id,
        routine_day_id,
        client_routine_id,
        client_routines!inner(
          trainer_id,
          routine:routines(name)
        ),
        clients!inner(full_name),
        routine_day:routine_days(name, day_number)
      `
      )
      .eq("client_routines.trainer_id", user.id)
      .gte("date", monthStart)
      .lte("date", monthEnd)
      .order("date", { ascending: true });

    if (error) throw error;

    return (logs ?? []).map((log: Record<string, unknown>) => {
      const cr = log.client_routines as Record<string, unknown> | null;
      const routine = cr?.routine as Record<string, unknown> | null;
      const client = log.clients as Record<string, unknown> | null;
      const day = log.routine_day as Record<string, unknown> | null;

      return {
        id: log.id as string,
        date: log.date as string,
        completed: log.completed as boolean,
        client_name: (client?.full_name as string) ?? "Client",
        client_id: log.client_id as string,
        routine_name: (routine?.name as string) ?? "Routine",
        day_name: (day?.name as string) ?? null,
        day_number: (day?.day_number as number) ?? 0,
      };
    });
  },
};
