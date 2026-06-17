"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button, Input, Label } from "@/components/ui/form";
import { Clock } from "lucide-react";

type RecipeResult = {
  id: string;
  slug: string;
  title: string;
  category: string;
  prepTimeMinutes: number;
  imageUrl: string | null;
  avgRating: number;
};

type FridgeResponse = {
  exact: RecipeResult[];
  approximate: RecipeResult[];
};

export function FridgeSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [mode, setMode] = useState<"text" | "fridge">(
    searchParams.get("modo") === "geladeira" ? "fridge" : "text",
  );
  const [results, setResults] = useState<RecipeResult[]>([]);
  const [approximate, setApproximate] = useState<RecipeResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    const params = new URLSearchParams();
    params.set("q", query);
    if (mode === "fridge") params.set("modo", "geladeira");
    router.replace(`/busca?${params.toString()}`);

    const endpoint =
      mode === "fridge"
        ? `/api/search/fridge?q=${encodeURIComponent(query)}`
        : `/api/search?q=${encodeURIComponent(query)}`;

    const res = await fetch(endpoint);
    const data = await res.json();

    if (mode === "fridge") {
      const fridge = data as FridgeResponse;
      setResults(fridge.exact);
      setApproximate(fridge.approximate);
    } else {
      setResults(data as RecipeResult[]);
      setApproximate([]);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("text")}
          className={`rounded px-4 py-2 text-sm ${
            mode === "text" ? "bg-primary text-background" : "border border-border"
          }`}
        >
          Busca geral
        </button>
        <button
          type="button"
          onClick={() => setMode("fridge")}
          className={`rounded px-4 py-2 text-sm ${
            mode === "fridge" ? "bg-primary text-background" : "border border-border"
          }`}
        >
          O que tenho na geladeira
        </button>
      </div>

      <form onSubmit={search} className="space-y-4">
        <div>
          <Label htmlFor="search">
            {mode === "fridge"
              ? "Ingredientes disponíveis (vírgula ou espaço)"
              : "Buscar receitas"}
          </Label>
          <Input
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              mode === "fridge"
                ? "ovos presunto leite..."
                : "bolo, sobremesa..."
            }
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </Button>
      </form>

      {searched && results.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {results.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}

      {searched && results.length === 0 && approximate.length > 0 && (
        <div className="mt-8">
          <p className="text-muted">
            Não encontramos nenhuma receita com exatamente esses ingredientes, mas a
            receita mais próxima é:
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {approximate.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </div>
      )}

      {searched && results.length === 0 && approximate.length === 0 && !loading && (
        <p className="mt-8 text-muted">Nenhum resultado encontrado.</p>
      )}
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: RecipeResult }) {
  return (
    <Link
      href={`/receitas/${recipe.slug}`}
      className="flex gap-4 rounded border border-border p-4 hover:border-primary/40"
    >
      {recipe.imageUrl && (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded">
          <Image src={recipe.imageUrl} alt="" fill className="object-cover" sizes="80px" />
        </div>
      )}
      <div>
        <h3 className="font-serif italic text-primary">{recipe.title}</h3>
        <p className="text-xs text-muted">{recipe.category}</p>
        <span className="mt-1 flex items-center gap-1 text-xs text-muted">
          <Clock className="h-3 w-3" />
          {recipe.prepTimeMinutes} min
        </span>
      </div>
    </Link>
  );
}
