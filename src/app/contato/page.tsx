import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Vó Angela.",
};

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-3xl italic text-primary">Contato</h1>
      <p className="mt-3 font-narrative text-muted">
        Dúvidas, sugestões ou um oi carinhoso — mande sua mensagem.
      </p>
      <ContactForm />
    </div>
  );
}
