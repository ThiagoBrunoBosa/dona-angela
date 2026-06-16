"use server";

import { approveComment, deleteComment } from "@/lib/services/comments";
import { revalidatePath } from "next/cache";

export async function approveCommentAction(id: string) {
  await approveComment(id);
  revalidatePath("/admin/comentarios");
}

export async function deleteCommentAction(id: string) {
  await deleteComment(id);
  revalidatePath("/admin/comentarios");
}
