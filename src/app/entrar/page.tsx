import { EntrarForm } from "@/components/auth/EntrarForm";

export const metadata = {
  title: "Entrar",
};

export default function EntrarPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-3xl italic text-primary">Entrar</h1>
      <EntrarForm />
    </div>
  );
}
