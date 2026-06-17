"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/components/SettingsProvider";

type LogoProps = {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { width: 120, height: 40 },
  md: { width: 180, height: 60 },
  lg: { width: 240, height: 80 },
};

export function Logo({
  className,
  showTagline = true,
  size = "md",
}: LogoProps) {
  const { logoUrl } = useSiteSettings();
  const dim = sizes[size];

  return (
    <Link href="/" className={cn("inline-flex shrink-0", className)}>
      <Image
        src={logoUrl}
        alt={
          showTagline
            ? "Dona Angela — Receitas de Vó"
            : "Dona Angela"
        }
        width={dim.width}
        height={dim.height}
        priority
        unoptimized={logoUrl.startsWith("data:")}
        className="h-auto w-auto max-h-16 object-contain"
      />
    </Link>
  );
}
