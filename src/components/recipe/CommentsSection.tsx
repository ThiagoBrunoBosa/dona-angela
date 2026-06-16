"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Star } from "lucide-react";
import { Button, Label, Textarea } from "@/components/ui/form";
import { LoginModal } from "@/components/auth/LoginModal";

type Comment = {
  id: string;
  text: string;
  rating: number;
  createdAt: Date | string;
  user: { name: string | null; image: string | null };
};

type CommentsSectionProps = {
  recipeId: string;
  comments: Comment[];
};

export function CommentsSection({ recipeId, comments }: CommentsSectionProps) {
  const { data: session } = useSession();
  const [showLogin, setShowLogin] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setShowLogin(true);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId, text, rating }),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) {
        setText("");
        setRating(5);
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
        Avaliações e Comentários
      </h2>

      {session ? (
        <form onSubmit={submit} className="mt-4 space-y-4">
          <div>
            <Label>Nota</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} estrelas`}
                  onClick={() => setRating(n)}
                >
                  <Star
                    className={`h-6 w-6 ${
                      n <= rating ? "fill-accent text-accent" : "text-border"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="comment">Comentário</Label>
            <Textarea
              id="comment"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              minLength={10}
              rows={3}
            />
          </div>
          <p className="text-xs text-muted">
            Seu comentário será publicado após moderação.
          </p>
          <Button type="submit" disabled={status === "submitting"}>
            Enviar
          </Button>
          {status === "success" && (
            <p className="text-sm text-primary">Comentário enviado para moderação.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-700">Erro ao enviar. Tente novamente.</p>
          )}
        </form>
      ) : (
        <p className="mt-4 text-sm text-muted">
          <button
            type="button"
            className="text-primary underline"
            onClick={() => setShowLogin(true)}
          >
            Entre
          </button>{" "}
          para avaliar e comentar.
        </p>
      )}

      <ul className="mt-8 space-y-6">
        {comments.map((c) => (
          <li key={c.id} className="rounded border border-border p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{c.user.name ?? "Usuário"}</span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < c.rating ? "fill-accent text-accent" : "text-border"
                    }`}
                    aria-hidden
                  />
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm">{c.text}</p>
          </li>
        ))}
      </ul>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </section>
  );
}
