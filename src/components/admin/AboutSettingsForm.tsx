"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@/components/ui/form";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

type AboutSettingsFormProps = {
  aboutTitle: string;
  aboutHtml: string;
  aboutImageUrl: string | null;
};

export function AboutSettingsForm({
  aboutTitle: initialTitle,
  aboutHtml: initialHtml,
  aboutImageUrl: initialImage,
}: AboutSettingsFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [html, setHtml] = useState(initialHtml);
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/settings/about-image", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro no upload");
      setImageUrl(data.aboutImageUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar imagem");
    } finally {
      setUploading(false);
    }
  };

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
          aboutTitle: title,
          aboutHtml: html,
          aboutImageUrl: imageUrl,
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
    <form onSubmit={save} className="max-w-2xl space-y-4">
      <div>
        <Label htmlFor="aboutTitle">Título</Label>
        <Input
          id="aboutTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>História</Label>
        <RichTextEditor value={html} onChange={setHtml} />
      </div>
      <div>
        <Label htmlFor="aboutImage">Imagem</Label>
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Quem somos"
            className="mb-3 max-h-48 rounded object-cover"
          />
        )}
        <Input
          id="aboutImage"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          disabled={uploading}
          onChange={uploadImage}
        />
        {uploading && <p className="mt-1 text-sm text-muted">Enviando imagem...</p>}
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {saved && <p className="text-sm text-primary">Salvo com sucesso.</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar Quem somos"}
      </Button>
    </form>
  );
}
