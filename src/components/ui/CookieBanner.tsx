"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "da-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <dialog
      open
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg rounded-lg border border-border bg-background p-4 shadow-lg backdrop:bg-transparent md:left-auto"
    >
      <p className="text-sm">
        Utilizamos cookies para melhorar sua experiência e analytics.{" "}
        <Link href="/privacy" className="text-primary underline">
          Política de Privacidade
        </Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={accept}
          className="rounded bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-background"
        >
          Aceitar
        </button>
        <button
          type="button"
          onClick={decline}
          className="rounded border border-border px-3 py-1.5 text-xs uppercase tracking-widest"
        >
          Recusar
        </button>
      </div>
    </dialog>
  );
}
