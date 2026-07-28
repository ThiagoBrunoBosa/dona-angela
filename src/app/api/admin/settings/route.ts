import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { updateSiteSettings } from "@/lib/services/settings";

const optionalUrl = z
  .union([z.string().url(), z.literal(""), z.null()])
  .optional();

const schema = z.object({
  aboutTitle: z.string().max(200).optional(),
  aboutHtml: z.string().optional(),
  aboutImageUrl: z.string().nullable().optional(),
  instagramUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  facebookUrl: optionalUrl,
  tiktokUrl: optionalUrl,
});

function emptyToNull(v: string | null | undefined) {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  return v;
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const settings = await updateSiteSettings({
    aboutTitle: data.aboutTitle,
    aboutHtml: data.aboutHtml,
    aboutImageUrl: data.aboutImageUrl,
    instagramUrl: emptyToNull(data.instagramUrl),
    youtubeUrl: emptyToNull(data.youtubeUrl),
    facebookUrl: emptyToNull(data.facebookUrl),
    tiktokUrl: emptyToNull(data.tiktokUrl),
  });

  return NextResponse.json(settings);
}
