import { RecipeForm } from "@/components/admin/RecipeForm";

export default function NewRecipePage() {
  return (
    <div>
      <h1 className="font-serif text-3xl italic text-primary">Nova receita</h1>
      <div className="mt-6">
        <RecipeForm />
      </div>
    </div>
  );
}
