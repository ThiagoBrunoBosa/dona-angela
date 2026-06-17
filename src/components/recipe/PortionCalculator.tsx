"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/form";
import { scaleQuantity } from "@/lib/utils";

type Ingredient = {
  id: string;
  quantity: string;
  unit: string;
  name: string;
};

type PortionCalculatorProps = {
  defaultYield: number;
  ingredients: Ingredient[];
};

export function PortionCalculator({
  defaultYield,
  ingredients,
}: PortionCalculatorProps) {
  const [portions, setPortions] = useState(defaultYield);
  const factor = portions / defaultYield;

  return (
    <div className="rounded border border-border bg-background p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
          Porções
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Diminuir porções"
            onClick={() => setPortions((p) => Math.max(1, p - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="min-w-[2rem] text-center font-medium">{portions}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Aumentar porções"
            onClick={() => setPortions((p) => p + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ul className="space-y-2">
        {ingredients.map((ing) => (
          <IngredientItem
            key={ing.id}
            quantity={scaleQuantity(ing.quantity, factor)}
            unit={ing.unit}
            name={ing.name}
          />
        ))}
      </ul>
    </div>
  );
}

function IngredientItem({
  quantity,
  unit,
  name,
}: {
  quantity: string;
  unit: string;
  name: string;
}) {
  const [checked, setChecked] = useState(false);

  return (
    <li className="flex items-start gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-primary"
        aria-label={`Marcar ${name}`}
      />
      <button
        type="button"
        onClick={() => setChecked(!checked)}
        className={`flex flex-1 items-baseline gap-2 rounded px-2 py-1 text-left text-sm transition hover:bg-border/30 ${
          checked ? "ingredient-checked" : ""
        }`}
      >
        <span className="font-bold tabular-nums">
          {quantity} {unit}
        </span>
        <span>{name}</span>
      </button>
    </li>
  );
}
