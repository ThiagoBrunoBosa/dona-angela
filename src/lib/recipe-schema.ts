import { z } from "zod";

export const recipeSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  prepTimeMinutes: z.number().int().positive("Tempo deve ser maior que zero"),
  defaultYield: z.number().int().positive("Rendimento deve ser maior que zero"),
  historyHtml: z.string().min(1, "História da receita é obrigatória"),
  videoUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  imageUrls: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  ingredients: z
    .array(
      z.object({
        quantity: z.string(),
        unit: z.string(),
        name: z.string().min(1, "Nome do ingrediente é obrigatório"),
      }),
    )
    .min(1, "Adicione pelo menos um ingrediente"),
  steps: z
    .array(z.object({ text: z.string().min(1, "Texto do passo é obrigatório") }))
    .min(1, "Adicione pelo menos um passo"),
  affiliates: z.array(
    z.object({ name: z.string(), url: z.string().url().or(z.literal("")) }),
  ),
});

export function formatZodErrors(error: z.ZodError) {
  return error.issues.map((i) => i.message).join("; ");
}
