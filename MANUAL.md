# Manual rápido — Vó Angela

Portal de receitas digitais com painel administrativo, favoritos, comentários e busca por ingredientes.

---

## Acesso ao site

| Item | URL |
|------|-----|
| **Produção** | https://dona-angela.vercel.app (até configurar `voangela.com.br`) |
| **Login** | https://dona-angela.vercel.app/entrar |
| **Painel admin** | https://dona-angela.vercel.app/admin |
| **Repositório** | https://github.com/ThiagoBrunoBosa/dona-angela → renomear para `vo-angela` |

---

## Usuários de teste

### 1. Administrador

| Campo | Valor |
|-------|-------|
| **Nome** | Administrador |
| **E-mail** | `admin@voangela.com.br` |
| **Senha** | `changeme123` |
| **Perfil** | ADMIN |

> Troque a senha em **Minha conta** (`/minha-conta`) o quanto antes — é a senha padrão do seed.

### 2. Usuário teste

| Campo | Valor |
|-------|-------|
| **E-mail** | `usuario@teste.com` |
| **Senha** | `usuario123` |
| **Perfil** | USER |

### 3. Caio Devani

| Campo | Valor |
|-------|-------|
| **E-mail** | `caio.devani@voangela.com.br` |
| **Senha** | `caio123` |
| **Perfil** | USER |

---

## Site público (visitante)

| Página | Descrição |
|--------|-----------|
| `/` | Home com destaques e categorias |
| `/receitas` | Listagem de receitas |
| `/receitas/[slug]` | Receita interativa |
| `/busca` | Busca por nome ou modo geladeira |
| `/quem-somos` | História da Vó Angela (CMS) |
| `/contato` | Formulário de contato (Resend) |
| `/entrar` | Login (+ esqueci senha) |
| `/cadastro` | Criar conta |
| `/recuperar-senha` | Pedir link de recuperação |
| `/redefinir-senha` | Nova senha via token |
| `/meu-caderno` | Favoritos (requer login) |
| `/minha-conta` | Conta (requer login) |
| `/privacy` | Política de privacidade (LGPD) |

---

## Painel administrativo (`/admin`)

| Seção | Função |
|-------|--------|
| **Dashboard** | Métricas |
| **Receitas** | CRUD de receitas + afiliados |
| **Comentários** | Moderação / resposta como Vó Angela |
| **Usuários** | Lista |
| **Configurações** | Logo, Quem somos (texto + imagem), redes sociais |

**Fluxo Quem somos:** Admin → Configurações → editar título/história → upload da imagem → Salvar → ver em `/quem-somos`.

**Fluxo redes:** Admin → Configurações → colar URLs Instagram/YouTube/Facebook/TikTok → Salvar → ícones no rodapé.

---

## Checklist — domínio `voangela.com.br`

1. Registrar o domínio no registrador (Registro.br ou outro)
2. Vercel → Project → **Domains** → adicionar `voangela.com.br` e `www.voangela.com.br`
3. No DNS do registrador, apontar A/CNAME conforme a Vercel indicar
4. Env de produção na Vercel:
   - `AUTH_URL=https://voangela.com.br`
   - `NEXT_PUBLIC_BASE_URL=https://voangela.com.br`
5. Google Cloud Console → OAuth → Authorized origins e redirect URIs com o novo domínio
6. Resend → Domains → verificar `voangela.com.br` (SPF/DKIM) → usar `EMAIL_FROM` e `CONTACT_EMAIL`

## Checklist — repositório / projeto

1. GitHub → Settings → Rename: `dona-angela` → `vo-angela`
2. Atualizar remote local: `git remote set-url origin git@github.com:ThiagoBrunoBosa/vo-angela.git`
3. Vercel → Project Settings → renomear projeto (opcional)
4. Pasta local: renomear `dona-angela` → `vo-angela` (opcional)

## Checklist — contas externas

### YouTube

1. Criar canal Google com nome **Vó Angela**
2. Personalizar URL (`youtube.com/@...`)
3. Colar a URL em Admin → Configurações → YouTube
4. Nos vídeos de receita, usar o campo `videoUrl` da receita

### Instagram (e outras)

1. Criar perfil profissional **Vó Angela**
2. (Opcional) Facebook Page / TikTok com a mesma marca
3. Colar URLs em Admin → Configurações → Redes sociais

### Afiliado Mercado Livre

1. Inscrever-se em [Mercado Livre Afiliados](https://www.mercadolivre.com.br/afiliados)
2. Gerar links de produto no painel de afiliados
3. Em Admin → Receitas → editar receita → seção de afiliados: nome + URL do ML
4. O modelo `AffiliateProduct` já exibe os links na página da receita

### Resend (e-mail)

1. Conta em [resend.com](https://resend.com)
2. Verificar domínio `voangela.com.br`
3. Vercel env: `RESEND_API_KEY`, `EMAIL_FROM`, `CONTACT_EMAIL`
4. Testar `/contato` e “Esqueci minha senha” em `/entrar`

## Fundo do site

Salve a foto de fundo em `public/background.jpg` (recomendado WebP/JPEG otimizado, ~1920px de largura). O site já usa cover + overlay claro para legibilidade.

---

## Infraestrutura

| Serviço | Detalhe |
|---------|---------|
| **Hospedagem** | Vercel — deploy automático a cada push na `main` |
| **Banco** | Neon Postgres (docs locais usam `voangela`) |
| **Auth** | E-mail/senha + recuperação; Google OAuth opcional |
| **E-mail** | Resend |

---

*Desenvolvido por [LexTech Solutions](https://www.lextechsolutions.com.br/)*
