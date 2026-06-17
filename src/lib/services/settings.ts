import { prisma } from "@/lib/db";
import { DEFAULT_LOGO } from "@/lib/constants";

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });
  return {
    logoUrl: settings?.logoUrl ?? DEFAULT_LOGO,
  };
}

export async function updateSiteLogo(logoUrl: string) {
  return prisma.siteSettings.upsert({
    where: { id: "default" },
    update: { logoUrl },
    create: { id: "default", logoUrl },
  });
}
