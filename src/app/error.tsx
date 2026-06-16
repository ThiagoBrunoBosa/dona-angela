"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/form";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-serif text-3xl italic text-primary">Algo deu errado</h1>
      <p className="mt-4 text-muted">Ocorreu um erro inesperado.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Button type="button" onClick={reset}>
          Tentar novamente
        </Button>
        <Link href="/">
          <Button type="button" variant="outline">
            Voltar ao início
          </Button>
        </Link>
      </div>
    </div>
  );
}
