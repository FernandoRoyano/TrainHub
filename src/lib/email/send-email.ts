import { getResend, EMAIL_FROM } from "./resend";
import type { ReactElement } from "react";

interface SendEmailOptions {
  to: string;
  subject: string;
  react: ReactElement;
}

export async function sendEmail({ to, subject, react }: SendEmailOptions) {
  try {
    const { error } = await getResend().emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      react,
    });
    if (error) {
      console.error("[Email] Failed to send:", error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error("[Email] Exception:", err);
    return { success: false, error: err };
  }
}
