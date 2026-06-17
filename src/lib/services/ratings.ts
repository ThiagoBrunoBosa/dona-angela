import { prisma } from "@/lib/db";

export async function updateRecipeRating(recipeId: string) {
  const result = await prisma.comment.aggregate({
    where: { recipeId, approved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.recipe.update({
    where: { id: recipeId },
    data: { avgRating: result._avg.rating ?? 0 },
  });
}

export async function getAdminStats() {
  const [recipes, users, pendingComments, totalComments] = await Promise.all([
    prisma.recipe.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.comment.count({ where: { parentId: { not: null } } }),
    prisma.comment.count(),
  ]);

  const topRated = await prisma.recipe.findMany({
    where: { published: true, avgRating: { gt: 0 } },
    orderBy: { avgRating: "desc" },
    take: 5,
    select: { id: true, title: true, slug: true, avgRating: true },
  });

  return { recipes, users, pendingComments, totalComments, topRated };
}
