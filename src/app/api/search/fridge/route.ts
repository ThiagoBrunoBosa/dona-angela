import { NextResponse } from "next/server";
import { searchByFridge } from "@/lib/services/fridge-search";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const results = await searchByFridge(q);
  return NextResponse.json(results);
}
