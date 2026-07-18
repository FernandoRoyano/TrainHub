import { createClient } from "@/lib/supabase/client";

// Mismo umbral que la lista de clientes (client-list.tsx).
export const INACTIVE_THRESHOLD_DAYS = 7;
// Rutinas que terminan dentro de esta ventana (el cron avisa a 2 días; aquí
// damos un poco más de margen para que el entrenador se anticipe).
const ROUTINE_ENDING_DAYS = 3;

export interface InactiveItem {
  clientId: string;
  clientName: string;
  daysSinceAccess: number | null; // null = nunca ha entrado
}

export interface PaymentActionItem {
  clientId: string;
  clientName: string;
  amount: number;
  currency: string;
  nextPaymentDate: string;
  overdue: boolean;
}

export interface ReviewItem {
  clientId: string;
  clientName: string;
  reviewDate: string;
}

export interface RoutineEndingItem {
  clientId: string;
  clientName: string;
  routineName: string | null;
  endDate: string;
}

export interface ActionItems {
  inactive: InactiveItem[];
  paymentsOverdue: PaymentActionItem[];
  paymentsDueSoon: PaymentActionItem[];
  reviews: ReviewItem[];
  routinesEnding: RoutineEndingItem[];
  total: number;
}

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

export const actionCenterService = {
  async getActionItems(): Promise<ActionItems> {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const dueSoonLimit = new Date(today);
    dueSoonLimit.setDate(dueSoonLimit.getDate() + 7);
    const dueSoonStr = dueSoonLimit.toISOString().split("T")[0];
    const endingLimit = new Date(today);
    endingLimit.setDate(endingLimit.getDate() + ROUTINE_ENDING_DAYS);
    const endingStr = endingLimit.toISOString().split("T")[0];

    // Clientes activos con su último acceso (heartbeat). Si la columna
    // last_active_at no existe (migración 00048 sin aplicar), se degrada a una
    // lista sin inactividad para no romper la página.
    const clientsPromise = supabase
      .from("clients")
      .select("id, full_name, last_active_at")
      .eq("trainer_id", user.id)
      .eq("status", "active");

    // Pagos programados hasta +7 días (excluye cancelados). Se clasifican luego
    // en vencidos vs próximos.
    const paymentsPromise = supabase
      .from("client_payments")
      .select("client_id, amount, currency, next_payment_date, status")
      .eq("trainer_id", user.id)
      .not("next_payment_date", "is", null)
      .neq("status", "cancelled")
      .lte("next_payment_date", dueSoonStr);

    // Revisiones de hoy o vencidas sin cerrar.
    const reviewsPromise = supabase
      .from("client_routines")
      .select("client_id, review_date")
      .eq("trainer_id", user.id)
      .eq("status", "active")
      .not("review_date", "is", null)
      .lte("review_date", todayStr);

    // Rutinas activas que terminan pronto.
    const endingPromise = supabase
      .from("client_routines")
      .select("client_id, end_date, routines(name)")
      .eq("trainer_id", user.id)
      .eq("status", "active")
      .not("end_date", "is", null)
      .gte("end_date", todayStr)
      .lte("end_date", endingStr);

    const [clientsRes, paymentsRes, reviewsRes, endingRes] = await Promise.all([
      clientsPromise,
      paymentsPromise,
      reviewsPromise,
      endingPromise,
    ]);

    // Inactivos: activos que nunca han entrado o llevan >= umbral sin abrir la app.
    const inactive: InactiveItem[] = [];
    if (!clientsRes.error) {
      for (const c of (clientsRes.data ?? []) as {
        id: string;
        full_name: string;
        last_active_at: string | null;
      }[]) {
        const d = daysSince(c.last_active_at);
        if (d === null || d >= INACTIVE_THRESHOLD_DAYS) {
          inactive.push({ clientId: c.id, clientName: c.full_name, daysSinceAccess: d });
        }
      }
      inactive.sort((a, b) => (b.daysSinceAccess ?? 9999) - (a.daysSinceAccess ?? 9999));
    }

    // Pagos: quedarse con el pago más reciente (mayor next_payment_date) por
    // cliente para no duplicar, y clasificar vencido vs próximo.
    const latestByClient = new Map<
      string,
      { amount: number; currency: string; next_payment_date: string }
    >();
    for (const p of (paymentsRes.data ?? []) as {
      client_id: string;
      amount: number | string;
      currency: string | null;
      next_payment_date: string;
      status: string;
    }[]) {
      const prev = latestByClient.get(p.client_id);
      if (!prev || p.next_payment_date > prev.next_payment_date) {
        latestByClient.set(p.client_id, {
          amount: Number(p.amount) || 0,
          currency: p.currency ?? "EUR",
          next_payment_date: p.next_payment_date,
        });
      }
    }
    const paymentsOverdue: PaymentActionItem[] = [];
    const paymentsDueSoon: PaymentActionItem[] = [];
    for (const [clientId, p] of latestByClient) {
      const item: PaymentActionItem = {
        clientId,
        clientName: "",
        amount: p.amount,
        currency: p.currency,
        nextPaymentDate: p.next_payment_date,
        overdue: p.next_payment_date < todayStr,
      };
      (item.overdue ? paymentsOverdue : paymentsDueSoon).push(item);
    }

    const reviews: ReviewItem[] = ((reviewsRes.data ?? []) as {
      client_id: string;
      review_date: string;
    }[]).map((r) => ({ clientId: r.client_id, clientName: "", reviewDate: r.review_date }));

    const routinesEnding: RoutineEndingItem[] = ((endingRes.data ?? []) as {
      client_id: string;
      end_date: string;
      routines: unknown;
    }[]).map((r) => ({
      clientId: r.client_id,
      clientName: "",
      routineName: (r.routines as { name: string } | null)?.name ?? null,
      endDate: r.end_date,
    }));

    // Nombres para los buckets que no vienen de `clients` directamente.
    const needNames = new Set<string>();
    [...paymentsOverdue, ...paymentsDueSoon, ...reviews, ...routinesEnding].forEach((i) =>
      needNames.add(i.clientId)
    );
    if (needNames.size > 0) {
      const { data: names } = await supabase
        .from("clients")
        .select("id, full_name")
        .in("id", Array.from(needNames));
      const nameMap = new Map<string, string>();
      for (const n of (names ?? []) as { id: string; full_name: string }[]) {
        nameMap.set(n.id, n.full_name);
      }
      const fill = (arr: { clientId: string; clientName: string }[]) =>
        arr.forEach((i) => (i.clientName = nameMap.get(i.clientId) ?? "—"));
      fill(paymentsOverdue);
      fill(paymentsDueSoon);
      fill(reviews);
      fill(routinesEnding);
    }

    const total =
      inactive.length +
      paymentsOverdue.length +
      paymentsDueSoon.length +
      reviews.length +
      routinesEnding.length;

    return { inactive, paymentsOverdue, paymentsDueSoon, reviews, routinesEnding, total };
  },
};
