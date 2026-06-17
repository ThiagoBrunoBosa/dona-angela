import { Suspense } from "react";
import { FridgeSearch } from "@/components/search/FridgeSearch";
import { SearchBar } from "@/components/search/SearchBar";

export const metadata = {
  title: "Busca",
};

export default function BuscaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-3xl italic text-primary">Busca</h1>
      <p className="mt-2 text-sm text-muted">
        Encontre receitas por nome ou pelos ingredientes que você tem em casa.
      </p>
      <div className="mt-6">
        <SearchBar />
      </div>
      <div className="mt-10">
        <Suspense fallback={<p>Carregando...</p>}>
          <FridgeSearch />
        </Suspense>
      </div>
    </div>
  );
}
