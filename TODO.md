# TODO — Vó Angela

---

## ✅ Concluído

- [x] Scaffold Next.js + design tokens V5 + logo
- [x] Prisma schema completo
- [x] Auth.js (Google + Credentials) + middleware
- [x] Painel admin (CRUD receitas, moderação comentários)
- [x] Site público com receita interativa
- [x] Busca geladeira com fallback Top 3
- [x] Ad slots + afiliados
- [x] SEO, LGPD, testes base
- [x] Rebrand Vó Angela
- [x] Quem somos (público + admin CMS)
- [x] Redes sociais no footer (CMS)
- [x] Contato + recuperação de senha (Resend)
- [x] Slot de fundo global (`public/background.jpg`)

---

## 🔴 Alta Prioridade

- [x] Configurar Neon Postgres em produção e `DATABASE_URL` na Vercel
- [x] Deploy Vercel — https://dona-angela.vercel.app
- [ ] Registrar domínio `voangela.com.br` e apontar DNS Vercel
- [ ] Atualizar `AUTH_URL` / `NEXT_PUBLIC_BASE_URL` para o domínio
- [ ] Configurar Google OAuth (Console Google Cloud)
- [ ] Configurar `BLOB_READ_WRITE_TOKEN` para upload de imagens
- [ ] Configurar Resend (`RESEND_API_KEY` + verificação de domínio)
- [ ] Colocar foto em `public/background.jpg`
- [ ] Renomear repositório GitHub para `vo-angela`

---

## 🟡 Conteúdo

- [ ] Substituir receitas de exemplo por conteúdo real do cliente
- [ ] Fotos próprias das receitas (substituir Unsplash)
- [ ] Links de afiliado reais (Mercado Livre, Amazon, Magalu)
- [ ] Preencher Quem somos no admin
- [ ] Criar canal YouTube + Instagram e colar URLs no admin
- [ ] Dados LGPD: CNPJ, razão social, e-mail DPO

---

## 🟢 Funcionalidades (backlog)

- [ ] Integração Rappi/Instacart — botão "Comprar ingredientes" (P&D)
- [ ] Google AdSense nos slots de publicidade
- [ ] i18n (playbook LexTech)
- [ ] App mobile (projeto separado)

---

## 🔵 Melhorias Técnicas

- [ ] Rate limiting com Upstash Redis nas APIs
- [ ] Testes E2E Playwright
- [ ] Sentry para monitoramento de erros
- [ ] Husky + lint-staged (pre-commit)
