import { Text, Button } from "@react-email/components";
import { BaseLayout, PRIMARY } from "./base-layout";
import * as React from "react";

interface RoutineAssignedEmailProps {
  clientName: string;
  routineName: string;
  startDate: string;
  appUrl: string;
  t: Record<string, string>;
}

export function RoutineAssignedEmail({
  clientName,
  routineName,
  startDate,
  appUrl,
  t,
}: RoutineAssignedEmailProps) {
  return (
    <BaseLayout>
      <Text style={{ fontSize: 20, fontWeight: 600, color: "#1a1f36" }}>
        {t.routineAssignedTitle}
      </Text>
      <Text style={{ fontSize: 14, color: "#4b5563", lineHeight: "1.6" }}>
        {t.routineAssignedBody
          .replace("{name}", clientName)
          .replace("{routine}", routineName)
          .replace("{date}", startDate)}
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
        {t.routineAssignedCta}
      </Button>
    </BaseLayout>
  );
}
