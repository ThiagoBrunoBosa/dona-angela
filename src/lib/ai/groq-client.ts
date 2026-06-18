import { getGroqConfig } from "@/lib/ai/groq-config";

export class GroqRateLimitError extends Error {
  constructor(message = "Limite de uso da IA atingido. Tente novamente em instantes.") {
    super(message);
    this.name = "GroqRateLimitError";
  }
}

export async function askGroq(system: string, user: string, maxTokens = 500) {
  const { apiKey, baseUrl, model } = getGroqConfig();
  if (!apiKey) {
    throw new Error("Assistente indisponível: chave Groq não configurada.");
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.35,
      max_tokens: maxTokens,
    }),
  });

  if (res.status === 429) {
    throw new GroqRateLimitError();
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Groq error ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Resposta vazia da IA.");
  return text;
}
