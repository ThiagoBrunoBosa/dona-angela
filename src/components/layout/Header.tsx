"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User, LogOut, BookOpen, Shield } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { SearchBar } from "@/components/search/SearchBar";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/receitas", label: "Receitas" },
];

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header role="banner" className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Logo size="sm" />

        <nav aria-label="Principal" className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={cn(
                "font-heading text-xs font-medium uppercase tracking-widest transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 justify-center px-4 md:flex">
          <SearchBar compact className="max-w-md" />
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              <Link
                href="/meu-caderno"
                className="flex items-center gap-1 font-heading text-xs uppercase tracking-widest hover:text-primary"
              >
                <BookOpen className="h-4 w-4" aria-hidden />
                Caderno
              </Link>
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1 font-heading text-xs uppercase tracking-widest hover:text-primary"
                >
                  <Shield className="h-4 w-4" aria-hidden />
                  Admin
                </Link>
              )}
              <Link
                href="/minha-conta"
                aria-label="Minha conta"
                className="rounded-full p-2 hover:bg-border/40"
              >
                <User className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                aria-label="Sair"
                className="rounded-full p-2 hover:bg-border/40"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link
              href="/entrar"
              className="rounded border border-primary bg-primary px-4 py-2 font-heading text-xs font-bold uppercase tracking-widest text-background transition hover:bg-primary/90"
            >
              Entrar
            </Link>
          )}
        </div>

        <button
          type="button"
          className="rounded p-2 md:hidden"
          aria-label="Abrir menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Menu mobile"
          className="border-t border-border px-4 py-4 md:hidden"
        >
          <SearchBar className="mb-4" />
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-heading text-sm uppercase tracking-widest"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/busca" onClick={() => setOpen(false)}>
              Busca avançada
            </Link>
            {session ? (
              <>
                <Link href="/meu-caderno" onClick={() => setOpen(false)}>
                  Meu Caderno
                </Link>
                <Link href="/minha-conta" onClick={() => setOpen(false)}>
                  Minha Conta
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" onClick={() => setOpen(false)}>
                    Admin
                  </Link>
                )}
                <button type="button" onClick={() => signOut({ callbackUrl: "/" })}>
                  Sair
                </button>
              </>
            ) : (
              <Link href="/entrar" onClick={() => setOpen(false)}>
                Entrar
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
