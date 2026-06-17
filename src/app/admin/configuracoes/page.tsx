import { getSiteSettings } from "@/lib/services/settings";
import { LogoSettingsForm } from "@/components/admin/LogoSettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-serif text-3xl italic text-primary">Configurações</h1>
      <section className="mt-8">
        <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
          Logo do site
        </h2>
        <div className="mt-4">
          <LogoSettingsForm currentLogo={settings.logoUrl} />
        </div>
      </section>
    </div>
  );
}
