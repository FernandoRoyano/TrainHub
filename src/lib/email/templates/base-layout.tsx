import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
} from "@react-email/components";
import * as React from "react";

const PRIMARY = "#6dbd57";
const BG = "#f8f8f8";
const MUTED = "#6b7280";

interface BaseLayoutProps {
  children: React.ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: BG,
          fontFamily: "'Inter', Arial, sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <Container style={{ maxWidth: 520, margin: "0 auto", padding: "40px 20px" }}>
          <Section style={{ textAlign: "center" as const, marginBottom: 32 }}>
            <Text style={{ fontSize: 24, fontWeight: 700, color: PRIMARY, margin: 0 }}>
              TrainHub
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: "32px 28px",
              border: "1px solid #e5e7eb",
            }}
          >
            {children}
          </Section>

          <Section style={{ textAlign: "center" as const, marginTop: 32 }}>
            <Text style={{ fontSize: 12, color: MUTED }}>
              TrainHub - Personal Training Platform
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export { PRIMARY, MUTED };
