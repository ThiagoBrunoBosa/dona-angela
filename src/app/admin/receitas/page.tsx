import Link from "next/link";
import { getAllRecipesAdmin, type AdminRecipeSort } from "@/lib/services/recipes";
import { Star, Plus, Pencil, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/form";

type Props = {
  searchParams: Promise<{
    sort?: AdminRecipeSort;
    order?: "asc" | "desc";
  }>;
};

function sortLink(
  field: AdminRecipeSort,
  current: AdminRecipeSort | undefined,
  order: "asc" | "desc" | undefined,
) {
  const nextOrder = current === field && order === "asc" ? "desc" : "asc";
  return `/admin/receitas?sort=${field}&order=${nextOrder}`;
}

export default async function AdminRecipesPage({ searchParams }: Props) {
  const { sort = "updatedAt", order = "desc" } = await searchParams;
  const recipes = await getAllRecipesAdmin(sort, order);

  const headers: { key: AdminRecipeSort; label: string }[] = [
    { key: "title", label: "Título" },
    { key: "category", label: "Categoria" },
    { key: "avgRating", label: "Avaliação" },
    { key: "published", label: "Status" },
  ];

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
              {headers.map((h) => (
                <th key={h.key} className="py-2 pr-4">
                  <Link
                    href={sortLink(h.key, sort, order)}
                    className="inline-flex items-center gap-1 hover:text-primary"
                  >
                    {h.label}
                    <ArrowUpDown className="h-3 w-3" />
                  </Link>
                </th>
              ))}
              <th className="py-2">Destaque</th>
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
                <td className="py-3 pr-4">
                  {r.featured ? (
                    <span className="rounded bg-accent/20 px-2 py-0.5 text-xs text-accent">
                      Sim
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
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
