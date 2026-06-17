/** Split fridge/search ingredient input by comma, semicolon, newline or spaces. */
export function parseIngredientTerms(input: string): string[] {
  return input
    .split(/[,;\n]+/)
    .flatMap((part) => part.split(/\s+/))
    .map((t) => t.trim())
    .filter(Boolean);
}
