import { prisma } from "@/lib/db";
import { parseIngredientTerms } from "@/lib/parse-ingredient-terms";

function normalizeIngredient(term: string): string {
  return term
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export type FridgeSearchResult = {
  exact: Awaited<ReturnType<typeof getExactMatches>>;
  approximate: Awaited<ReturnType<typeof getApproximateMatches>>;
};

async function getRecipesWithIngredients() {
  return prisma.recipe.findMany({
    where: { published: true },
    include: {
      ingredients: true,
      _count: { select: { comments: true } },
    },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });
}

async function getExactMatches(terms: string[]) {
  const recipes = await getRecipesWithIngredients();
  const normalized = terms.map(normalizeIngredient).filter(Boolean);

  return recipes.filter((recipe) => {
    const names = recipe.ingredients.map((i) => normalizeIngredient(i.name));
    return normalized.every((term) =>
      names.some((name) => name.includes(term) || term.includes(name)),
    );
  });
}

async function getApproximateMatches(terms: string[], limit = 3) {
  const recipes = await getRecipesWithIngredients();
  const normalized = terms.map(normalizeIngredient).filter(Boolean);

  return recipes
    .map((recipe) => {
      const names = recipe.ingredients.map((i) => normalizeIngredient(i.name));
      const matches = normalized.filter((term) =>
        names.some((name) => name.includes(term) || term.includes(name)),
      ).length;
      return { recipe, matches };
    })
    .filter((s) => s.matches > 0)
    .sort((a, b) => b.matches - a.matches)
    .slice(0, limit)
    .map((s) => s.recipe);
}

export async function searchByFridge(input: string): Promise<FridgeSearchResult> {
  const terms = parseIngredientTerms(input);

  if (terms.length === 0) {
    return { exact: [], approximate: [] };
  }

  const exact = await getExactMatches(terms);
  const approximate =
    exact.length === 0 ? await getApproximateMatches(terms) : [];

  return { exact, approximate };
}
