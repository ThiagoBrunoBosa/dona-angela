import { getAllUsers } from "@/lib/services/admin";

function formatDt(d: Date | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div>
      <h1 className="font-serif text-3xl italic text-primary">Usuários</h1>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-4">Nome</th>
              <th className="py-2 pr-4">E-mail</th>
              <th className="py-2 pr-4">Cadastro</th>
              <th className="py-2">Último login</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/60">
                <td className="py-3 pr-4">{u.name ?? "—"}</td>
                <td className="py-3 pr-4 text-muted">{u.email}</td>
                <td className="py-3 pr-4">{formatDt(u.createdAt)}</td>
                <td className="py-3">{formatDt(u.lastLoginAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="mt-4 text-muted">Nenhum usuário.</p>}
      </div>
    </div>
  );
}
