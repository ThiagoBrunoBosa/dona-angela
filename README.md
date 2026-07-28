# Vó Angela — Caderno de Receitas Digitais

Portal de receitas de família com painel administrativo, favoritos, comentários e busca por ingredientes.

> Antes de implementar novas features, consulte o [SITE_PLAYBOOK](https://github.com/lextechsolutions) da LexTech.

---

## Stack

| Tecnologia | Papel |
| ---------- | ----- |
| Next.js 16 | App Router, SSR |
| Neon Postgres | Banco de dados |
| Prisma | ORM |
| Auth.js v5 | Login e-mail/senha + Google |
| Tailwind CSS 4 | Design system Vó Angela |
| Resend | Contato + recuperação de senha |
| Vercel | Deploy |

## Rotas

| Rota | Descrição |
| ---- | --------- |
| `/` | Home |
| `/receitas` | Listagem |
| `/receitas/[slug]` | Receita interativa |
| `/busca` | Busca + geladeira |
| `/quem-somos` | História (editável no admin) |
| `/contato` | Formulário de contato |
| `/entrar`, `/cadastro` | Auth |
| `/recuperar-senha`, `/redefinir-senha` | Recuperação de senha |
| `/meu-caderno` | Favoritos |
| `/minha-conta` | Configurações |
| `/admin` | Painel CMS |
| `/privacy` | LGPD |

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha.

No **Neon + Vercel**, use a URL com `-pooler` no host para runtime.

Migrations não rodam no build da Vercel. Ao alterar o schema, aplique localmente com conexão **direta** (sem `-pooler`):

```bash
DATABASE_URL="postgresql://.../voangela?sslmode=require" npx prisma migrate deploy
```

```env
DATABASE_URL=postgresql://...-pooler.../voangela?sslmode=require
AUTH_SECRET=...
AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
BLOB_READ_WRITE_TOKEN=...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ADMIN_SEED_EMAIL=admin@voangela.com.br
ADMIN_SEED_PASSWORD=changeme123
RESEND_API_KEY=...
EMAIL_FROM=Vó Angela <noreply@voangela.com.br>
CONTACT_EMAIL=contato@voangela.com.br
```

## Instalação

```bash
npm install

# Banco local com Docker
docker compose up -d
npx prisma migrate deploy
npm run db:seed

npm run dev    # http://localhost:3000
```

Acesse http://localhost:3000

**Admin:** `admin@voangela.com.br` / `changeme123`  
**Usuário teste:** `usuario@teste.com` / `usuario123`  
**Caio Devani:** `caio.devani@voangela.com.br` / `caio123`

Consulte [MANUAL.md](./MANUAL.md) para o guia completo de uso e testes.

## Scripts

```bash
npm run dev          # desenvolvimento
npm run build        # build produção
npm run test         # testes Jest
npm run db:seed      # popular banco
docker compose up -d # subir Postgres local
docker compose down  # parar Postgres local
```

## Infraestrutura (produção)

| Serviço | Status |
| ------- | ------ |
| GitHub | ⬜ Renomear repo para `vo-angela` (Settings → Rename) |
| Vercel | ✅ [dona-angela.vercel.app](https://dona-angela.vercel.app) — atualizar nome do projeto |
| Neon Postgres | ✅ (base local/docs: `voangela`; produção pode manter nome atual até migrar) |
| Domínio `voangela.com.br` | ⬜ ver checklist no MANUAL |
| Resend | ⬜ verificar domínio + `RESEND_API_KEY` |
| Google OAuth | ⬜ |
| Vercel Blob | ⬜ |

## Fundo do site

Coloque a foto em `public/background.jpg`. O CSS já aplica cover + overlay de legibilidade.
