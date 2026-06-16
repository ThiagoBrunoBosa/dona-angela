import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { getUserFavorites } from "@/lib/services/favorites";
import { Clock } from "lucide-react";

export const metadata = {
  title: "Meu Caderno",
};

export default async function MeuCadernoPage() {
  const session = await auth();
  const favorites = await getUserFavorites(session!.user!.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-3xl italic text-primary">Meu Caderno</h1>
      <p className="mt-2 text-sm text-muted">Suas receitas favoritas</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((fav) => (
          <Link
            key={fav.id}
            href={`/receitas/${fav.recipe.slug}`}
            className="overflow-hidden rounded border border-border hover:border-primary/40"
          >
            {fav.recipe.imageUrl && (
              <div className="relative aspect-[4/3]">
                <Image
                  src={fav.recipe.imageUrl}
                  alt={fav.recipe.title}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="font-serif italic text-primary">{fav.recipe.title}</h2>
              <span className="mt-1 flex items-center gap-1 text-xs text-muted">
                <Clock className="h-3 w-3" />
                {fav.recipe.prepTimeMinutes} min
              </span>
            </div>
          </Link>
        ))}
      </div>

      {favorites.length === 0 && (
        <p className="mt-8 text-muted">
          Você ainda não salvou receitas.{" "}
          <Link href="/receitas" className="text-primary underline">
            Explorar receitas
          </Link>
        </p>
      )}
    </div>
  );
}
