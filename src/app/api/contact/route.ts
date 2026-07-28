import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail, getContactEmail, isEmailConfigured } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2, "Nome obrigatório").max(120),
  email: z.string().email("E-mail inválido"),
  message: z.string().min(10, "Mensagem muito curta").max(5000),
});

export async function POST(req: Request) {
  if (!isEmailConfigured()) {
    return NextResponse.json(
      { error: "Serviço de e-mail ainda não configurado." },
      { status: 503 },
    );
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 },
    );
  }

  const { name, email, message } = parsed.data;
  const contactTo = getContactEmail();

  try {
    await sendEmail({
      to: contactTo,
      replyTo: email,
      subject: `Contato do site — ${name}`,
      html: `
        <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `,
    });

    await sendEmail({
      to: email,
      subject: "Recebemos sua mensagem — Vó Angela",
      html: `
        <p>Olá, ${escapeHtml(name)}!</p>
        <p>Recebemos sua mensagem e em breve retornamos o contato.</p>
        <p>Com carinho,<br/>Vó Angela</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact email failed", err);
    return NextResponse.json(
      { error: "Não foi possível enviar. Tente novamente mais tarde." },
      { status: 500 },
    );
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
