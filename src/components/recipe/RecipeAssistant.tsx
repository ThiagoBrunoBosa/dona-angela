"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { MessageCircleHeart } from "lucide-react";
import { Button, Label, Textarea } from "@/components/ui/form";
import { LoginModal } from "@/components/auth/LoginModal";

type RecipeAssistantProps = {
  recipeSlug: string;
  recipeTitle: string;
};

export function RecipeAssistant({ recipeSlug, recipeTitle }: RecipeAssistantProps) {
  const { data: session } = useSession();
  const [showLogin, setShowLogin] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAnswer(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/recipes/${recipeSlug}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível obter resposta.");
        return;
      }
      setAnswer(data.answer);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="rounded border border-accent/30 bg-accent/5 p-6"
      aria-labelledby="recipe-assistant-heading"
    >
      <div className="flex items-start gap-3">
        <MessageCircleHeart
          className="mt-0.5 h-6 w-6 shrink-0 text-accent"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h2
            id="recipe-assistant-heading"
            className="font-heading text-sm font-bold uppercase tracking-widest text-primary"
          >
            Pergunte para a Dona Angela
          </h2>
          <p className="mt-1 text-sm text-muted">
            Tire uma dúvida sobre <strong className="font-medium text-foreground">{recipeTitle}</strong>.
            A vovó responde com base nesta receita.
          </p>
        </div>
      </div>

      {session ? (
        <form onSubmit={ask} className="mt-5 space-y-4">
          <div>
            <Label htmlFor="recipe-question">Sua dúvida</Label>
            <Textarea
              id="recipe-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex.: Posso usar margarina no lugar da manteiga?"
              rows={3}
              required
              maxLength={500}
              disabled={loading}
              className="mt-1 font-narrative"
            />
          </div>

          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          {answer && (
            <blockquote className="rounded border-l-4 border-accent bg-background p-4 font-narrative text-sm leading-relaxed text-foreground">
              <p className="mb-2 font-heading text-[10px] font-bold uppercase tracking-widest text-accent">
                Dona Angela diz:
              </p>
              {answer.split("\n").map((line, i) => (
                <p key={i} className={i > 0 ? "mt-2" : undefined}>
                  {line}
                </p>
              ))}
            </blockquote>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={loading || question.trim().length < 3}>
              {loading ? "Pensando..." : "Perguntar"}
            </Button>
            <p className="text-xs text-muted">
              Uma pergunta por vez · resposta gerada por IA
            </p>
          </div>
        </form>
      ) : (
        <div className="mt-5 rounded border border-dashed border-border bg-background/80 p-4 text-sm">
          <p className="text-muted">
            Entre na sua conta para conversar com a Dona Angela sobre esta receita.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={() => setShowLogin(true)}>
              Entrar
            </Button>
            <Link
              href={`/entrar?callbackUrl=/receitas/${recipeSlug}`}
              className="inline-flex items-center rounded border border-primary px-3 py-1.5 font-heading text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5"
            >
              Ir para login
            </Link>
          </div>
        </div>
      )}

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </section>
  );
}
