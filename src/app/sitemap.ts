import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/utils";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/receitas`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/busca`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const recipes = await prisma.recipe.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    const recipeRoutes: MetadataRoute.Sitemap = recipes.map((r) => ({
      url: `${BASE_URL}/receitas/${r.slug}`,
      lastModified: r.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...recipeRoutes];
  } catch {
    return staticRoutes;
  }
}
