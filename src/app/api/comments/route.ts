import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createComment } from "@/lib/services/comments";
import { z } from "zod";

const schema = z.object({
  recipeId: z.string(),
  text: z.string().min(10).max(2000),
  rating: z.number().int().min(1).max(5),
});

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

  const comment = await createComment(
    session.user.id,
    parsed.data.recipeId,
    parsed.data.text,
    parsed.data.rating,
  );

  return NextResponse.json(comment);
}
