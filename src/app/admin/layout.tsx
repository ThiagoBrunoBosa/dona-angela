import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Logo } from "@/components/layout/Logo";
import { LogOut } from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/receitas", label: "Receitas" },
  { href: "/admin/comentarios", label: "Comentários" },
  { href: "/admin/usuarios", label: "Usuários" },
  { href: "/admin/configuracoes", label: "Configurações" },
];

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Logo showTagline={false} size="sm" />
          <div className="flex items-center gap-4">
            <span className="hidden font-heading text-xs uppercase tracking-widest text-muted sm:inline">
              Painel Admin — {session?.user?.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-1 rounded p-2 font-heading text-xs uppercase tracking-widest text-muted hover:bg-border/40 hover:text-foreground"
                aria-label="Sair"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-8">
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
