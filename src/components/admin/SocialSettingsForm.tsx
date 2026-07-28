"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@/components/ui/form";

type SocialSettingsFormProps = {
  instagramUrl: string | null;
  youtubeUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
};

export function SocialSettingsForm({
  instagramUrl: initialIg,
  youtubeUrl: initialYt,
  facebookUrl: initialFb,
  tiktokUrl: initialTt,
}: SocialSettingsFormProps) {
  const router = useRouter();
  const [instagramUrl, setInstagramUrl] = useState(initialIg ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initialYt ?? "");
  const [facebookUrl, setFacebookUrl] = useState(initialFb ?? "");
  const [tiktokUrl, setTiktokUrl] = useState(initialTt ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instagramUrl: instagramUrl || null,
          youtubeUrl: youtubeUrl || null,
          facebookUrl: facebookUrl || null,
          tiktokUrl: tiktokUrl || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao salvar");
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={save} className="max-w-lg space-y-4">
      <p className="text-sm text-muted">
        Cole as URLs públicas dos perfis. Links vazios não aparecem no rodapé.
      </p>
      <div>
        <Label htmlFor="instagram">Instagram</Label>
        <Input
          id="instagram"
          type="url"
          placeholder="https://instagram.com/..."
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="youtube">YouTube</Label>
        <Input
          id="youtube"
          type="url"
          placeholder="https://youtube.com/@..."
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="facebook">Facebook</Label>
        <Input
          id="facebook"
          type="url"
          placeholder="https://facebook.com/..."
          value={facebookUrl}
          onChange={(e) => setFacebookUrl(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="tiktok">TikTok</Label>
        <Input
          id="tiktok"
          type="url"
          placeholder="https://tiktok.com/@..."
          value={tiktokUrl}
          onChange={(e) => setTiktokUrl(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {saved && <p className="text-sm text-primary">Salvo com sucesso.</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar redes sociais"}
      </Button>
    </form>
  );
}
