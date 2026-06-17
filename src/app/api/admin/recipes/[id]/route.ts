import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateRecipe, deleteRecipe, type RecipeInput } from "@/lib/services/recipes";
import { recipeSchema, formatZodErrors } from "@/lib/recipe-schema";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = recipeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodErrors(parsed.error) },
      { status: 400 },
    );
  }

  const recipe = await updateRecipe(id, parsed.data as RecipeInput);
  return NextResponse.json(recipe);
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await deleteRecipe(id);
  return NextResponse.json({ ok: true });
}
