"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@/components/ui/form";

export function LogoSettingsForm({ currentLogo }: { currentLogo: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(currentLogo);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/settings/logo", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro no upload");
      setPreview(data.logoUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar logo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg space-y-4">
      <p className="text-sm text-muted">
        Formatos aceitos: PNG, SVG ou WebP. Tamanho ideal: 400×120 px, fundo
        transparente. A logo aparece no header do site e no painel admin.
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={preview} alt="Logo atual" className="h-16 object-contain" />
      <div>
        <Label htmlFor="logo">Nova logo</Label>
        <Input
          id="logo"
          type="file"
          accept="image/png,image/svg+xml,image/webp,image/jpeg"
          disabled={loading}
          onChange={upload}
        />
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {loading && <p className="text-sm text-muted">Enviando...</p>}
    </div>
  );
}
