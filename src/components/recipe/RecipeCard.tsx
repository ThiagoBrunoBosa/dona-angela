import Link from "next/link";
import Image from "next/image";
import { Clock, Star, Users } from "lucide-react";

type RecipeCardProps = {
  recipe: {
    slug: string;
    title: string;
    category: string;
    prepTimeMinutes: number;
    defaultYield: number;
    imageUrl: string | null;
    avgRating: number;
    featured?: boolean;
  };
  sizes?: string;
};

export function RecipeCard({ recipe, sizes = "(max-width:768px) 100vw, 33vw" }: RecipeCardProps) {
  return (
    <Link
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
            sizes={sizes}
          />
          {recipe.featured && (
            <span className="absolute left-2 top-2 rounded bg-accent px-2 py-0.5 font-heading text-[10px] font-bold uppercase tracking-widest text-background">
              Destaque
            </span>
          )}
        </div>
      )}
      <div className="p-4">
        <span className="font-heading text-[10px] uppercase tracking-widest text-accent">
          {recipe.category}
        </span>
        <h3 className="mt-1 font-serif text-lg italic text-primary">{recipe.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {recipe.prepTimeMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {recipe.defaultYield} porções
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
  );
}
