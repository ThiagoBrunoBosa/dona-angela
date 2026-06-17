"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Suggestion = {
  type: "recipe" | "category" | "ingredient";
  label: string;
  href: string;
};

type SearchBarProps = {
  className?: string;
  defaultValue?: string;
  compact?: boolean;
};

export function SearchBar({
  className,
  defaultValue = "",
  compact = false,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(query)}`);
      if (res.ok) setSuggestions(await res.json());
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div ref={wrapRef} className={cn("relative w-full", className)}>
      <form
        onSubmit={submit}
        className={cn(
          "flex overflow-hidden rounded-full border-2 border-accent bg-background shadow-sm",
          compact ? "max-w-[200px] md:max-w-xs" : "max-w-2xl",
        )}
      >
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={
            compact
              ? "Buscar..."
              : "Procure uma receita, um ingrediente, um tipo de prato..."
          }
          className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-muted"
          aria-label="Buscar receitas"
        />
        <button
          type="submit"
          className="flex shrink-0 items-center gap-1 bg-accent px-4 py-2.5 font-heading text-xs font-bold uppercase tracking-widest text-background hover:bg-accent/90"
        >
          <Search className="h-4 w-4 md:hidden" />
          <span className="hidden md:inline">Procurar</span>
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-auto rounded border border-border bg-background shadow-lg">
          {suggestions.map((s, i) => (
            <li key={`${s.type}-${s.label}-${i}`}>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-border/30"
                onClick={() => {
                  setOpen(false);
                  router.push(s.href);
                }}
              >
                <span className="rounded bg-border/50 px-1.5 py-0.5 text-[10px] uppercase text-muted">
                  {s.type === "recipe"
                    ? "Receita"
                    : s.type === "category"
                      ? "Categoria"
                      : "Ingrediente"}
                </span>
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
