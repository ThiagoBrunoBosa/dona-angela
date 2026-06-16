import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createRecipe, type RecipeInput } from "@/lib/services/recipes";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3),
  category: z.string().min(2),
  prepTimeMinutes: z.number().int().positive(),
  defaultYield: z.number().int().positive(),
  historyHtml: z.string().min(10),
  videoUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  published: z.boolean().optional(),
  ingredients: z.array(
    z.object({ quantity: z.string(), unit: z.string(), name: z.string() }),
  ),
  steps: z.array(z.object({ text: z.string() })),
  affiliates: z.array(
    z.object({ name: z.string(), url: z.string().url().or(z.literal("")) }),
  ),
});

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const recipe = await createRecipe(parsed.data as RecipeInput);
  return NextResponse.json(recipe);
}
