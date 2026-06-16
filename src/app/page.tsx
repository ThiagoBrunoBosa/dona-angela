import Link from "next/link";
import Image from "next/image";
import { getFeaturedRecipes, getCategories } from "@/lib/services/recipes";
import { Clock, Star } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";

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
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/receitas"
            className="rounded bg-primary px-6 py-3 font-heading text-xs font-bold uppercase tracking-widest text-background"
          >
            Ver receitas
          </Link>
          <Link
            href="/busca"
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
            <Link
              key={recipe.id}
              href={`/receitas/${recipe.slug}`}
              className="group overflow-hidden rounded border border-border transition hover:border-primary/40"
            >
              {recipe.imageUrl && (
                <div className="relative aspect-[4/3] bg-border/30">
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    fill
                    className="object-cover transition group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-serif text-lg italic text-primary">{recipe.title}</h3>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted">
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
        {featured.length === 0 && (
          <p className="mt-4 text-muted">Em breve, novas receitas.</p>
        )}
      </section>
    </div>
  );
}
