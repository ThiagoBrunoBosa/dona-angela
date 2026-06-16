# Manual rápido — Dona Angela

Portal de receitas digitais com painel administrativo, favoritos, comentários e busca por ingredientes.

---

## Acesso ao site

| Item | URL |
|------|-----|
| **Produção** | https://dona-angela.vercel.app |
| **Login** | https://dona-angela.vercel.app/entrar |
| **Painel admin** | https://dona-angela.vercel.app/admin |
| **Repositório** | https://github.com/ThiagoBrunoBosa/dona-angela |

---

## Usuários de teste

### 1. Administrador

Acesso completo ao site e ao painel CMS.

| Campo | Valor |
|-------|-------|
| **Nome** | Administrador |
| **E-mail** | `admin@donaangela.com.br` |
| **Senha** | `changeme123` |
| **Perfil** | ADMIN |

Após entrar, use o link **Admin** no menu ou acesse `/admin` diretamente.

> Troque a senha em **Minha conta** (`/minha-conta`) o quanto antes — é a senha padrão do seed.

---

### 2. Usuário teste

Simula um visitante comum cadastrado no sistema.

| Campo | Valor |
|-------|-------|
| **Nome** | Usuário Teste |
| **E-mail** | `usuario@teste.com` |
| **Senha** | `usuario123` |
| **Perfil** | USER |

**Pode:** favoritar receitas, comentar, usar Meu Caderno e Minha Conta.  
**Não pode:** acessar `/admin`.

---

### 3. Caio Devani

Segundo usuário comum para testes de perfil visitante.

| Campo | Valor |
|-------|-------|
| **Nome** | Caio Devani |
| **E-mail** | `caio.devani@donaangela.com.br` |
| **Senha** | `caio123` |
| **Perfil** | USER |

Mesmas permissões do usuário teste acima.

---

## Site público (visitante)

| Página | Descrição |
|--------|-----------|
| `/` | Home com destaques e categorias |
| `/receitas` | Listagem de receitas |
| `/receitas/[slug]` | Receita com ingredientes, passos, calculadora de porções, checklist e modo cozinha |
| `/busca` | Busca por nome ou modo **geladeira** (ingredientes disponíveis) |
| `/entrar` | Login |
| `/cadastro` | Criar conta |
| `/meu-caderno` | Favoritos (requer login) |
| `/minha-conta` | Configurações da conta (requer login) |
| `/privacy` | Política de privacidade (LGPD) |

---

## Painel administrativo (`/admin`)

Disponível apenas para usuários com perfil **ADMIN**.

| Seção | Função |
|-------|--------|
| **Dashboard** | Métricas: receitas, usuários, comentários |
| **Receitas** | Criar, editar e publicar receitas |
| **Comentários** | Moderar comentários dos visitantes |

**Fluxo típico:**

1. Entrar com `admin@donaangela.com.br`
2. Ir em **Admin → Receitas → Nova receita**
3. Preencher título, ingredientes, modo de preparo e imagem
4. Salvar — a receita aparece em `/receitas`

O painel admin usa layout próprio (sem o menu público duplicado). Use **Sair** no canto superior direito para encerrar a sessão.

---

## Infraestrutura

| Serviço | Detalhe |
|---------|---------|
| **Hospedagem** | Vercel — deploy automático a cada push na `main` |
| **Banco** | Neon Postgres — base `donaangela` (mesmo cluster Bora/GPSVendas) |
| **Auth** | E-mail/senha (Google OAuth pendente de configuração) |

---

## Pendências conhecidas

- Domínio customizado `donaangela.com.br` ainda não configurado
- Login com Google ainda não ativo
- Upload de imagens no admin depende do **Vercel Blob** (`BLOB_READ_WRITE_TOKEN`)
- Receitas atuais são exemplos com fotos do Unsplash — substituir pelo conteúdo real

---

*Desenvolvido por [LexTech Solutions](https://www.lextechsolutions.com.br/)*
