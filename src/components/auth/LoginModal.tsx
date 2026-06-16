"use client";

import Link from "next/link";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
};

export function LoginModal({ open, onClose }: LoginModalProps) {
  if (!open) return null;

  return (
    <dialog open className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop:bg-black/40">
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-xl">
        <h2 className="font-serif text-xl italic text-primary">Acesso necessário</h2>
        <p className="mt-2 text-sm text-muted">
          Faça login ou crie uma conta para salvar receitas e comentar.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/entrar"
            className="rounded bg-primary px-4 py-2 font-heading text-xs font-bold uppercase tracking-widest text-background"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded border border-primary px-4 py-2 font-heading text-xs font-bold uppercase tracking-widest text-primary"
          >
            Cadastrar
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-sm text-muted hover:text-foreground"
          >
            Fechar
          </button>
        </div>
      </div>
    </dialog>
  );
}
