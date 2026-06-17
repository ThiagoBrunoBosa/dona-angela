import { prisma } from "@/lib/db";

export async function getAllComments(filters?: {
  recipeId?: string;
  from?: Date;
  to?: Date;
}) {
  return prisma.comment.findMany({
    where: {
      parentId: null,
      ...(filters?.recipeId ? { recipeId: filters.recipeId } : {}),
      ...(filters?.from || filters?.to
        ? {
            createdAt: {
              ...(filters.from ? { gte: filters.from } : {}),
              ...(filters.to ? { lte: filters.to } : {}),
            },
          }
        : {}),
    },
    include: {
      user: { select: { name: true, email: true, image: true, role: true } },
      recipe: { select: { id: true, title: true, slug: true } },
      replies: {
        include: {
          user: { select: { name: true, email: true, image: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createComment(
  userId: string,
  recipeId: string,
  text: string,
  rating: number,
) {
  const comment = await prisma.comment.create({
    data: { userId, recipeId, text, rating, approved: true },
  });
  const { updateRecipeRating } = await import("@/lib/services/ratings");
  await updateRecipeRating(recipeId);
  return comment;
}

export async function createCommentReply(
  userId: string,
  recipeId: string,
  parentId: string,
  text: string,
) {
  return prisma.comment.create({
    data: {
      userId,
      recipeId,
      parentId,
      text,
      rating: 5,
      approved: true,
    },
  });
}

export async function deleteComment(id: string) {
  const comment = await prisma.comment.delete({ where: { id } });
  const { updateRecipeRating } = await import("@/lib/services/ratings");
  await updateRecipeRating(comment.recipeId);
  return comment;
}
