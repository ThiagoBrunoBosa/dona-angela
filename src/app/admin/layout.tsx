import Link from "next/link";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/layout/Logo";

const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/receitas", label: "Receitas" },
  { href: "/admin/comentarios", label: "Comentários" },
];

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo showTagline={false} size="sm" />
          <span className="font-heading text-xs uppercase tracking-widest text-muted">
            Painel Admin — {session?.user?.email}
          </span>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
        <nav aria-label="Admin" className="w-48 shrink-0 space-y-2">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded px-3 py-2 text-sm hover:bg-border/40"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/" className="block px-3 py-2 text-sm text-muted hover:text-foreground">
            ← Voltar ao site
          </Link>
        </nav>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
