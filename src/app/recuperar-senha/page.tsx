import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Recuperar senha",
};

export default function RecuperarSenhaPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-3xl italic text-primary">Recuperar senha</h1>
      <p className="mt-3 text-sm text-muted">
        Informe o e-mail da sua conta. Se ele existir, enviaremos um link para
        criar uma nova senha.
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
