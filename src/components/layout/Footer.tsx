import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export function Footer() {
  return (
    <footer role="contentinfo" className="mt-auto border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Logo size="sm" />
          <nav aria-label="Rodapé" className="flex flex-wrap gap-4 text-sm text-muted">
            <Link href="/receitas" className="hover:text-primary">
              Receitas
            </Link>
            <Link href="/busca" className="hover:text-primary">
              Busca
            </Link>
            <Link href="/privacy" className="hover:text-primary">
              Política de Privacidade
            </Link>
          </nav>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Dona Angela. Todos os direitos reservados.
          </p>
        </div>
        <p className="mt-6 border-t border-border pt-4 text-center text-xs text-muted">
          Desenvolvido por{" "}
          <a
            href="https://www.lextechsolutions.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent hover:text-primary"
          >
            LexTech Solutions
          </a>
        </p>
      </div>
    </footer>
  );
}
