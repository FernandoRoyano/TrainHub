"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useClientServiceTier } from "@/hooks/use-service-tiers";
import {
  useClientPayments,
  usePaymentsSummary,
  useCreatePayment,
  useUpdatePayment,
  useDeletePayment,
} from "@/hooks/use-payments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  Banknote,
  Landmark,
  Wallet,
  Smartphone,
  CircleDollarSign,
  HelpCircle,
  DollarSign,
  Calendar,
  CalendarClock,
} from "lucide-react";
import { RegisterPaymentDialog } from "./register-payment-dialog";
import type { ClientPayment } from "@/services/payments.service";
import type { PaymentFormData } from "@/lib/validations/payment";

interface PaymentsTabProps {
  clientId: string;
}

const methodIcons: Record<string, React.ReactNode> = {
  bizum: <Smartphone className="h-4 w-4" />,
  transfer: <Landmark className="h-4 w-4" />,
  cash: <Banknote className="h-4 w-4" />,
  card: <CreditCard className="h-4 w-4" />,
  paypal: <CircleDollarSign className="h-4 w-4" />,
  other: <HelpCircle className="h-4 w-4" />,
};

const statusColors: Record<string, string> = {
  paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  cancelled:
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString();
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(amount);
}

export function PaymentsTab({ clientId }: PaymentsTabProps) {
  const t = useTranslations("payments");
  const { data: clientTier, isLoading: tierLoading } =
    useClientServiceTier(clientId);
  const { data: payments, isLoading: paymentsLoading } =
    useClientPayments(clientId);
  const { data: summary, isLoading: summaryLoading } =
    usePaymentsSummary(clientId);

  const createPayment = useCreatePayment();
  const updatePayment = useUpdatePayment();
  const deletePayment = useDeletePayment();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<ClientPayment | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isLoading = tierLoading || paymentsLoading || summaryLoading;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  function handleCreate(data: PaymentFormData) {
    createPayment.mutate(
      { clientId, data },
      { onSuccess: () => setDialogOpen(false) }
    );
  }

  function handleEdit(data: PaymentFormData) {
    if (!editingPayment) return;
    updatePayment.mutate(
      { id: editingPayment.id, data },
      { onSuccess: () => setEditingPayment(null) }
    );
  }

  function handleDelete(id: string) {
    deletePayment.mutate(id, {
      onSuccess: () => setDeletingId(null),
    });
  }

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
    <div className="space-y-4">
      {/* Service Tier */}
      {clientTier?.service_tier && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="text-sm px-3 py-1"
                style={{
                  borderColor: clientTier.service_tier.color ?? undefined,
                  color: clientTier.service_tier.color ?? undefined,
                }}
              >
                {clientTier.service_tier.name}
              </Badge>
              {clientTier.service_tier.price != null && (
                <span className="text-sm text-muted-foreground">
                  {clientTier.service_tier.price}{" "}
                  {clientTier.service_tier.currency ?? "EUR"}
                  {clientTier.service_tier.billing_interval && (
                    <span>/{clientTier.service_tier.billing_interval}</span>
                  )}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("totalPaid")}
                </p>
                <p className="text-xl font-semibold">
                  {summary
                    ? formatCurrency(summary.totalPaid, summary.currency)
                    : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("lastPayment")}
                </p>
                <p className="text-xl font-semibold">
                  {formatDate(summary?.lastPaymentDate ?? null)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-2">
                <CalendarClock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("nextPayment")}
                </p>
                <p className="text-xl font-semibold">
                  {formatDate(summary?.nextPaymentDate ?? null)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Register Payment Button */}
      <div className="flex justify-end">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("registerPayment")}
        </Button>
      </div>

      {/* Payment History */}
      {payments && payments.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">
                      {t("paymentDate")}
                    </th>
                    <th className="pb-3 pr-4 font-medium">{t("amount")}</th>
                    <th className="pb-3 pr-4 font-medium">
                      {t("paymentMethod")}
                    </th>
                    <th className="pb-3 pr-4 font-medium">
                      {t("period")}
                    </th>
                    <th className="pb-3 pr-4 font-medium">{t("status")}</th>
                    <th className="pb-3 font-medium text-right">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b last:border-b-0 hover:bg-muted/50"
                    >
                      <td className="py-3 pr-4">
                        {formatDate(payment.payment_date)}
                      </td>
                      <td className="py-3 pr-4 font-medium">
                        {formatCurrency(payment.amount, payment.currency)}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          {methodIcons[payment.payment_method]}
                          <span>
                            {methodLabels[payment.payment_method] ??
                              payment.payment_method}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {payment.period_start && payment.period_end
                          ? `${formatDate(payment.period_start)} - ${formatDate(payment.period_end)}`
                          : "—"}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge
                          variant="secondary"
                          className={statusColors[payment.status] ?? ""}
                        >
                          {statusLabels[payment.status] ?? payment.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingPayment(payment)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {deletingId === payment.id ? (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => handleDelete(payment.id)}
                                disabled={deletePayment.isPending}
                              >
                                {t("confirm")}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => setDeletingId(null)}
                              >
                                {t("cancel")}
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setDeletingId(payment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Wallet className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground font-medium">
                {t("noPayments")}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {t("noPaymentsDescription")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <RegisterPaymentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
        isLoading={createPayment.isPending}
      />

      {/* Edit Dialog */}
      <RegisterPaymentDialog
        open={!!editingPayment}
        onOpenChange={(open) => {
          if (!open) setEditingPayment(null);
        }}
        onSubmit={handleEdit}
        isLoading={updatePayment.isPending}
        payment={editingPayment}
      />
    </div>
  );
}
