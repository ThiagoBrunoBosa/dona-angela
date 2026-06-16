import { getAllComments } from "@/lib/services/comments";
import { approveCommentAction, deleteCommentAction } from "./actions";
import { Button } from "@/components/ui/form";
import { Star } from "lucide-react";
import Link from "next/link";

export default async function AdminCommentsPage() {
  const comments = await getAllComments();

  return (
    <div>
      <h1 className="font-serif text-3xl italic text-primary">Moderação de comentários</h1>
      <ul className="mt-6 space-y-4">
        {comments.map((c) => (
          <li
            key={c.id}
            className={`rounded border p-4 ${
              c.approved ? "border-border" : "border-accent bg-accent/5"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-medium">{c.user.name ?? c.user.email}</span>
                <span className="mx-2 text-muted">em</span>
                <Link href={`/receitas/${c.recipe.slug}`} className="text-primary hover:underline">
                  {c.recipe.title}
                </Link>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < c.rating ? "fill-accent text-accent" : "text-border"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm">{c.text}</p>
            <div className="mt-3 flex gap-2">
              {!c.approved && (
                <form action={approveCommentAction.bind(null, c.id)}>
                  <Button type="submit" size="sm">
                    Aprovar
                  </Button>
                </form>
              )}
              <form action={deleteCommentAction.bind(null, c.id)}>
                <Button type="submit" variant="outline" size="sm">
                  Remover
                </Button>
              </form>
            </div>
          </li>
        ))}
        {comments.length === 0 && (
          <p className="text-muted">Nenhum comentário.</p>
        )}
      </ul>
    </div>
  );
}
