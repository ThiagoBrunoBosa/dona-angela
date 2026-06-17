import { prisma } from "@/lib/db";
import { BASE_URL } from "@/lib/utils";
import { searchRecipes, getCategories } from "@/lib/services/recipes";

export type SearchSuggestion = {
  type: "recipe" | "category" | "ingredient";
  label: string;
  href: string;
};

export async function getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const suggestions: SearchSuggestion[] = [];
  const seen = new Set<string>();

  const recipes = await searchRecipes(q);
  for (const r of recipes.slice(0, 5)) {
    const key = `recipe:${r.slug}`;
    if (!seen.has(key)) {
      seen.add(key);
      suggestions.push({
        type: "recipe",
        label: r.title,
        href: `/receitas/${r.slug}`,
      });
    }
  }

  const categories = await getCategories();
  for (const cat of categories) {
    if (cat.toLowerCase().includes(q)) {
      const key = `cat:${cat}`;
      if (!seen.has(key)) {
        seen.add(key);
        suggestions.push({
          type: "category",
          label: cat,
          href: `/receitas?categoria=${encodeURIComponent(cat)}`,
        });
      }
    }
  }

  const ingredients = await prisma.ingredient.findMany({
    where: {
      name: { contains: q, mode: "insensitive" },
      recipe: { published: true },
    },
    select: { name: true, recipe: { select: { slug: true } } },
    take: 20,
  });

  for (const ing of ingredients) {
    const key = `ing:${ing.name}`;
    if (!seen.has(key)) {
      seen.add(key);
      suggestions.push({
        type: "ingredient",
        label: ing.name,
        href: `/receitas/${ing.recipe.slug}`,
      });
    }
    if (suggestions.length >= 10) break;
  }

  return suggestions.slice(0, 10);
}

export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
