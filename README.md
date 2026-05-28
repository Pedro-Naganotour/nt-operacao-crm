# NT Operação CRM — SPA

Versão convertida para **Vite + React SPA**, sem TanStack Start, SSR, Nitro ou Cloudflare Worker.

## O que esta versão já tem

- Login e criação de conta com Supabase Auth
- Layout administrativo com sidebar
- Dashboard inicial
- Módulo Pessoas / Leads
- Cadastro de novo lead
- Ao criar lead, o sistema também cria:
  - registro em `pessoas`
  - processo inicial em `processos`
  - histórico inicial em `historico`
- Rotas placeholder para os próximos módulos: kanbans, vagas, documentos, financeiro, passagens, faturas e pós-venda

## Variáveis de ambiente

Crie `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_ANON_PUBLIC_KEY
VITE_SUPABASE_PROJECT_ID=SEU_PROJECT_ID
```

Na Vercel, cadastre as mesmas variáveis em **Settings → Environment Variables**.

## Rodar localmente

```bash
bun install
bun run dev
```

## Deploy na Vercel

Configuração recomendada:

- Framework Preset: Vite
- Install Command: `bun install`
- Build Command: `bun run build`
- Output Directory: `dist`

O arquivo `vercel.json` já inclui rewrite para SPA, evitando erro 404 em `/login` e outras rotas.
