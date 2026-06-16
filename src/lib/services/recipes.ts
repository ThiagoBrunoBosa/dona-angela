import type { Recipe, Ingredient, Step, AffiliateProduct, Comment, User } from "@prisma/client";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

export type RecipeWithRelations = Recipe & {
  ingredients: Ingredient[];
  steps: Step[];
  affiliates: AffiliateProduct[];
  comments?: (Comment & { user: Pick<User, "id" | "name" | "image"> })[];
  _count?: { favorites: number; comments: number };
};

export async function getPublishedRecipes(category?: string) {
  return prisma.recipe.findMany({
    where: {
      published: true,
      ...(category ? { category } : {}),
    },
    include: {
      ingredients: { orderBy: { sortOrder: "asc" }, take: 3 },
      _count: { select: { comments: true, favorites: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRecipeBySlug(slug: string) {
  return prisma.recipe.findUnique({
    where: { slug },
    include: {
      ingredients: { orderBy: { sortOrder: "asc" } },
      steps: { orderBy: { sortOrder: "asc" } },
      affiliates: { orderBy: { sortOrder: "asc" } },
      comments: {
        where: { approved: true },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getFeaturedRecipes(limit = 6) {
  return prisma.recipe.findMany({
    where: { published: true },
    orderBy: [{ avgRating: "desc" }, { createdAt: "desc" }],
    take: limit,
    include: { _count: { select: { comments: true } } },
  });
}

export async function getCategories() {
  const rows = await prisma.recipe.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ["category"],
  });
  return rows.map((r) => r.category).sort();
}

export type RecipeInput = {
  title: string;
  category: string;
  prepTimeMinutes: number;
  defaultYield: number;
  historyHtml: string;
  videoUrl?: string;
  imageUrl?: string;
  published?: boolean;
  ingredients: { quantity: string; unit: string; name: string }[];
  steps: { text: string }[];
  affiliates: { name: string; url: string }[];
};

export async function createRecipe(data: RecipeInput) {
  const slug = slugify(data.title);
  const existing = await prisma.recipe.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  return prisma.recipe.create({
    data: {
      title: data.title,
      slug: finalSlug,
      category: data.category,
      prepTimeMinutes: data.prepTimeMinutes,
      defaultYield: data.defaultYield,
      historyHtml: data.historyHtml,
      videoUrl: data.videoUrl || null,
      imageUrl: data.imageUrl || null,
      published: data.published ?? false,
      ingredients: {
        create: data.ingredients.map((ing, i) => ({
          quantity: ing.quantity,
          unit: ing.unit,
          name: ing.name,
          sortOrder: i,
        })),
      },
      steps: {
        create: data.steps.map((step, i) => ({
          text: step.text,
          sortOrder: i,
        })),
      },
      affiliates: {
        create: data.affiliates.map((aff, i) => ({
          name: aff.name,
          url: aff.url,
          sortOrder: i,
        })),
      },
    },
  });
}

export async function updateRecipe(id: string, data: RecipeInput) {
  await prisma.ingredient.deleteMany({ where: { recipeId: id } });
  await prisma.step.deleteMany({ where: { recipeId: id } });
  await prisma.affiliateProduct.deleteMany({ where: { recipeId: id } });

  return prisma.recipe.update({
    where: { id },
    data: {
      title: data.title,
      category: data.category,
      prepTimeMinutes: data.prepTimeMinutes,
      defaultYield: data.defaultYield,
      historyHtml: data.historyHtml,
      videoUrl: data.videoUrl || null,
      imageUrl: data.imageUrl || null,
      published: data.published ?? false,
      ingredients: {
        create: data.ingredients.map((ing, i) => ({
          quantity: ing.quantity,
          unit: ing.unit,
          name: ing.name,
          sortOrder: i,
        })),
      },
      steps: {
        create: data.steps.map((step, i) => ({
          text: step.text,
          sortOrder: i,
        })),
      },
      affiliates: {
        create: data.affiliates.map((aff, i) => ({
          name: aff.name,
          url: aff.url,
          sortOrder: i,
        })),
      },
    },
  });
}

export async function deleteRecipe(id: string) {
  return prisma.recipe.delete({ where: { id } });
}

export async function getAllRecipesAdmin() {
  return prisma.recipe.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { comments: true, favorites: true } },
    },
  });
}

export async function getRecipeById(id: string) {
  return prisma.recipe.findUnique({
    where: { id },
    include: {
      ingredients: { orderBy: { sortOrder: "asc" } },
      steps: { orderBy: { sortOrder: "asc" } },
      affiliates: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function searchRecipes(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return prisma.recipe.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
        { ingredients: { some: { name: { contains: q, mode: "insensitive" } } } },
      ],
    },
    include: { _count: { select: { comments: true } } },
    take: 20,
  });
}
