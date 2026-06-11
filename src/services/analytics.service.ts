import { createClient } from "@/lib/supabase/client";
import { localDateString, localWeekStartMonday, parseLocalDate } from "@/lib/local-date";

export interface AnalyticsData {
  clientGrowth: { date: string; count: number }[];
  workoutVolumeTrend: { week: string; totalVolume: number; sessions: number }[];
  retentionRate: { week: string; active: number; total: number; rate: number }[];
  topExercises: { name: string; totalSets: number }[];
  clientDistribution: { status: string; count: number }[];
  weeklyComparison: {
    thisWeek: { sessions: number; volume: number; activeClients: number };
    lastWeek: { sessions: number; volume: number; activeClients: number };
  };
}

export const analyticsService = {
  async getAnalytics(days: number = 90): Promise<AnalyticsData> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoff = localDateString(cutoffDate);

    // Semana empezando en lunes, como el resto de la app (dashboard, checkins)
    const now = new Date();
    const startOfThisWeek = parseLocalDate(localWeekStartMonday(now));
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    // Parallel queries
    const [
      clientsResult,
      workoutLogsResult,
      exerciseLogsResult,
      clientStatusResult,
    ] = await Promise.all([
      // All clients with created_at
      supabase
        .from("clients")
        .select("id, status, created_at")
        .eq("trainer_id", user.id)
        .order("created_at", { ascending: true }),

      // Workout logs for the period
      supabase
        .from("workout_logs")
        .select("id, client_id, date, completed, client_routine_id")
        .gte("date", cutoff)
        .eq("completed", true),

      // Exercise logs del periodo seleccionado, con fecha y cliente del workout
      // (antes era una muestra arbitraria de todo el histórico, sin filtro de
      // fechas ni de trainer, y sin forma de calcular volumen por semana)
      supabase
        .from("exercise_logs")
        .select(
          "sets_completed, weight_used, workout_log:workout_logs!inner(date, client_id), routine_exercise:routine_exercises(exercise:exercises(name))"
        )
        .gte("workout_log.date", cutoff)
        .limit(5000),

      // Client status distribution
      supabase
        .from("clients")
        .select("status")
        .eq("trainer_id", user.id),
    ]);

    const clients = clientsResult.data ?? [];
    const workoutLogs = workoutLogsResult.data ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exerciseLogs = (exerciseLogsResult.data ?? []) as any[];
    const clientStatuses = clientStatusResult.data ?? [];

    // Filter workout logs to only this trainer's clients
    const clientIds = new Set(clients.map((c) => c.id));
    const trainerWorkouts = workoutLogs.filter((w) => clientIds.has(w.client_id));
    const trainerExerciseLogs = exerciseLogs.filter((el) =>
      clientIds.has(el.workout_log?.client_id)
    );
    const volumeOf = (el: { weight_used: number | null; sets_completed: number | null }) =>
      (el.weight_used ?? 0) * (el.sets_completed ?? 0);
    const weekKeyOf = (dateStr: string) => localWeekStartMonday(parseLocalDate(dateStr));

    // --- Client Growth (cumulative by week) ---
    const clientGrowth: { date: string; count: number }[] = [];
    const weekMap = new Map<string, number>();
    for (const c of clients) {
      const key = localWeekStartMonday(new Date(c.created_at));
      weekMap.set(key, (weekMap.get(key) ?? 0) + 1);
    }
    let cumulative = 0;
    for (const [week, count] of Array.from(weekMap.entries()).sort()) {
      cumulative += count;
      clientGrowth.push({ date: week, count: cumulative });
    }
    // Keep last 12 entries
    const recentGrowth = clientGrowth.slice(-12);

    // --- Workout Volume Trend (by week) ---
    const volumeByWeek = new Map<string, { volume: number; sessions: number }>();
    for (const w of trainerWorkouts) {
      const key = weekKeyOf(w.date);
      const existing = volumeByWeek.get(key) ?? { volume: 0, sessions: 0 };
      existing.sessions++;
      volumeByWeek.set(key, existing);
    }
    // Volumen real (peso x series) por semana — antes nunca se acumulaba y la
    // gráfica mostraba siempre 0
    for (const el of trainerExerciseLogs) {
      const date = el.workout_log?.date;
      if (!date) continue;
      const key = weekKeyOf(date);
      const existing = volumeByWeek.get(key) ?? { volume: 0, sessions: 0 };
      existing.volume += volumeOf(el);
      volumeByWeek.set(key, existing);
    }
    const workoutVolumeTrend = Array.from(volumeByWeek.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([week, data]) => ({
        week,
        totalVolume: Math.round(data.volume),
        sessions: data.sessions,
      }));

    // --- Retention Rate (weekly active / total) ---
    const retentionByWeek = new Map<string, Set<string>>();
    for (const w of trainerWorkouts) {
      const key = weekKeyOf(w.date);
      if (!retentionByWeek.has(key)) retentionByWeek.set(key, new Set());
      retentionByWeek.get(key)!.add(w.client_id);
    }
    // Sin el "|| 1": con 0 activos pero logs históricos producía tasas >100%
    const totalActive = clients.filter((c) => c.status === "active").length;
    const retentionRate = Array.from(retentionByWeek.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([week, activeSet]) => ({
        week,
        active: activeSet.size,
        total: totalActive,
        rate: totalActive > 0 ? Math.round((activeSet.size / totalActive) * 100) : 0,
      }));

    // --- Top Exercises (solo clientes del trainer y dentro del periodo) ---
    const exerciseCount = new Map<string, number>();
    for (const el of trainerExerciseLogs) {
      const name = el.routine_exercise?.exercise?.name;
      if (name) {
        exerciseCount.set(name, (exerciseCount.get(name) ?? 0) + el.sets_completed);
      }
    }
    const topExercises = Array.from(exerciseCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, totalSets]) => ({ name, totalSets }));

    // --- Client Distribution ---
    const statusCount = new Map<string, number>();
    for (const c of clientStatuses) {
      statusCount.set(c.status, (statusCount.get(c.status) ?? 0) + 1);
    }
    const clientDistribution = Array.from(statusCount.entries())
      .map(([status, count]) => ({ status, count }));

    // --- Weekly Comparison ---
    const thisWeekWorkouts = trainerWorkouts.filter(
      (w) => parseLocalDate(w.date) >= startOfThisWeek
    );
    const lastWeekWorkouts = trainerWorkouts.filter((w) => {
      const d = parseLocalDate(w.date);
      return d >= startOfLastWeek && d < startOfThisWeek;
    });

    const volumeInRange = (from: Date, to: Date | null) =>
      Math.round(
        trainerExerciseLogs.reduce((sum, el) => {
          const dateStr = el.workout_log?.date;
          if (!dateStr) return sum;
          const d = parseLocalDate(dateStr);
          if (d < from || (to && d >= to)) return sum;
          return sum + volumeOf(el);
        }, 0)
      );

    const totalActiveClients = totalActive;

    const weeklyComparison = {
      thisWeek: {
        sessions: thisWeekWorkouts.length,
        volume: volumeInRange(startOfThisWeek, null),
        activeClients: totalActiveClients,
      },
      lastWeek: {
        sessions: lastWeekWorkouts.length,
        volume: volumeInRange(startOfLastWeek, startOfThisWeek),
        activeClients: totalActiveClients,
      },
    };

    return {
      clientGrowth: recentGrowth,
      workoutVolumeTrend,
      retentionRate,
      topExercises,
      clientDistribution,
      weeklyComparison,
    };
  },
};
