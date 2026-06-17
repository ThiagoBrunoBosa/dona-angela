import Link from "next/link";
import { getPublishedRecipes, getCategories } from "@/lib/services/recipes";
import { RecipeCard } from "@/components/recipe/RecipeCard";

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
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {recipes.length === 0 && (
        <p className="mt-8 text-muted">Nenhuma receita nesta categoria.</p>
      )}
    </div>
  );
}
