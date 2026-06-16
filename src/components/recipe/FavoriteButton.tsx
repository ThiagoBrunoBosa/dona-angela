"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/form";
import { LoginModal } from "@/components/auth/LoginModal";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  recipeId: string;
  initialFavorited?: boolean;
};

export function FavoriteButton({
  recipeId,
  initialFavorited = false,
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!session) {
      setShowLogin(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      });
      if (res.ok) {
        const data = await res.json();
        setFavorited(data.favorited);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={toggle}
        disabled={loading}
        aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Heart
          className={cn("mr-1 h-4 w-4", favorited && "fill-primary text-primary")}
        />
        {favorited ? "Salva" : "Favoritar"}
      </Button>
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
