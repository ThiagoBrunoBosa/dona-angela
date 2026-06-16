import Link from "next/link";
import Image from "next/image";
import { getPublishedRecipes, getCategories } from "@/lib/services/recipes";
import { Clock, Star } from "lucide-react";

type Props = { searchParams: Promise<{ categoria?: string }> };

export const metadata = {
  title: "Receitas",
};

export const dynamic = "force-dynamic";

export default async function ReceitasPage({ searchParams }: Props) {
  const { categoria } = await searchParams;
  const [recipes, categories] = await Promise.all([
    getPublishedRecipes(categoria),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-3xl italic text-primary md:text-4xl">Receitas</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/receitas"
          className={`rounded-full border px-4 py-1.5 text-sm ${
            !categoria ? "border-primary bg-primary/5 text-primary" : "border-border"
          }`}
        >
          Todas
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/receitas?categoria=${encodeURIComponent(cat)}`}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              categoria === cat ? "border-primary bg-primary/5 text-primary" : "border-border"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/receitas/${recipe.slug}`}
            className="overflow-hidden rounded border border-border hover:border-primary/40"
          >
            {recipe.imageUrl && (
              <div className="relative aspect-[4/3]">
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
            )}
            <div className="p-4">
              <span className="font-heading text-[10px] uppercase tracking-widest text-accent">
                {recipe.category}
              </span>
              <h2 className="mt-1 font-serif text-lg italic text-primary">{recipe.title}</h2>
              <div className="mt-2 flex gap-3 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {recipe.prepTimeMinutes} min
                </span>
                {recipe.avgRating > 0 && (
                  <span className="flex items-center gap-1 text-accent">
                    <Star className="h-3 w-3 fill-accent" />
                    {recipe.avgRating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {recipes.length === 0 && (
        <p className="mt-8 text-muted">Nenhuma receita nesta categoria.</p>
      )}
    </div>
  );
}
