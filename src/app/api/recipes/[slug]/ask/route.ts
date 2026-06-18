import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { askGroq, GroqRateLimitError } from "@/lib/ai/groq-client";
import { isRecipeAiEnabled } from "@/lib/ai/groq-config";
import { buildRecipeAssistantSystemPrompt } from "@/lib/ai/recipe-assistant-prompt";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { getRecipeBySlug } from "@/lib/services/recipes";

const bodySchema = z.object({
  question: z
    .string()
    .trim()
    .min(3, "Escreva sua dúvida com pelo menos 3 caracteres.")
    .max(500, "Pergunta muito longa (máximo 500 caracteres)."),
});

type Props = { params: Promise<{ slug: string }> };

export async function POST(req: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Faça login para perguntar à Dona Angela." }, { status: 401 });
  }

  if (!isRecipeAiEnabled()) {
    return NextResponse.json(
      { error: "Assistente temporariamente indisponível." },
      { status: 503 },
    );
  }

  const rate = checkRateLimit(`recipe-ai:${session.user.id}`);
  if (!rate.ok) {
    return NextResponse.json(
      {
        error: `Você fez muitas perguntas. Aguarde ${Math.ceil(rate.retryAfterSec / 60)} min e tente de novo.`,
      },
      { status: 429 },
    );
  }

  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe?.published) {
    return NextResponse.json({ error: "Receita não encontrada." }, { status: 404 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Pergunta inválida." },
      { status: 400 },
    );
  }

  const system = buildRecipeAssistantSystemPrompt(recipe);
  const userPrompt = `Dúvida sobre a receita "${recipe.title}":\n\n${parsed.data.question}`;

  try {
    const answer = await askGroq(system, userPrompt);
    return NextResponse.json({ answer });
  } catch (err) {
    if (err instanceof GroqRateLimitError) {
      return NextResponse.json({ error: err.message }, { status: 429 });
    }
    console.error("[recipe-ai]", err);
    return NextResponse.json(
      { error: "Não consegui responder agora. Tente novamente em instantes." },
      { status: 502 },
    );
  }
}
