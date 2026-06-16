import type { Metadata } from "next";
import { BASE_URL } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Política de Privacidade",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 prose-recipe">
      <h1 className="font-serif text-3xl italic text-primary">Política de Privacidade</h1>
      <p className="mt-4 text-sm text-muted">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

      <section className="mt-8 space-y-4 text-sm leading-relaxed">
        <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
          Controlador
        </h2>
        <p>
          Dona Angela — Caderno de Receitas Digitais ({BASE_URL}). Para exercer seus
          direitos, entre em contato pelo e-mail indicado no site.
        </p>

        <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
          Dados coletados
        </h2>
        <ul className="list-disc pl-5">
          <li>Cadastro: nome, e-mail, senha (hash)</li>
          <li>Login Google: nome, e-mail, foto de perfil</li>
          <li>Comentários: texto e avaliação por estrelas</li>
          <li>Favoritos: receitas salvas vinculadas à conta</li>
          <li>Logs de acesso: IP e dados técnicos (Vercel)</li>
        </ul>

        <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
          Finalidade e base legal
        </h2>
        <p>
          Os dados são tratados para autenticação, personalização (favoritos), moderação
          de comentários e melhoria do serviço. Base legal: consentimento (Art. 7º, I) e
          execução de contrato (Art. 7º, V) da LGPD.
        </p>

        <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
          Operadores
        </h2>
        <ul className="list-disc pl-5">
          <li>Vercel — hospedagem</li>
          <li>Neon — banco de dados</li>
          <li>Google — OAuth e Analytics (se aceito)</li>
          <li>Vercel Blob — imagens de receitas</li>
        </ul>

        <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
          Direitos do titular (Art. 18)
        </h2>
        <p>
          Você pode solicitar acesso, correção, portabilidade, eliminação ou revogação do
          consentimento pelo e-mail de contato.
        </p>

        <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
          Cookies
        </h2>
        <p>
          Utilizamos cookies técnicos (sessão) e, com seu consentimento, cookies de
          analytics (Google Analytics 4).
        </p>
      </section>
    </div>
  );
}
