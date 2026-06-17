"use client";

import { useRouter } from "next/navigation";
import { Input, Label } from "@/components/ui/form";

type Props = {
  recipes: { id: string; title: string }[];
  recipeId?: string;
  from?: string;
  to?: string;
};

export function AdminCommentFilters({ recipes, recipeId, from, to }: Props) {
  const router = useRouter();

  const apply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const rid = fd.get("recipeId") as string;
    const f = fd.get("from") as string;
    const t = fd.get("to") as string;
    if (rid) params.set("recipeId", rid);
    if (f) params.set("from", f);
    if (t) params.set("to", t);
    router.push(`/admin/comentarios?${params.toString()}`);
  };

  return (
    <form onSubmit={apply} className="mt-4 flex flex-wrap items-end gap-4 rounded border border-border p-4">
      <div>
        <Label htmlFor="recipeId">Receita</Label>
        <select
          id="recipeId"
          name="recipeId"
          defaultValue={recipeId ?? ""}
          className="mt-1 rounded border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">Todas</option>
          {recipes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="from">De</Label>
        <Input id="from" name="from" type="date" defaultValue={from ?? ""} />
      </div>
      <div>
        <Label htmlFor="to">Até</Label>
        <Input id="to" name="to" type="date" defaultValue={to ?? ""} />
      </div>
      <button
        type="submit"
        className="rounded bg-primary px-4 py-2 font-heading text-xs font-bold uppercase tracking-widest text-background"
      >
        Filtrar
      </button>
    </form>
  );
}
