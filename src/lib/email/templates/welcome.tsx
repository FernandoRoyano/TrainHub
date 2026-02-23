import { Text, Button } from "@react-email/components";
import { BaseLayout, PRIMARY } from "./base-layout";
import * as React from "react";

interface WelcomeEmailProps {
  clientName: string;
  trainerName: string;
  appUrl: string;
  t: Record<string, string>;
}

export function WelcomeEmail({ clientName, trainerName, appUrl, t }: WelcomeEmailProps) {
  return (
    <BaseLayout>
      <Text style={{ fontSize: 20, fontWeight: 600, color: "#1a1f36" }}>
        {t.welcomeTitle.replace("{name}", clientName)}
      </Text>
      <Text style={{ fontSize: 14, color: "#4b5563", lineHeight: "1.6" }}>
        {t.welcomeBody.replace("{trainer}", trainerName)}
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
        {t.welcomeCta}
      </Button>
    </BaseLayout>
  );
}
