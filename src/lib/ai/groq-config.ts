/** Mesmas variáveis do GPS Vendas (LLM_*) com fallback GROQ_*. */
export function getGroqConfig() {
  const apiKey =
    process.env.LLM_API_KEY?.trim() ||
    process.env.GROQ_API_KEY?.trim() ||
    "";
  const baseUrl = (
    process.env.LLM_BASE_URL?.trim() ||
    process.env.GROQ_BASE_URL?.trim() ||
    "https://api.groq.com/openai/v1"
  ).replace(/\/$/, "");
  const model =
    process.env.LLM_MODEL?.trim() ||
    process.env.GROQ_MODEL?.trim() ||
    "llama-3.1-8b-instant";

  return { apiKey, baseUrl, model };
}

export function isRecipeAiEnabled() {
  if (process.env.RECIPE_AI_ENABLED === "false") return false;
  return Boolean(getGroqConfig().apiKey);
}
