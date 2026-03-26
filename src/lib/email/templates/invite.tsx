import { Text, Button } from "@react-email/components";
import { BaseLayout, PRIMARY } from "./base-layout";
import * as React from "react";

interface InviteEmailProps {
  clientName: string;
  trainerName: string;
  joinUrl: string;
  t: Record<string, string>;
}

export function InviteEmail({ clientName, trainerName, joinUrl, t }: InviteEmailProps) {
  return (
    <BaseLayout>
      <Text style={{ fontSize: 20, fontWeight: 600, color: "#1a1f36" }}>
        {t.inviteTitle.replace("{name}", clientName)}
      </Text>
      <Text style={{ fontSize: 14, color: "#4b5563", lineHeight: "1.6" }}>
        {t.inviteBody.replace("{trainer}", trainerName)}
      </Text>
      <Button
        href={joinUrl}
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
        {t.inviteCta}
      </Button>
      <Text style={{ fontSize: 12, color: "#9ca3af", marginTop: 24, lineHeight: "1.5" }}>
        {t.inviteFooter}
      </Text>
    </BaseLayout>
  );
}
