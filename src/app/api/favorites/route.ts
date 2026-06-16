import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { toggleFavorite } from "@/lib/services/favorites";
import { z } from "zod";

const schema = z.object({ recipeId: z.string() });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  const result = await toggleFavorite(session.user.id, parsed.data.recipeId);
  return NextResponse.json(result);
}
