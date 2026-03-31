import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = (key: string, values?: any) => string;

export const paymentMethods = [
  "bizum",
  "transfer",
  "cash",
  "card",
  "paypal",
  "other",
] as const;

export const paymentStatuses = [
  "paid",
  "pending",
  "overdue",
  "cancelled",
] as const;

export type PaymentMethod = (typeof paymentMethods)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];

export function createPaymentSchema(t: T) {
  return z.object({
    amount: z.number().min(0.01, t("minAmount")),
    currency: z.string().default("EUR"),
    payment_method: z.enum(paymentMethods),
    status: z.enum(paymentStatuses).default("paid"),
    description: z.string().optional().or(z.literal("")),
    payment_date: z.string().min(1, t("required")),
    period_start: z.string().optional().or(z.literal("")),
    period_end: z.string().optional().or(z.literal("")),
    next_payment_date: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
  });
}

export type PaymentFormData = z.infer<ReturnType<typeof createPaymentSchema>>;
