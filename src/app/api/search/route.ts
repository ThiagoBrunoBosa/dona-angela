import { NextResponse } from "next/server";
import { searchRecipes } from "@/lib/services/recipes";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const results = await searchRecipes(q);
  return NextResponse.json(results);
}
