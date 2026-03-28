import nodemailer from "nodemailer";

let _transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return _transporter;
}

interface SendGmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendGmail({ to, subject, html }: SendGmailOptions) {
  try {
    const transporter = getTransporter();
    const from = `TrainHub <${process.env.GMAIL_USER}>`;

    await transporter.sendMail({ from, to, subject, html });
    return { success: true };
  } catch (err) {
    console.error("[Gmail SMTP] Error:", err);
    return { success: false, error: err };
  }
}
