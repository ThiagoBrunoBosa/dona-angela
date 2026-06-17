"use client";

import { useState, useCallback, useEffect } from "react";
import { Flame, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/form";

type KitchenModeProps = {
  steps: { id: string; text: string }[];
  title: string;
};

export function KitchenMode({ steps, title }: KitchenModeProps) {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const exit = useCallback(() => {
    setActive(false);
    setStepIndex(0);
    document.documentElement.classList.remove("kitchen-mode-active");
  }, []);

  const enter = useCallback(async () => {
    setActive(true);
    setStepIndex(0);
    document.documentElement.classList.add("kitchen-mode-active");
    try {
      if ("wakeLock" in navigator) {
        await navigator.wakeLock.request("screen");
      }
    } catch {
      /* wake lock optional */
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exit();
      if (e.key === "ArrowRight") setStepIndex((i) => Math.min(steps.length - 1, i + 1));
      if (e.key === "ArrowLeft") setStepIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, exit, steps.length]);

  if (steps.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-20 right-4 z-40 lg:bottom-6">
        <Button type="button" onClick={enter} className="shadow-lg">
          <Flame className="mr-2 h-4 w-4" />
          Modo Cozinha
        </Button>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-background"
          role="dialog"
          aria-modal="true"
          aria-label="Modo cozinha"
        >
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="font-heading text-xs uppercase tracking-widest text-primary">
              Modo Cozinha — {title}
            </p>
            <button
              type="button"
              onClick={exit}
              className="rounded p-2 hover:bg-border/40"
              aria-label="Fechar modo cozinha"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            <p className="font-heading text-sm uppercase tracking-widest text-muted">
              Passo {stepIndex + 1} de {steps.length}
            </p>
            <p className="mt-8 max-w-2xl font-narrative text-2xl leading-relaxed text-foreground md:text-3xl">
              {steps[stepIndex]?.text}
            </p>
          </div>

          <footer className="flex items-center justify-between border-t border-border px-4 py-4">
            <Button
              type="button"
              variant="outline"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((i) => i - 1)}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Anterior
            </Button>
            {stepIndex < steps.length - 1 ? (
              <Button type="button" onClick={() => setStepIndex((i) => i + 1)}>
                Próximo
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button type="button" onClick={exit}>
                Concluir
              </Button>
            )}
          </footer>
        </div>
      )}
    </>
  );
}
