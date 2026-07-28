import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export function getEmailFrom() {
  return process.env.EMAIL_FROM ?? "Vó Angela <noreply@voangela.com.br>";
}

export function getContactEmail() {
  return process.env.CONTACT_EMAIL ?? "contato@voangela.com.br";
}

export async function sendEmail(params: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const resend = getResend();
  if (!resend) {
    throw new Error("RESEND_API_KEY não configurada");
  }

  const { error } = await resend.emails.send({
    from: getEmailFrom(),
    to: params.to,
    subject: params.subject,
    html: params.html,
    replyTo: params.replyTo,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}
