import { Text, Button, Section, Hr } from "@react-email/components";
import { BaseLayout, PRIMARY, MUTED } from "./base-layout";
import * as React from "react";

interface WeeklySummaryEmailProps {
  clientName: string;
  weekWorkouts: number;
  totalDays: number;
  appUrl: string;
  t: Record<string, string>;
}

export function WeeklySummaryEmail({
  clientName,
  weekWorkouts,
  totalDays,
  appUrl,
  t,
}: WeeklySummaryEmailProps) {
  return (
    <BaseLayout>
      <Text style={{ fontSize: 20, fontWeight: 600, color: "#1a1f36" }}>
        {t.weeklySummaryTitle}
      </Text>
      <Text style={{ fontSize: 14, color: "#4b5563" }}>
        {t.weeklySummaryGreeting.replace("{name}", clientName)}
      </Text>

      <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
        <Text style={{ fontSize: 28, fontWeight: 700, color: PRIMARY, margin: 0 }}>
          {weekWorkouts}/{totalDays}
        </Text>
        <Text style={{ fontSize: 12, color: MUTED, margin: 0 }}>
          {t.weeklySummaryWorkouts}
        </Text>
      </Section>

      <Hr style={{ borderColor: "#e5e7eb" }} />

      <Text style={{ fontSize: 14, color: "#4b5563", lineHeight: "1.6" }}>
        {weekWorkouts > 0 ? t.weeklySummaryPositive : t.weeklySummaryEncourage}
      </Text>

      <Button
        href={`${appUrl}/my-routine`}
        style={{
          backgroundColor: PRIMARY,
          color: "#ffffff",
          borderRadius: 8,
          padding: "12px 24px",
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
          display: "inline-block",
          marginTop: 16,
        }}
      >
        {t.weeklySummaryCta}
      </Button>
    </BaseLayout>
  );
}
