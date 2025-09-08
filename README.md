# Avaliação de Maturidade em Segurança (Standalone)

Uma aplicação Next.js pronta para rodar na Vercel que entrega, de forma autônoma, o teste de maturidade em segurança da informação. É exatamente a ferramenta disponível em `/tools/maturidade`, extraída e empacotada para uso isolado.

## Principais Recursos
- Questionário por domínios com pesos e progresso.
- Cálculo de score global (0–5) e nível de maturidade.
- Gráficos de Radar e Barras (Chart.js vendorizado em `public/vendor`).
- Resumo por domínio, recomendações e gaps prioritários.
- Exportação de relatório em PDF (botão “Exportar PDF”).

## Tecnologias
- Next.js 14 + App Router, React 18, TypeScript.
- Tailwind CSS (tema escuro com variáveis CSS).
- Chart.js (bundle local: `public/vendor/chart.umd.min.js`).

## Estrutura do Projeto
- Código da página: `src/app/tools/maturidade/page.tsx`
- Componente principal: `src/components/tools/MaturidadeApp.tsx`
- Estilos globais/tema: `src/app/globals.css`
- Assets e lógica: `public/maturidade/{data.js, script.js, metodologia.md}`
- Vendor: `public/vendor/chart.umd.min.js`
- Redirecionamento raiz → `/tools/maturidade`: `src/app/page.tsx`

## Como Rodar Localmente
1. Requisitos: Node 18+ (ou 20) e npm.
2. Instale dependências: `npm install`
3. Ambiente de dev: `npm run dev` → http://localhost:3000/tools/maturidade
4. Build de produção: `npm run build` e `npm start`

## Deploy na Vercel
- Importar o repositório na Vercel (auto-detecta Next.js).
- Build: `next build` | Output: `.next`
- A aplicação publica a rota `/tools/maturidade` (raiz redireciona).

## Personalização Rápida
- Cor primária (rosa): altere `--primary` em `src/app/globals.css` (padrão `#EB33CC`).
- Observação: cores de “status” (níveis/legendas) vêm do script de domínio e permanecem inalteradas.

## Scripts Úteis
- `npm run dev`: servidor de desenvolvimento
- `npm run build`: build de produção
- `npm run start`: servir build
- `npm run lint`: lint do projeto

## Licença e Contribuição
- Abra issues/PRs com descrição clara e, quando pertinente, evidências (prints/ GIFs) de UI.
- Não suba segredos. Use `.env.local` se necessário.

