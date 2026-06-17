import type { Recipe, Ingredient, Step, AffiliateProduct, Comment, User, RecipeImage } from "@prisma/client";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

export type RecipeWithRelations = Recipe & {
  ingredients: Ingredient[];
  steps: Step[];
  affiliates: AffiliateProduct[];
  images?: RecipeImage[];
  comments?: (Comment & {
    user: Pick<User, "id" | "name" | "image" | "role">;
    replies?: (Comment & { user: Pick<User, "id" | "name" | "image" | "role"> })[];
  })[];
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
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });
}

export async function getRecipeBySlug(slug: string) {
  return prisma.recipe.findUnique({
    where: { slug },
    include: {
      ingredients: { orderBy: { sortOrder: "asc" } },
      steps: { orderBy: { sortOrder: "asc" } },
      affiliates: { orderBy: { sortOrder: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
      comments: {
        where: { approved: true, parentId: null },
        include: {
          user: { select: { id: true, name: true, image: true, role: true } },
          replies: {
            where: { approved: true },
            include: {
              user: { select: { id: true, name: true, image: true, role: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getFeaturedRecipes(limit = 6) {
  return prisma.recipe.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    take: limit,
    include: { _count: { select: { comments: true } } },
  });
}

export async function getCategories() {
  const rows = await prisma.recipe.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  return rows.map((r) => r.category).filter(Boolean).sort();
}

export type RecipeInput = {
  title: string;
  category: string;
  prepTimeMinutes: number;
  defaultYield: number;
  historyHtml: string;
  videoUrl?: string;
  imageUrl?: string;
  imageUrls?: string[];
  published?: boolean;
  featured?: boolean;
  ingredients: { quantity: string; unit: string; name: string }[];
  steps: { text: string }[];
  affiliates: { name: string; url: string }[];
};

async function syncRecipeImages(recipeId: string, imageUrls: string[]) {
  await prisma.recipeImage.deleteMany({ where: { recipeId } });
  if (imageUrls.length > 0) {
    await prisma.recipeImage.createMany({
      data: imageUrls.map((url, i) => ({
        recipeId,
        url,
        sortOrder: i,
      })),
    });
  }
}

export async function createRecipe(data: RecipeInput) {
  const slug = slugify(data.title);
  const existing = await prisma.recipe.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
  const imageUrls = data.imageUrls?.length
    ? data.imageUrls
    : data.imageUrl
      ? [data.imageUrl]
      : [];

  const recipe = await prisma.recipe.create({
    data: {
      title: data.title,
      slug: finalSlug,
      category: data.category,
      prepTimeMinutes: data.prepTimeMinutes,
      defaultYield: data.defaultYield,
      historyHtml: data.historyHtml,
      videoUrl: data.videoUrl || null,
      imageUrl: imageUrls[0] ?? data.imageUrl ?? null,
      published: data.published ?? false,
      featured: data.featured ?? false,
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

  await syncRecipeImages(recipe.id, imageUrls);
  return recipe;
}

export async function updateRecipe(id: string, data: RecipeInput) {
  await prisma.ingredient.deleteMany({ where: { recipeId: id } });
  await prisma.step.deleteMany({ where: { recipeId: id } });
  await prisma.affiliateProduct.deleteMany({ where: { recipeId: id } });

  const imageUrls = data.imageUrls?.length
    ? data.imageUrls
    : data.imageUrl
      ? [data.imageUrl]
      : [];

  const recipe = await prisma.recipe.update({
    where: { id },
    data: {
      title: data.title,
      category: data.category,
      prepTimeMinutes: data.prepTimeMinutes,
      defaultYield: data.defaultYield,
      historyHtml: data.historyHtml,
      videoUrl: data.videoUrl || null,
      imageUrl: imageUrls[0] ?? data.imageUrl ?? null,
      published: data.published ?? false,
      featured: data.featured ?? false,
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

  await syncRecipeImages(id, imageUrls);
  return recipe;
}

export async function deleteRecipe(id: string) {
  return prisma.recipe.delete({ where: { id } });
}

export type AdminRecipeSort = "title" | "category" | "avgRating" | "published" | "updatedAt";

export async function getAllRecipesAdmin(
  sort: AdminRecipeSort = "updatedAt",
  order: "asc" | "desc" = "desc",
) {
  return prisma.recipe.findMany({
    orderBy: { [sort]: order },
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
      images: { orderBy: { sortOrder: "asc" } },
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
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });
}
