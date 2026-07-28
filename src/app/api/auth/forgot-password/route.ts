import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendEmail, isEmailConfigured } from "@/lib/email";
import { BASE_URL } from "@/lib/utils";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();

  // Always return ok to avoid email enumeration
  const ok = NextResponse.json({
    ok: true,
    message: "Se o e-mail existir, enviaremos as instruções.",
  });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash) return ok;

  if (!isEmailConfigured()) {
    return NextResponse.json(
      { error: "Serviço de e-mail ainda não configurado." },
      { status: 503 },
    );
  }

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordResetToken.deleteMany({ where: { email } });
  await prisma.passwordResetToken.create({
    data: { email, token, expires },
  });

  const resetUrl = `${BASE_URL}/redefinir-senha?token=${token}`;

  try {
    await sendEmail({
      to: email,
      subject: "Redefinir senha — Vó Angela",
      html: `
        <p>Olá${user.name ? `, ${user.name}` : ""}!</p>
        <p>Recebemos um pedido para redefinir sua senha.</p>
        <p><a href="${resetUrl}">Clique aqui para criar uma nova senha</a></p>
        <p>Este link expira em 1 hora. Se você não pediu isso, ignore este e-mail.</p>
        <p>Com carinho,<br/>Vó Angela</p>
      `,
    });
  } catch (err) {
    console.error("forgot-password email failed", err);
    return NextResponse.json(
      { error: "Não foi possível enviar o e-mail. Tente novamente." },
      { status: 500 },
    );
  }

  return ok;
}
