"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  createPaymentSchema,
  paymentMethods,
  paymentStatuses,
  type PaymentFormData,
} from "@/lib/validations/payment";
import type { ClientPayment } from "@/services/payments.service";

interface RegisterPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PaymentFormData) => void;
  isLoading?: boolean;
  payment?: ClientPayment | null;
}

export function RegisterPaymentDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  payment,
}: RegisterPaymentDialogProps) {
  const t = useTranslations("payments");
  const tVal = useTranslations("validation");

  const schema = createPaymentSchema(tVal);
  const isEdit = !!payment;

  type FormData = z.infer<ReturnType<typeof createPaymentSchema>>;
  const form = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      amount: payment?.amount ?? 0,
      currency: payment?.currency ?? "EUR",
      payment_method: payment?.payment_method ?? "bizum",
      status: payment?.status ?? "paid",
      description: payment?.description ?? "",
      payment_date:
        payment?.payment_date ?? new Date().toISOString().split("T")[0],
      period_start: payment?.period_start ?? "",
      period_end: payment?.period_end ?? "",
      next_payment_date: payment?.next_payment_date ?? "",
      notes: payment?.notes ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        amount: payment?.amount ?? 0,
        currency: payment?.currency ?? "EUR",
        payment_method: payment?.payment_method ?? "bizum",
        status: payment?.status ?? "paid",
        description: payment?.description ?? "",
        payment_date:
          payment?.payment_date ?? new Date().toISOString().split("T")[0],
        period_start: payment?.period_start ?? "",
        period_end: payment?.period_end ?? "",
        next_payment_date: payment?.next_payment_date ?? "",
        notes: payment?.notes ?? "",
      });
    }
  }, [open, payment, form]);

  // Auto-calculate next_payment_date when period_end changes
  const periodEnd = form.watch("period_end");
  useEffect(() => {
    if (periodEnd && !payment?.next_payment_date) {
      const endDate = new Date(periodEnd);
      endDate.setDate(endDate.getDate() + 1);
      form.setValue(
        "next_payment_date",
        endDate.toISOString().split("T")[0]
      );
    }
  }, [periodEnd, form, payment?.next_payment_date]);

  const methodLabels: Record<string, string> = {
    bizum: t("bizum"),
    transfer: t("transfer"),
    cash: t("cash"),
    card: t("card"),
    paypal: t("paypal"),
    other: t("other"),
  };

  const statusLabels: Record<string, string> = {
    paid: t("paid"),
    pending: t("pending"),
    overdue: t("overdue"),
    cancelled: t("cancelled"),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("editPayment") : t("registerPayment")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Amount + Currency */}
            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{t("amount")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("currency")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Payment Method */}
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("paymentMethod")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {methodLabels[method]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Date */}
            <FormField
              control={form.control}
              name="payment_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("paymentDate")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Period Start / End */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="period_start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("periodStart")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="period_end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("periodEnd")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Next Payment Date */}
            <FormField
              control={form.control}
              name="next_payment_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("nextPaymentDate")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("status")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {statusLabels[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("notes")}</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t("saving")
                  : isEdit
                    ? t("saveChanges")
                    : t("registerPayment")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
