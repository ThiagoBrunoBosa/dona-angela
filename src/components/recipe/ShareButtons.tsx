"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/form";

type ShareButtonsProps = {
  url: string;
  title: string;
};

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${title} — ${url}`);
    window.open(
      `https://api.whatsapp.com/send?text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" size="sm" onClick={shareWhatsApp}>
        <Share2 className="mr-1 h-4 w-4" aria-hidden />
        WhatsApp
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={copyLink}>
        {copied ? (
          <Check className="mr-1 h-4 w-4" aria-hidden />
        ) : (
          <Copy className="mr-1 h-4 w-4" aria-hidden />
        )}
        {copied ? "Link copiado!" : "Copiar link"}
      </Button>
    </div>
  );
}
