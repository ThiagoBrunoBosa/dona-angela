import Link from "next/link";
import { getAllComments } from "@/lib/services/comments";
import { getAllRecipesAdmin } from "@/lib/services/recipes";
import { deleteCommentAction } from "./actions";
import { AdminCommentFilters } from "@/components/admin/AdminCommentFilters";
import { AdminCommentReply } from "@/components/admin/AdminCommentReply";
import { Button } from "@/components/ui/form";
import { Star } from "lucide-react";

type Props = {
  searchParams: Promise<{
    recipeId?: string;
    from?: string;
    to?: string;
  }>;
};

function formatDt(d: Date) {
  return new Date(d).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminCommentsPage({ searchParams }: Props) {
  const { recipeId, from, to } = await searchParams;
  const [comments, recipes] = await Promise.all([
    getAllComments({
      recipeId: recipeId || undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(`${to}T23:59:59`) : undefined,
    }),
    getAllRecipesAdmin(),
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl italic text-primary">Comentários</h1>

      <AdminCommentFilters
        recipes={recipes.map((r) => ({ id: r.id, title: r.title }))}
        recipeId={recipeId}
        from={from}
        to={to}
      />

      <ul className="mt-6 space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="rounded border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-medium">{c.user.name ?? c.user.email}</span>
                <span className="mx-2 text-muted">em</span>
                <Link
                  href={`/receitas/${c.recipe.slug}`}
                  className="text-primary hover:underline"
                >
                  {c.recipe.title}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">{formatDt(c.createdAt)}</span>
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
            </div>
            <p className="mt-2 text-sm">{c.text}</p>

            {c.replies.length > 0 && (
              <ul className="mt-4 space-y-2 border-l-2 border-accent/30 pl-4">
                {c.replies.map((r) => (
                  <li key={r.id} className="text-sm">
                    <span className="font-medium">
                      {r.user.role === "ADMIN" ? "Dona Angela" : (r.user.name ?? "Usuário")}
                    </span>
                    <span className="ml-2 text-xs text-muted">
                      {formatDt(r.createdAt)}
                    </span>
                    <p className="mt-1">{r.text}</p>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              <AdminCommentReply
                recipeId={c.recipeId}
                parentId={c.id}
              />
              <form action={deleteCommentAction.bind(null, c.id)}>
                <Button type="submit" variant="outline" size="sm">
                  Excluir
                </Button>
              </form>
            </div>
          </li>
        ))}
        {comments.length === 0 && (
          <p className="text-muted">Nenhum comentário encontrado.</p>
        )}
      </ul>
    </div>
  );
}
