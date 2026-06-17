import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCommentReply } from "@/lib/services/comments";
import { z } from "zod";

const schema = z.object({
  recipeId: z.string(),
  parentId: z.string(),
  text: z.string().min(1).max(2000),
});

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  const reply = await createCommentReply(
    session.user.id,
    parsed.data.recipeId,
    parsed.data.parentId,
    parsed.data.text,
  );

  return NextResponse.json(reply);
}
