import { Text, Button } from "@react-email/components";
import { BaseLayout, PRIMARY } from "./base-layout";
import * as React from "react";

interface MealPlanAssignedEmailProps {
  clientName: string;
  planName: string;
  startDate: string;
  appUrl: string;
  t: Record<string, string>;
}

export function MealPlanAssignedEmail({
  clientName,
  planName,
  startDate,
  appUrl,
  t,
}: MealPlanAssignedEmailProps) {
  return (
    <BaseLayout>
      <Text style={{ fontSize: 20, fontWeight: 600, color: "#1a1f36" }}>
        {t.mealPlanAssignedTitle}
      </Text>
      <Text style={{ fontSize: 14, color: "#4b5563", lineHeight: "1.6" }}>
        {t.mealPlanAssignedBody
          .replace("{name}", clientName)
          .replace("{plan}", planName)
          .replace("{date}", startDate)}
      </Text>
      <Button
        href={`${appUrl}/my-nutrition`}
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
        {t.mealPlanAssignedCta}
      </Button>
    </BaseLayout>
  );
}
