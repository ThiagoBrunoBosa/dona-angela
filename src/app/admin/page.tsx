import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminStats } from "@/lib/services/ratings";
import { Star } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/");

  const stats = await getAdminStats();

  const cards = [
    { label: "Receitas", value: stats.recipes, href: "/admin/receitas" },
    { label: "Usuários", value: stats.users, href: "/admin/usuarios" },
    { label: "Respostas admin", value: stats.pendingComments, href: "/admin/comentarios" },
    { label: "Total comentários", value: stats.totalComments, href: "/admin/comentarios" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl italic text-primary">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded border border-border p-4 transition hover:border-primary/40 hover:bg-primary/5"
          >
            <p className="text-sm text-muted">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
          Melhor avaliadas
        </h2>
        <ul className="mt-4 space-y-2">
          {stats.topRated.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/admin/receitas/${r.id}/editar`}
                className="flex items-center gap-2 text-sm hover:text-primary"
              >
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
