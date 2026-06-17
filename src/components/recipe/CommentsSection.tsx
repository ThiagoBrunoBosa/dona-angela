"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Star } from "lucide-react";
import { Button, Label, Textarea } from "@/components/ui/form";
import { LoginModal } from "@/components/auth/LoginModal";
import type { Role } from "@prisma/client";

type CommentUser = {
  name: string | null;
  image: string | null;
  role?: Role;
};

type Comment = {
  id: string;
  text: string;
  rating: number;
  createdAt: Date | string;
  user: CommentUser;
  replies?: Comment[];
};

type CommentsSectionProps = {
  recipeId: string;
  comments: Comment[];
};

function formatDate(d: Date | string) {
  return new Date(d).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CommentsSection({ recipeId, comments: initial }: CommentsSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initial);
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
    if (!text.trim()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId, text: text.trim(), rating }),
      });
      if (res.ok) {
        const created = await res.json();
        setComments((prev) => [
          {
            id: created.id,
            text: created.text,
            rating: created.rating,
            createdAt: created.createdAt,
            user: {
              name: session.user?.name ?? null,
              image: session.user?.image ?? null,
            },
            replies: [],
          },
          ...prev,
        ]);
        setText("");
        setRating(5);
        setStatus("success");
      } else {
        setStatus("error");
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
              rows={3}
            />
          </div>
          <Button type="submit" disabled={status === "submitting"}>
            Enviar
          </Button>
          {status === "success" && (
            <p className="text-sm text-primary">Comentário publicado.</p>
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
          <CommentItem key={c.id} comment={c} recipeId={recipeId} />
        ))}
      </ul>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </section>
  );
}

function CommentItem({
  comment: c,
  recipeId,
}: {
  comment: Comment;
  recipeId: string;
}) {
  const { data: session } = useSession();
  const [replies, setReplies] = useState(c.replies ?? []);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const isAdmin = session?.user?.role === "ADMIN";

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplying(true);
    try {
      const res = await fetch("/api/comments/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId,
          parentId: c.id,
          text: replyText.trim(),
        }),
      });
      if (res.ok) {
        const reply = await res.json();
        setReplies((prev) => [
          ...prev,
          {
            id: reply.id,
            text: reply.text,
            rating: 5,
            createdAt: reply.createdAt,
            user: {
              name: session?.user?.name ?? "Dona Angela",
              image: session?.user?.image ?? null,
              role: "ADMIN" as Role,
            },
          },
        ]);
        setReplyText("");
      }
    } finally {
      setReplying(false);
    }
  };

  return (
    <li className="rounded border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{c.user.name ?? "Usuário"}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">{formatDate(c.createdAt)}</span>
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
      </div>
      <p className="mt-2 text-sm">{c.text}</p>

      {replies.length > 0 && (
        <ul className="mt-4 space-y-3 border-l-2 border-accent/30 pl-4">
          {replies.map((r) => (
            <li key={r.id}>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium">
                  {r.user.role === "ADMIN" ? "Dona Angela" : (r.user.name ?? "Usuário")}
                </span>
                {r.user.role === "ADMIN" && (
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] uppercase text-primary">
                    Admin
                  </span>
                )}
                <span className="text-xs text-muted">{formatDate(r.createdAt)}</span>
              </div>
              <p className="mt-1 text-sm">{r.text}</p>
            </li>
          ))}
        </ul>
      )}

      {isAdmin && (
        <form onSubmit={sendReply} className="mt-4 space-y-2">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Responder como Dona Angela..."
            rows={2}
          />
          <Button type="submit" size="sm" disabled={replying}>
            Responder
          </Button>
        </form>
      )}
    </li>
  );
}
