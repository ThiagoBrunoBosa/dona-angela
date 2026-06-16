import { prisma } from "@/lib/db";

export async function getPendingComments() {
  return prisma.comment.findMany({
    where: { approved: false },
    include: {
      user: { select: { name: true, email: true, image: true } },
      recipe: { select: { title: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllComments() {
  return prisma.comment.findMany({
    include: {
      user: { select: { name: true, email: true, image: true } },
      recipe: { select: { title: true, slug: true } },
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
  return prisma.comment.create({
    data: { userId, recipeId, text, rating, approved: false },
  });
}

export async function approveComment(id: string) {
  const comment = await prisma.comment.update({
    where: { id },
    data: { approved: true },
    include: { recipe: true },
  });
  const { updateRecipeRating } = await import("@/lib/services/ratings");
  await updateRecipeRating(comment.recipeId);
  return comment;
}

export async function deleteComment(id: string) {
  const comment = await prisma.comment.delete({ where: { id } });
  const { updateRecipeRating } = await import("@/lib/services/ratings");
  await updateRecipeRating(comment.recipeId);
  return comment;
}
