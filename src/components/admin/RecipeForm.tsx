"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X } from "lucide-react";
import { Button, Input, Label, Textarea } from "@/components/ui/form";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { INGREDIENT_UNITS } from "@/lib/constants";
import type { Recipe, Ingredient, Step, AffiliateProduct, RecipeImage } from "@prisma/client";

type RecipeFormData = Recipe & {
  ingredients: Ingredient[];
  steps: Step[];
  affiliates: AffiliateProduct[];
  images?: RecipeImage[];
};

type RecipeFormProps = {
  recipe?: RecipeFormData;
  categories: string[];
};

const emptyIngredient = { quantity: "", unit: "", name: "" };
const emptyStep = { text: "" };
const emptyAffiliate = { name: "", url: "" };

export function RecipeForm({ recipe, categories }: RecipeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);

  const [title, setTitle] = useState(recipe?.title ?? "");
  const [category, setCategory] = useState(recipe?.category ?? "");
  const [newCategory, setNewCategory] = useState(false);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(recipe?.prepTimeMinutes ?? 30);
  const [defaultYield, setDefaultYield] = useState(recipe?.defaultYield ?? 4);
  const [historyHtml, setHistoryHtml] = useState(recipe?.historyHtml ?? "");
  const [videoUrl, setVideoUrl] = useState(recipe?.videoUrl ?? "");
  const [imageUrls, setImageUrls] = useState<string[]>(
    recipe?.images?.length
      ? recipe.images.map((i) => i.url)
      : recipe?.imageUrl
        ? [recipe.imageUrl]
        : [],
  );
  const [published, setPublished] = useState(recipe?.published ?? false);
  const [featured, setFeatured] = useState(recipe?.featured ?? false);
  const [ingredients, setIngredients] = useState(
    recipe?.ingredients.length
      ? recipe.ingredients.map((i) => ({
          quantity: i.quantity,
          unit: i.unit,
          name: i.name,
        }))
      : [emptyIngredient],
  );
  const [steps, setSteps] = useState(
    recipe?.steps.length
      ? recipe.steps.map((s) => ({ text: s.text }))
      : [emptyStep],
  );
  const [affiliates, setAffiliates] = useState(
    recipe?.affiliates.length
      ? recipe.affiliates.map((a) => ({ name: a.name, url: a.url }))
      : [],
  );

  const uploadImage = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (!res.ok) throw new Error("Falha no upload");
    const data = await res.json();
    setImageUrls((prev) => [...prev, data.url]);
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!title.trim()) errs.push("Título é obrigatório");
    if (!category.trim()) errs.push("Categoria é obrigatória");
    if (prepTimeMinutes < 1) errs.push("Tempo de preparo inválido");
    if (defaultYield < 1) errs.push("Rendimento inválido");
    if (!historyHtml.replace(/<[^>]+>/g, "").trim()) errs.push("História da receita é obrigatória");
    const validIngredients = ingredients.filter((i) => i.name.trim());
    if (validIngredients.length === 0) errs.push("Adicione pelo menos um ingrediente");
    const validSteps = steps.filter((s) => s.text.trim());
    if (validSteps.length === 0) errs.push("Adicione pelo menos um passo");
    return errs;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (errs.length > 0) {
      setFieldErrors(errs);
      setError("Corrija os campos indicados abaixo.");
      return;
    }

    setLoading(true);
    setError("");
    setFieldErrors([]);

    const payload = {
      title: title.trim(),
      category: category.trim(),
      prepTimeMinutes,
      defaultYield,
      historyHtml,
      videoUrl: videoUrl || undefined,
      imageUrl: imageUrls[0],
      imageUrls,
      published,
      featured,
      ingredients: ingredients.filter((i) => i.name.trim()),
      steps: steps.filter((s) => s.text.trim()),
      affiliates: affiliates.filter((a) => a.name.trim() && a.url.trim()),
    };

    try {
      const url = recipe
        ? `/api/admin/recipes/${recipe.id}`
        : "/api/admin/recipes";
      const res = await fetch(url, {
        method: recipe ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao salvar");
      router.push("/admin/receitas");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar a receita.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="category">Categoria *</Label>
            {!newCategory ? (
              <div className="flex gap-2">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione...</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <Button type="button" variant="outline" size="sm" onClick={() => setNewCategory(true)}>
                  Nova
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Nome da nova categoria"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewCategory(false);
                    setCategory("");
                  }}
                >
                  Lista
                </Button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prep">Tempo (min) *</Label>
              <Input
                id="prep"
                type="number"
                min={1}
                value={prepTimeMinutes}
                onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="yield">Rendimento *</Label>
              <Input
                id="yield"
                type="number"
                min={1}
                value={defaultYield}
                onChange={(e) => setDefaultYield(Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="video">Link do vídeo (YouTube/Vimeo)</Label>
            <Input id="video" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
          </div>
          <div>
            <Label>Imagens da receita</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                Promise.all(files.map(uploadImage)).catch(() =>
                  setError("Erro no upload da imagem"),
                );
              }}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {imageUrls.map((url, i) => (
                <div key={url} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-20 w-20 rounded object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrls(imageUrls.filter((_, j) => j !== i))}
                    className="absolute -right-1 -top-1 rounded-full bg-red-600 p-0.5 text-white"
                    aria-label="Remover imagem"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publicar receita
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Destaque na listagem
          </label>
        </div>

        <div>
          <Label>História da Receita *</Label>
          <RichTextEditor value={historyHtml} onChange={setHistoryHtml} />
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
          Ingredientes
        </legend>
        {ingredients.map((ing, i) => (
          <div key={i} className="grid grid-cols-12 gap-2">
            <Input
              className="col-span-2"
              placeholder="Qtd"
              value={ing.quantity}
              onChange={(e) => {
                const next = [...ingredients];
                next[i] = { ...ing, quantity: e.target.value };
                setIngredients(next);
              }}
            />
            <select
              className="col-span-2 rounded border border-border bg-background px-2 py-2 text-sm"
              value={ing.unit}
              onChange={(e) => {
                const next = [...ingredients];
                next[i] = { ...ing, unit: e.target.value };
                setIngredients(next);
              }}
            >
              {INGREDIENT_UNITS.map((u) => (
                <option key={u || "vazio"} value={u}>
                  {u || "—"}
                </option>
              ))}
            </select>
            <Input
              className="col-span-7"
              placeholder="Ingrediente"
              value={ing.name}
              onChange={(e) => {
                const next = [...ingredients];
                next[i] = { ...ing, name: e.target.value };
                setIngredients(next);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIngredients(ingredients.filter((_, j) => j !== i))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIngredients([...ingredients, emptyIngredient])}
        >
          <Plus className="mr-1 h-4 w-4" /> Ingrediente
        </Button>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
          Modo de preparo
        </legend>
        {steps.map((step, i) => (
          <div key={i} className="flex gap-2">
            <Textarea
              className="flex-1"
              placeholder={`Passo ${i + 1}`}
              value={step.text}
              onChange={(e) => {
                const next = [...steps];
                next[i] = { text: e.target.value };
                setSteps(next);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSteps(steps.filter((_, j) => j !== i))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setSteps([...steps, emptyStep])}
        >
          <Plus className="mr-1 h-4 w-4" /> Passo
        </Button>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
          Utensílios recomendados (afiliados)
        </legend>
        {affiliates.map((aff, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Nome do produto"
              value={aff.name}
              onChange={(e) => {
                const next = [...affiliates];
                next[i] = { ...aff, name: e.target.value };
                setAffiliates(next);
              }}
            />
            <div className="flex gap-2">
              <Input
                placeholder="URL de afiliado"
                value={aff.url}
                onChange={(e) => {
                  const next = [...affiliates];
                  next[i] = { ...aff, url: e.target.value };
                  setAffiliates(next);
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setAffiliates(affiliates.filter((_, j) => j !== i))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setAffiliates([...affiliates, emptyAffiliate])}
        >
          <Plus className="mr-1 h-4 w-4" /> Produto
        </Button>
      </fieldset>

      {fieldErrors.length > 0 && (
        <ul className="list-inside list-disc text-sm text-red-700">
          {fieldErrors.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      )}
      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar receita"}
        </Button>
        <Link href="/admin/receitas">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </Link>
      </div>
    </form>
  );
}
