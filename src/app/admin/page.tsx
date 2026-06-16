import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminStats } from "@/lib/services/ratings";
import { Star } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/");

  const stats = await getAdminStats();

  return (
    <div>
      <h1 className="font-serif text-3xl italic text-primary">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Receitas", value: stats.recipes },
          { label: "Usuários", value: stats.users },
          { label: "Comentários pendentes", value: stats.pendingComments },
          { label: "Total comentários", value: stats.totalComments },
        ].map((s) => (
          <div key={s.label} className="rounded border border-border p-4">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
          Melhor avaliadas
        </h2>
        <ul className="mt-4 space-y-2">
          {stats.topRated.map((r) => (
            <li key={r.slug}>
              <Link href={`/admin/receitas`} className="flex items-center gap-2 text-sm hover:text-primary">
                {r.title}
                <span className="flex items-center gap-1 text-accent">
                  <Star className="h-3 w-3 fill-accent" />
                  {r.avgRating.toFixed(1)}
                </span>
              </Link>
            </li>
          ))}
          {stats.topRated.length === 0 && (
            <li className="text-sm text-muted">Nenhuma avaliação ainda.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
