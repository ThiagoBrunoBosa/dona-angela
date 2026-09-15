import { NextResponse } from "next/server";
import { getGroqConfig, isRecipeAiEnabled } from "@/lib/ai/groq-config";

function providerHintFromBaseUrl(baseUrl: string): string {
  try {
    const host = new URL(baseUrl).host.toLowerCase();
    if (host.includes("openai.com")) return "openai";
    if (host.includes("groq.com")) return "groq";
    if (host.includes("dashscope") || host.includes("aliyuncs")) return "dashscope";
    if (host.includes("generativelanguage") || host.includes("googleapis.com"))
      return "gemini";
    return "openai-compat";
  } catch {
    return "unknown";
  }
}

function monitorKeyOk(req: Request): boolean {
  const expected =
    process.env.LLM_MONITOR_KEY?.trim() ||
    process.env.MONITOR_KEY?.trim() ||
    "";
  if (!expected) return false;
  const got = req.headers.get("x-monitor-key")?.trim() || "";
  return got.length > 0 && got === expected;
}

/** Machine endpoint for LTSMonitor — which LLM providers are in use. */
export async function GET(req: Request) {
  if (!monitorKeyOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isRecipeAiEnabled()) {
    return NextResponse.json({ providers: [] });
  }

  const { baseUrl, model, apiKey } = getGroqConfig();
  if (!apiKey) {
    return NextResponse.json({ providers: [] });
  }

  const id = providerHintFromBaseUrl(baseUrl);
  return NextResponse.json({
    providers: [
      {
        id,
        model,
        roles: ["chat"],
      },
    ],
  });
}
