import Link from "next/link";
import { Button } from "@/components/ui/form";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-serif text-3xl italic text-primary">Página não encontrada</h1>
      <p className="mt-4 text-muted">A receita ou página que você busca não existe.</p>
      <Link href="/" className="mt-8 inline-block">
        <Button type="button">Voltar ao início</Button>
      </Link>
    </div>
  );
}
