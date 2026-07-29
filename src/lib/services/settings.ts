import { prisma } from "@/lib/db";
import { DEFAULT_LOGO } from "@/lib/constants";

export type SiteSettingsData = {
  logoUrl: string;
  aboutTitle: string;
  aboutHtml: string;
  aboutImageUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
};

const defaults: SiteSettingsData = {
  logoUrl: DEFAULT_LOGO,
  aboutTitle: "Quem somos",
  aboutHtml: "",
  aboutImageUrl: null,
  instagramUrl: null,
  youtubeUrl: null,
  facebookUrl: null,
  tiktokUrl: null,
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    return {
      logoUrl: settings?.logoUrl ?? DEFAULT_LOGO,
      aboutTitle: settings?.aboutTitle ?? "Quem somos",
      aboutHtml: settings?.aboutHtml ?? "",
      aboutImageUrl: settings?.aboutImageUrl ?? null,
      instagramUrl: settings?.instagramUrl ?? null,
      youtubeUrl: settings?.youtubeUrl ?? null,
      facebookUrl: settings?.facebookUrl ?? null,
      tiktokUrl: settings?.tiktokUrl ?? null,
    };
  } catch {
    return defaults;
  }
}

export async function updateSiteLogo(logoUrl: string) {
  return prisma.siteSettings.upsert({
    where: { id: "default" },
    update: { logoUrl },
    create: { id: "default", logoUrl },
  });
}

export type SiteSettingsUpdate = {
  aboutTitle?: string;
  aboutHtml?: string;
  aboutImageUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
};

export async function updateSiteSettings(data: SiteSettingsUpdate) {
  return prisma.siteSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });
}
