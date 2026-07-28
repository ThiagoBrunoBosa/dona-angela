"use client";

import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { useSiteSettings } from "@/components/SettingsProvider";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.4 3.3-3.4.9 0 1.9.2 1.9.2v2.1h-1.1c-1.1 0-1.4.7-1.4 1.3V12h2.4l-.4 2.9h-2v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" />
    </svg>
  );
}

export function Footer() {
  const { instagramUrl, youtubeUrl, facebookUrl, tiktokUrl } = useSiteSettings();
  const social = [
    { href: instagramUrl, label: "Instagram", Icon: InstagramIcon },
    { href: youtubeUrl, label: "YouTube", Icon: YoutubeIcon },
    { href: facebookUrl, label: "Facebook", Icon: FacebookIcon },
    { href: tiktokUrl, label: "TikTok", Icon: TikTokIcon },
  ].filter((s) => s.href);

  return (
    <footer role="contentinfo" className="mt-auto border-t border-border bg-background/90 backdrop-blur">
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
            <Link href="/quem-somos" className="hover:text-primary">
              Quem somos
            </Link>
            <Link href="/contato" className="hover:text-primary">
              Contato
            </Link>
            <Link href="/privacy" className="hover:text-primary">
              Política de Privacidade
            </Link>
          </nav>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Vó Angela. Todos os direitos reservados.
          </p>
        </div>

        {social.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {social.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="rounded-full p-2 text-muted transition hover:bg-border/40 hover:text-primary"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        )}

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
