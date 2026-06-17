import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createRecipe, type RecipeInput } from "@/lib/services/recipes";
import { recipeSchema, formatZodErrors } from "@/lib/recipe-schema";

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = recipeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodErrors(parsed.error) },
      { status: 400 },
    );
  }

  const recipe = await createRecipe(parsed.data as RecipeInput);
  return NextResponse.json(recipe);
}
