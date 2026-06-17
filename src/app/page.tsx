import Link from "next/link";
import { getFeaturedRecipes, getCategories } from "@/lib/services/recipes";
import { AdSlot } from "@/components/ads/AdSlot";
import { SearchBar } from "@/components/search/SearchBar";
import { RecipeCard } from "@/components/recipe/RecipeCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedRecipes(),
    getCategories(),
  ]);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="font-serif text-4xl italic text-primary md:text-5xl">
          Caderno de Receitas Digitais
        </h1>
        <p className="font-narrative mx-auto mt-4 max-w-2xl text-muted">
          Receitas de família reunidas com clareza e sofisticação. Descubra pratos
          tradicionais, ajuste porções e salve seus favoritos.
        </p>
        <div className="mx-auto mt-8 max-w-2xl">
          <SearchBar />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/receitas"
            className="rounded bg-primary px-6 py-3 font-heading text-xs font-bold uppercase tracking-widest text-background"
          >
            Ver receitas
          </Link>
          <Link
            href="/busca?modo=geladeira"
            className="rounded border border-primary px-6 py-3 font-heading text-xs font-bold uppercase tracking-widest text-primary"
          >
            O que tenho na geladeira
          </Link>
        </div>
      </section>

      <AdSlot slot={1} className="px-4" />

      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
            Categorias
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/receitas?categoria=${encodeURIComponent(cat)}`}
                className="rounded-full border border-border px-4 py-1.5 text-sm hover:border-primary hover:text-primary"
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
          Destaques
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
        {featured.length === 0 && (
          <p className="mt-4 text-muted">Em breve, novas receitas.</p>
        )}
      </section>
    </div>
  );
}
