import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getRecipeBySlug } from "@/lib/services/recipes";
import { isFavorited } from "@/lib/services/favorites";
import { BASE_URL, parseVideoEmbedUrl } from "@/lib/utils";
import { AdSlot } from "@/components/ads/AdSlot";
import { PortionCalculator } from "@/components/recipe/PortionCalculator";
import { RecipeImageCarousel } from "@/components/recipe/RecipeImageCarousel";
import { KitchenMode } from "@/components/recipe/KitchenMode";
import { ShareButtons } from "@/components/recipe/ShareButtons";
import { FavoriteButton } from "@/components/recipe/FavoriteButton";
import { CommentsSection } from "@/components/recipe/CommentsSection";
import { RecipeAssistant } from "@/components/recipe/RecipeAssistant";
import { Clock, Users } from "lucide-react";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe || !recipe.published) return { title: "Receita não encontrada" };

  return {
    title: recipe.title,
    description: recipe.historyHtml.replace(/<[^>]+>/g, "").slice(0, 160),
    openGraph: {
      title: recipe.title,
      images: recipe.imageUrl ? [recipe.imageUrl] : [],
    },
  };
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe || !recipe.published) notFound();

  const session = await auth();
  const favorited = session?.user?.id
    ? await isFavorited(session.user.id, recipe.id)
    : false;

  const embedUrl = recipe.videoUrl ? parseVideoEmbedUrl(recipe.videoUrl) : null;
  const recipeUrl = `${BASE_URL}/receitas/${recipe.slug}`;
  const galleryImages = [
    ...(recipe.imageUrl ? [recipe.imageUrl] : []),
    ...(recipe.images?.map((i) => i.url).filter((u) => u !== recipe.imageUrl) ?? []),
  ];

  const recipeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    image: recipe.imageUrl,
    description: recipe.historyHtml.replace(/<[^>]+>/g, "").slice(0, 200),
    prepTime: `PT${recipe.prepTimeMinutes}M`,
    recipeYield: String(recipe.defaultYield),
    recipeIngredient: recipe.ingredients.map(
      (i) => `${i.quantity} ${i.unit} ${i.name}`.trim(),
    ),
    recipeInstructions: recipe.steps.map((s) => s.text),
    aggregateRating:
      recipe.avgRating > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: recipe.avgRating,
            ratingCount: recipe.comments?.length ?? 0,
          }
        : undefined,
  };

  return (
    <article className="mx-auto max-w-6xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd) }}
      />

      <AdSlot slot={1} />

      <header className="mt-4">
        <span className="font-heading text-xs uppercase tracking-widest text-accent">
          {recipe.category}
        </span>
        <h1 className="mt-2 font-serif text-3xl italic text-primary md:text-4xl">
          {recipe.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {recipe.prepTimeMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {recipe.defaultYield} porções
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <ShareButtons url={recipeUrl} title={recipe.title} />
          <FavoriteButton recipeId={recipe.id} initialFavorited={favorited} />
        </div>
      </header>

      {galleryImages.length > 0 && (
        <RecipeImageCarousel images={galleryImages} title={recipe.title} />
      )}

      <section className="font-narrative mt-10 rounded border border-border bg-background p-8">
        <h2 className="font-heading mb-4 text-xs font-bold uppercase tracking-widest text-primary">
          História da Receita
        </h2>
        <div
          className="prose-recipe text-[15px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: recipe.historyHtml }}
        />
      </section>

      <div className="mt-8 lg:hidden">
        <AdSlot slot={2} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-10">
          <section>
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
              Ingredientes
            </h2>
            <div className="mt-4">
              <PortionCalculator
                defaultYield={recipe.defaultYield}
                ingredients={recipe.ingredients}
              />
            </div>
          </section>

          {recipe.affiliates.length > 0 && (
            <section>
              <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
                Utensílios recomendados
              </h2>
              <ul className="mt-4 space-y-2">
                {recipe.affiliates.map((a) => (
                  <li key={a.id}>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary underline hover:text-accent"
                    >
                      {a.name}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
              Modo de preparo
            </h2>
            <ol className="mt-4 list-decimal space-y-4 pl-5 text-sm">
              {recipe.steps.map((step, i) => (
                <li key={step.id} className="leading-relaxed">
                  {step.text}
                </li>
              ))}
            </ol>
          </section>

          {embedUrl && (
            <section>
              <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
                Vídeo
              </h2>
              <div className="mt-4 aspect-video overflow-hidden rounded">
                <iframe
                  src={embedUrl}
                  title={`Vídeo: ${recipe.title}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          )}

          <RecipeAssistant recipeSlug={recipe.slug} recipeTitle={recipe.title} />

          <CommentsSection recipeId={recipe.id} comments={recipe.comments ?? []} />
        </div>

        <aside className="hidden lg:block">
          <AdSlot slot={2} />
        </aside>
      </div>

      <KitchenMode steps={recipe.steps} title={recipe.title} />
      <AdSlot slot={3} />
    </article>
  );
}
