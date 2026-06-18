type RecipeForAi = {
  title: string;
  category: string;
  prepTimeMinutes: number;
  defaultYield: number;
  historyHtml: string;
  ingredients: { quantity: string; unit: string; name: string }[];
  steps: { text: string }[];
  affiliates: { name: string }[];
};

export function buildRecipeContext(recipe: RecipeForAi): string {
  const history = recipe.historyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const ingredients = recipe.ingredients
    .map((i) => `- ${i.quantity} ${i.unit} ${i.name}`.trim())
    .join("\n");
  const steps = recipe.steps.map((s, n) => `${n + 1}. ${s.text}`).join("\n");
  const utensils =
    recipe.affiliates.length > 0
      ? recipe.affiliates.map((a) => `- ${a.name}`).join("\n")
      : "(nenhum cadastrado)";

  return [
    `Título: ${recipe.title}`,
    `Categoria: ${recipe.category}`,
    `Tempo de preparo: ${recipe.prepTimeMinutes} minutos`,
    `Rendimento: ${recipe.defaultYield} porções`,
    "",
    "História:",
    history || "(sem história)",
    "",
    "Ingredientes:",
    ingredients,
    "",
    "Modo de preparo:",
    steps,
    "",
    "Utensílios recomendados:",
    utensils,
  ].join("\n");
}
