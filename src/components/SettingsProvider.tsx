"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOGO } from "@/lib/constants";

type SettingsContextValue = {
  logoUrl: string;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
};

const SettingsContext = createContext<SettingsContextValue>({
  logoUrl: DEFAULT_LOGO,
  instagramUrl: null,
  youtubeUrl: null,
  facebookUrl: null,
  tiktokUrl: null,
});

export function SettingsProvider({
  logoUrl,
  instagramUrl = null,
  youtubeUrl = null,
  facebookUrl = null,
  tiktokUrl = null,
  children,
}: Readonly<{
  logoUrl: string;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
  children: React.ReactNode;
}>) {
  return (
    <SettingsContext.Provider
      value={{ logoUrl, instagramUrl, youtubeUrl, facebookUrl, tiktokUrl }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SettingsContext);
}
