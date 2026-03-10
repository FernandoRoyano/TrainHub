import { createClient } from "@/lib/supabase/client";

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
    const cutoff = cutoffDate.toISOString().split("T")[0];

    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);
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

      // Exercise logs with exercise info
      supabase
        .from("exercise_logs")
        .select("sets_completed, weight_used, routine_exercise:routine_exercises(exercise:exercises(name))")
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

    // --- Client Growth (cumulative by week) ---
    const clientGrowth: { date: string; count: number }[] = [];
    const weekMap = new Map<string, number>();
    for (const c of clients) {
      const d = new Date(c.created_at);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().split("T")[0];
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
      const d = new Date(w.date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().split("T")[0];
      const existing = volumeByWeek.get(key) ?? { volume: 0, sessions: 0 };
      existing.sessions++;
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
      const d = new Date(w.date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().split("T")[0];
      if (!retentionByWeek.has(key)) retentionByWeek.set(key, new Set());
      retentionByWeek.get(key)!.add(w.client_id);
    }
    const totalActive = clients.filter((c) => c.status === "active").length || 1;
    const retentionRate = Array.from(retentionByWeek.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([week, activeSet]) => ({
        week,
        active: activeSet.size,
        total: totalActive,
        rate: Math.round((activeSet.size / totalActive) * 100),
      }));

    // --- Top Exercises ---
    const exerciseCount = new Map<string, number>();
    for (const el of exerciseLogs) {
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
    const thisWeekWorkouts = trainerWorkouts.filter((w) => new Date(w.date) >= startOfThisWeek);
    const lastWeekWorkouts = trainerWorkouts.filter((w) => {
      const d = new Date(w.date);
      return d >= startOfLastWeek && d < startOfThisWeek;
    });

    const weeklyComparison = {
      thisWeek: {
        sessions: thisWeekWorkouts.length,
        volume: 0,
        activeClients: new Set(thisWeekWorkouts.map((w) => w.client_id)).size,
      },
      lastWeek: {
        sessions: lastWeekWorkouts.length,
        volume: 0,
        activeClients: new Set(lastWeekWorkouts.map((w) => w.client_id)).size,
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
