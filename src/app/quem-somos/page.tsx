import type { Metadata } from "next";
import Image from "next/image";
import { getSiteSettings } from "@/lib/services/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.aboutTitle || "Quem somos",
    description: settings.aboutHtml
      ? settings.aboutHtml.replace(/<[^>]+>/g, "").slice(0, 160)
      : "Conheça a história da Vó Angela.",
  };
}

export const dynamic = "force-dynamic";

export default async function QuemSomosPage() {
  const settings = await getSiteSettings();
  const title = settings.aboutTitle || "Quem somos";
  const hasContent =
    Boolean(settings.aboutHtml?.replace(/<[^>]+>/g, "").trim()) ||
    Boolean(settings.aboutImageUrl);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-4xl italic text-primary">{title}</h1>

      {!hasContent && (
        <p className="mt-6 font-narrative text-muted">
          Em breve, a história da Vó Angela estará aqui.
        </p>
      )}

      {settings.aboutImageUrl && (
        <div className="relative mt-8 aspect-[4/3] w-full overflow-hidden rounded-lg">
          <Image
            src={settings.aboutImageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            unoptimized={settings.aboutImageUrl.startsWith("data:")}
          />
        </div>
      )}

      {settings.aboutHtml && (
        <div
          className="prose-recipe font-narrative mt-8 space-y-4 text-foreground"
          dangerouslySetInnerHTML={{ __html: settings.aboutHtml }}
        />
      )}
    </div>
  );
}
