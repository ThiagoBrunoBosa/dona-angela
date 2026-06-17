import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";
import { hasVercelBlob } from "@/lib/blob";
import { updateSiteLogo } from "@/lib/services/settings";

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Arquivo obrigatório" }, { status: 400 });
  }

  let url: string;
  if (hasVercelBlob()) {
    const blob = await put(`branding/logo-${Date.now()}-${file.name}`, file, {
      access: "public",
    });
    url = blob.url;
  } else {
    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = file.type || "image/png";
    url = `data:${mime};base64,${buffer.toString("base64")}`;
  }

  await updateSiteLogo(url);
  return NextResponse.json({ logoUrl: url });
}
