"use server";

import { deleteComment } from "@/lib/services/comments";
import { revalidatePath } from "next/cache";

export async function deleteCommentAction(id: string) {
  await deleteComment(id);
  revalidatePath("/admin/comentarios");
}
