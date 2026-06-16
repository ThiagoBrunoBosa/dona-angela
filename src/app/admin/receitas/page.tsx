import Link from "next/link";
import { getAllRecipesAdmin } from "@/lib/services/recipes";
import { Star, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/form";

export default async function AdminRecipesPage() {
  const recipes = await getAllRecipesAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl italic text-primary">Receitas</h1>
        <Link href="/admin/receitas/nova">
          <Button type="button">
            <Plus className="mr-1 h-4 w-4" /> Nova receita
          </Button>
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-4">Título</th>
              <th className="py-2 pr-4">Categoria</th>
              <th className="py-2 pr-4">Rating</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((r) => (
              <tr key={r.id} className="border-b border-border/60">
                <td className="py-3 pr-4 font-medium">{r.title}</td>
                <td className="py-3 pr-4 text-muted">{r.category}</td>
                <td className="py-3 pr-4">
                  <span className="inline-flex items-center gap-1 text-accent">
                    <Star className="h-3 w-3 fill-accent" />
                    {r.avgRating > 0 ? r.avgRating.toFixed(1) : "—"}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  {r.published ? (
                    <span className="text-primary">Publicada</span>
                  ) : (
                    <span className="text-muted">Rascunho</span>
                  )}
                </td>
                <td className="py-3">
                  <Link
                    href={`/admin/receitas/${r.id}/editar`}
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <Pencil className="h-3 w-3" /> Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {recipes.length === 0 && (
          <p className="mt-4 text-muted">Nenhuma receita cadastrada.</p>
        )}
      </div>
    </div>
  );
}
