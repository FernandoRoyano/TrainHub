"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useActionItems } from "@/hooks/use-action-center";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreditCard,
  UserX,
  ClipboardCheck,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { AVATAR_GRADIENTS } from "@/lib/ui-tokens";
import type { LucideIcon } from "lucide-react";

function ClientAvatar({ name }: { name: string }) {
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0])
      .join("")
      .toUpperCase() || "?";
  const hash = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0);
  const gradient = AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
  return (
    <div
      className={`h-7 w-7 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-[10px] font-bold text-white shrink-0 ring-1 ring-white/10`}
    >
      {initials}
    </div>
  );
}

function Row({
  clientId,
  name,
  badge,
}: {
  clientId: string;
  name: string;
  badge: React.ReactNode;
}) {
  return (
    <Link
      href={`/clients/${clientId}`}
      className="flex items-center gap-3 text-sm rounded-lg border p-3 hover:bg-accent/50 hover:border-border transition-all active:scale-[0.98]"
    >
      <ClientAvatar name={name} />
      <span className="font-medium truncate flex-1">{name || "—"}</span>
      {badge}
    </Link>
  );
}

function Section({
  icon: Icon,
  iconClass,
  title,
  count,
  children,
}: {
  icon: LucideIcon;
  iconClass: string;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className={`h-4 w-4 ${iconClass}`} />
          {title}
          {count > 0 && (
            <Badge variant="secondary" className="ml-auto tabular-nums">
              {count}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
}

export default function ActionCenterPage() {
  const t = useTranslations("actionCenter");
  const locale = useLocale();
  const dfLocale = locale === "es" ? es : enUS;
  const { data, isLoading } = useActionItems();

  const fmtDate = (d: string) => format(new Date(d), "d MMM", { locale: dfLocale });
  const fmtMoney = (amount: number, currency = "EUR") =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  const allClear = !data || data.total === 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {allClear ? t("subtitleClear") : t("subtitle", { count: data!.total })}
        </p>
      </div>

      {allClear && (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="h-10 w-10 text-success mb-3" />
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
          </CardContent>
        </Card>
      )}

      {data && data.paymentsOverdue.length + data.paymentsDueSoon.length > 0 && (
        <Section
          icon={CreditCard}
          iconClass="text-primary"
          title={t("payments")}
          count={data.paymentsOverdue.length + data.paymentsDueSoon.length}
        >
          {data.paymentsOverdue.map((p) => (
            <Row
              key={`o-${p.clientId}`}
              clientId={p.clientId}
              name={p.clientName}
              badge={
                <Badge variant="outline" className="text-destructive border-destructive/25 shrink-0 gap-1">
                  {t("overdue")} · {fmtMoney(p.amount, p.currency)}
                </Badge>
              }
            />
          ))}
          {data.paymentsDueSoon.map((p) => (
            <Row
              key={`d-${p.clientId}`}
              clientId={p.clientId}
              name={p.clientName}
              badge={
                <Badge variant="warning" className="shrink-0">
                  {t("dueOn", { date: fmtDate(p.nextPaymentDate) })} · {fmtMoney(p.amount, p.currency)}
                </Badge>
              }
            />
          ))}
        </Section>
      )}

      {data && data.inactive.length > 0 && (
        <Section
          icon={UserX}
          iconClass="text-warning"
          title={t("inactive")}
          count={data.inactive.length}
        >
          {data.inactive.map((c) => (
            <Row
              key={c.clientId}
              clientId={c.clientId}
              name={c.clientName}
              badge={
                <Badge variant="warning" className="shrink-0">
                  {c.daysSinceAccess === null
                    ? t("neverEntered")
                    : t("inactiveDays", { days: c.daysSinceAccess })}
                </Badge>
              }
            />
          ))}
        </Section>
      )}

      {data && data.reviews.length > 0 && (
        <Section
          icon={ClipboardCheck}
          iconClass="text-info"
          title={t("reviews")}
          count={data.reviews.length}
        >
          {data.reviews.map((r) => (
            <Row
              key={r.clientId}
              clientId={r.clientId}
              name={r.clientName}
              badge={
                <Badge variant="info" className="shrink-0">
                  {t("reviewDue", { date: fmtDate(r.reviewDate) })}
                </Badge>
              }
            />
          ))}
        </Section>
      )}

      {data && data.routinesEnding.length > 0 && (
        <Section
          icon={CalendarClock}
          iconClass="text-warning"
          title={t("routinesEnding")}
          count={data.routinesEnding.length}
        >
          {data.routinesEnding.map((r) => (
            <Row
              key={r.clientId}
              clientId={r.clientId}
              name={r.clientName}
              badge={
                <Badge variant="warning" className="shrink-0">
                  {t("endsOn", { date: fmtDate(r.endDate) })}
                </Badge>
              }
            />
          ))}
        </Section>
      )}
    </div>
  );
}
