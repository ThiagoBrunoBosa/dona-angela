import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Redefinir senha",
};

export default async function RedefinirSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-3xl italic text-primary">Redefinir senha</h1>
      <p className="mt-3 text-sm text-muted">Escolha uma nova senha para sua conta.</p>
      <ResetPasswordForm token={token ?? ""} />
    </div>
  );
}
