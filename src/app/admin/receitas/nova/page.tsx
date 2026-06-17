import { RecipeForm } from "@/components/admin/RecipeForm";
import { getCategories } from "@/lib/services/recipes";

export default async function NewRecipePage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="font-serif text-3xl italic text-primary">Nova receita</h1>
      <div className="mt-6">
        <RecipeForm categories={categories} />
      </div>
    </div>
  );
}
