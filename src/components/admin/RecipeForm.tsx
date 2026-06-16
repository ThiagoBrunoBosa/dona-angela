"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button, Input, Label, Textarea } from "@/components/ui/form";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import type { Recipe, Ingredient, Step, AffiliateProduct } from "@prisma/client";

type RecipeFormData = Recipe & {
  ingredients: Ingredient[];
  steps: Step[];
  affiliates: AffiliateProduct[];
};

type RecipeFormProps = {
  recipe?: RecipeFormData;
};

const emptyIngredient = { quantity: "", unit: "", name: "" };
const emptyStep = { text: "" };
const emptyAffiliate = { name: "", url: "" };

export function RecipeForm({ recipe }: RecipeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(recipe?.title ?? "");
  const [category, setCategory] = useState(recipe?.category ?? "");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(recipe?.prepTimeMinutes ?? 30);
  const [defaultYield, setDefaultYield] = useState(recipe?.defaultYield ?? 4);
  const [historyHtml, setHistoryHtml] = useState(recipe?.historyHtml ?? "");
  const [videoUrl, setVideoUrl] = useState(recipe?.videoUrl ?? "");
  const [imageUrl, setImageUrl] = useState(recipe?.imageUrl ?? "");
  const [published, setPublished] = useState(recipe?.published ?? false);
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
    setImageUrl(data.url);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      title,
      category,
      prepTimeMinutes,
      defaultYield,
      historyHtml,
      videoUrl: videoUrl || undefined,
      imageUrl: imageUrl || undefined,
      published,
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
      if (!res.ok) throw new Error("Erro ao salvar");
      router.push("/admin/receitas");
      router.refresh();
    } catch {
      setError("Não foi possível salvar a receita.");
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
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="category">Categoria *</Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
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
                required
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
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="video">Link do vídeo (YouTube/Vimeo)</Label>
            <Input id="video" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
          </div>
          <div>
            <Label>Imagem principal</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadImage(f).catch(() => setError("Erro no upload da imagem"));
              }}
            />
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="Preview" className="mt-2 h-32 rounded object-cover" />
            )}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publicar receita
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
            <Input
              className="col-span-2"
              placeholder="Unidade"
              value={ing.unit}
              onChange={(e) => {
                const next = [...ingredients];
                next[i] = { ...ing, unit: e.target.value };
                setIngredients(next);
              }}
            />
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

      {error && <p className="text-sm text-red-700">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar receita"}
      </Button>
    </form>
  );
}
