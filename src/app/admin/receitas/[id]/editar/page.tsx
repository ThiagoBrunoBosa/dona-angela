import { notFound } from "next/navigation";
import { getRecipeById } from "@/lib/services/recipes";
import { RecipeForm } from "@/components/admin/RecipeForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditRecipePage({ params }: Props) {
  const { id } = await params;
  const recipe = await getRecipeById(id);
  if (!recipe) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl italic text-primary">Editar receita</h1>
      <div className="mt-6">
        <RecipeForm recipe={recipe} />
      </div>
    </div>
  );
}
