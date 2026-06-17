import type { Metadata } from "next";
import {
  Playfair_Display,
  Montserrat,
  Lora,
  Inter,
} from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SiteShell } from "@/components/layout/SiteShell";
import { Providers } from "@/components/Providers";
import { SettingsProvider } from "@/components/SettingsProvider";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { BASE_URL } from "@/lib/utils";
import { getSiteSettings } from "@/lib/services/settings";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Dona Angela — Caderno de Receitas Digitais",
    template: "%s | Dona Angela",
  },
  description:
    "Receitas de família com elegância e clareza. Descubra, cozinhe e salve seus pratos favoritos.",
  keywords: ["receitas", "culinária", "Dona Angela", "receitas de família"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BASE_URL,
    siteName: "Dona Angela",
    title: "Dona Angela — Caderno de Receitas Digitais",
    description: "Receitas de família com elegância e clareza.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dona Angela",
    description: "Caderno de Receitas Digitais",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Dona Angela",
  url: BASE_URL,
  description: "Caderno de Receitas Digitais",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const settings = await getSiteSettings();

  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${montserrat.variable} ${lora.variable} ${inter.variable} h-full`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c=localStorage.getItem('da-cookie-consent');if(c==='accepted'&&'${gaId}'){}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col font-sans antialiased">
        <Providers>
          <SettingsProvider logoUrl={settings.logoUrl}>
            <SiteShell>{children}</SiteShell>
            <CookieBanner />
          </SettingsProvider>
        </Providers>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
