"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOGO } from "@/lib/constants";

const SettingsContext = createContext({ logoUrl: DEFAULT_LOGO });

export function SettingsProvider({
  logoUrl,
  children,
}: Readonly<{ logoUrl: string; children: React.ReactNode }>) {
  return (
    <SettingsContext.Provider value={{ logoUrl }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SettingsContext);
}
