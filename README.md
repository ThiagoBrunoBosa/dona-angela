# Dona Angela — Caderno de Receitas Digitais

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
| Tailwind CSS 4 | Design system Dona Angela |
| Vercel | Deploy |

## Rotas

| Rota | Descrição |
| ---- | --------- |
| `/` | Home |
| `/receitas` | Listagem |
| `/receitas/[slug]` | Receita interativa |
| `/busca` | Busca + geladeira |
| `/entrar`, `/cadastro` | Auth |
| `/meu-caderno` | Favoritos |
| `/minha-conta` | Configurações |
| `/admin` | Painel CMS |
| `/privacy` | LGPD |

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```env
DATABASE_URL=postgresql://...
AUTH_SECRET=...
AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
BLOB_READ_WRITE_TOKEN=...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ADMIN_SEED_EMAIL=admin@donaangela.com.br
ADMIN_SEED_PASSWORD=changeme123
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

**Admin:** `admin@donaangela.com.br` / `changeme123`  
**Usuário teste:** `usuario@teste.com` / `usuario123`  
**Caio Devani:** `caio.devani@donaangela.com.br` / `caio123`

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
| GitHub | ✅ [ThiagoBrunoBosa/dona-angela](https://github.com/ThiagoBrunoBosa/dona-angela) |
| Vercel | ✅ [dona-angela.vercel.app](https://dona-angela.vercel.app) |
| Neon Postgres | ✅ base `donaangela` no mesmo cluster Bora/GPSVendas |
| Domínio donaangela.com.br | ⬜ |
| Google OAuth | ⬜ |
| Vercel Blob | ⬜ |
