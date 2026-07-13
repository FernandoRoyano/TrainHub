import { createClient } from "@/lib/supabase/client";
import type { PaymentFormData, PaymentMethod, PaymentStatus } from "@/lib/validations/payment";

export interface ClientPayment {
  id: string;
  client_id: string;
  trainer_id: string;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  description: string | null;
  payment_date: string;
  period_start: string | null;
  period_end: string | null;
  next_payment_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentsSummary {
  totalPaid: number;
  lastPaymentDate: string | null;
  nextPaymentDate: string | null;
  currency: string;
}

export const paymentsService = {
  async getClientPayments(clientId: string) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("client_payments")
      .select("*")
      .eq("client_id", clientId)
      .eq("trainer_id", user.id)
      .order("payment_date", { ascending: false });
    if (error) throw error;
    return data as ClientPayment[];
  },

  async createPayment(clientId: string, formData: PaymentFormData) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("client_payments")
      .insert({
        client_id: clientId,
        trainer_id: user.id,
        amount: formData.amount,
        currency: formData.currency || "EUR",
        payment_method: formData.payment_method,
        status: formData.status,
        description: formData.description || null,
        payment_date: formData.payment_date,
        period_start: formData.period_start || null,
        period_end: formData.period_end || null,
        next_payment_date: formData.next_payment_date || null,
        notes: formData.notes || null,
      })
      .select()
      .single();
    if (error) throw error;
    return data as ClientPayment;
  },

  async updatePayment(id: string, formData: PaymentFormData) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("client_payments")
      .update({
        amount: formData.amount,
        currency: formData.currency || "EUR",
        payment_method: formData.payment_method,
        status: formData.status,
        description: formData.description || null,
        payment_date: formData.payment_date,
        period_start: formData.period_start || null,
        period_end: formData.period_end || null,
        next_payment_date: formData.next_payment_date || null,
        notes: formData.notes || null,
      })
      .eq("id", id)
      .eq("trainer_id", user.id)
      .select()
      .single();
    if (error) throw error;
    return data as ClientPayment;
  },

  async deletePayment(id: string) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("client_payments")
      .delete()
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },

  async getUpcomingPayments() {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const todayStr = today.toISOString().split("T")[0];
    const nextWeekStr = nextWeek.toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("client_payments")
      .select("*")
      .eq("trainer_id", user.id)
      .gte("next_payment_date", todayStr)
      .lte("next_payment_date", nextWeekStr)
      .order("next_payment_date", { ascending: true });
    if (error) throw error;
    return data as ClientPayment[];
  },

  async getPaymentsSummary(clientId: string): Promise<PaymentsSummary> {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    // Get total paid
    const { data: paidPayments, error: paidError } = await supabase
      .from("client_payments")
      .select("amount, currency")
      .eq("client_id", clientId)
      .eq("trainer_id", user.id)
      .eq("status", "paid");
    if (paidError) throw paidError;

    const totalPaid = (paidPayments ?? []).reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );
    const currency = paidPayments?.[0]?.currency ?? "EUR";

    // Get last payment date
    const { data: lastPayment } = await supabase
      .from("client_payments")
      .select("payment_date")
      .eq("client_id", clientId)
      .eq("trainer_id", user.id)
      .eq("status", "paid")
      .order("payment_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Get next payment date
    const { data: nextPayment } = await supabase
      .from("client_payments")
      .select("next_payment_date")
      .eq("client_id", clientId)
      .eq("trainer_id", user.id)
      .not("next_payment_date", "is", null)
      .order("next_payment_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    return {
      totalPaid,
      lastPaymentDate: lastPayment?.payment_date ?? null,
      nextPaymentDate: nextPayment?.next_payment_date ?? null,
      currency,
    };
  },
};
