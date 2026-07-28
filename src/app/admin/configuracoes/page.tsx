import { getSiteSettings } from "@/lib/services/settings";
import { LogoSettingsForm } from "@/components/admin/LogoSettingsForm";
import { AboutSettingsForm } from "@/components/admin/AboutSettingsForm";
import { SocialSettingsForm } from "@/components/admin/SocialSettingsForm";

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

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
          Quem somos
        </h2>
        <div className="mt-4">
          <AboutSettingsForm
            aboutTitle={settings.aboutTitle}
            aboutHtml={settings.aboutHtml}
            aboutImageUrl={settings.aboutImageUrl}
          />
        </div>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
          Redes sociais
        </h2>
        <div className="mt-4">
          <SocialSettingsForm
            instagramUrl={settings.instagramUrl}
            youtubeUrl={settings.youtubeUrl}
            facebookUrl={settings.facebookUrl}
            tiktokUrl={settings.tiktokUrl}
          />
        </div>
      </section>
    </div>
  );
}
