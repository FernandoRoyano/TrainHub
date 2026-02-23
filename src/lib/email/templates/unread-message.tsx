import { Text, Button, Section } from "@react-email/components";
import { BaseLayout, PRIMARY } from "./base-layout";
import * as React from "react";

interface UnreadMessageEmailProps {
  clientName: string;
  trainerName: string;
  messagePreview: string;
  appUrl: string;
  t: Record<string, string>;
}

export function UnreadMessageEmail({
  trainerName,
  messagePreview,
  appUrl,
  t,
}: UnreadMessageEmailProps) {
  const preview =
    messagePreview.length > 150
      ? messagePreview.slice(0, 150) + "..."
      : messagePreview;

  return (
    <BaseLayout>
      <Text style={{ fontSize: 20, fontWeight: 600, color: "#1a1f36" }}>
        {t.unreadMessageTitle}
      </Text>
      <Text style={{ fontSize: 14, color: "#4b5563", lineHeight: "1.6" }}>
        {t.unreadMessageBody.replace("{trainer}", trainerName)}
      </Text>
      <Section
        style={{
          backgroundColor: "#f3f4f6",
          borderRadius: 8,
          padding: "12px 16px",
          margin: "16px 0",
          borderLeft: `3px solid ${PRIMARY}`,
        }}
      >
        <Text style={{ fontSize: 13, color: "#374151", margin: 0, fontStyle: "italic" }}>
          &ldquo;{preview}&rdquo;
        </Text>
      </Section>
      <Button
        href={`${appUrl}/my-messages`}
        style={{
          backgroundColor: PRIMARY,
          color: "#ffffff",
          borderRadius: 8,
          padding: "12px 24px",
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        {t.unreadMessageCta}
      </Button>
    </BaseLayout>
  );
}
