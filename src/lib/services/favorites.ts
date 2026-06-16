import { prisma } from "@/lib/db";

export async function toggleFavorite(userId: string, recipeId: string) {
  const existing = await prisma.favorite.findUnique({
    where: { userId_recipeId: { userId, recipeId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { favorited: false };
  }

  await prisma.favorite.create({ data: { userId, recipeId } });
  return { favorited: true };
}

export async function isFavorited(userId: string, recipeId: string) {
  const fav = await prisma.favorite.findUnique({
    where: { userId_recipeId: { userId, recipeId } },
  });
  return !!fav;
}

export async function getUserFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    include: {
      recipe: {
        include: { _count: { select: { comments: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
