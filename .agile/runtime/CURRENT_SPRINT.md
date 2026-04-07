# SPRINT 1: Foundation & Core Dashboard (Target v0.2.0)

## Contexto
Esta sprint marca a fundação arquitetural e de gestão de ciclo de vida de desenvolvimento utilizando o Mente Brilhante Ω. O foco principal é validar a configuração inicial do PWA, autenticação base, esquema Dexie para armazenamento offline e estruturação básica da view de Dashboard.

## Checklist de Execução
[x] 1. Inicializar estrutura neural `.agile/` (Core, ADR, Runtime, Spec, History).
[ ] 2. Configurar motor PWA (vite-plugin-pwa) e registrar Service Worker no `main.ts`.
[ ] 3. Estabelecer esquema base de dados em Dexie (Entities: `Wallet`, `Transaction`, `Budget`, `Goal`).
[ ] 4. Criar layout mestre com Vue Router e Sidebar.
[ ] 5. Implementar DashboardView com leitura de saldos locais do Dexie.

## Micro-RFC & Zero Ambiguity

### Tarefa 2: Configurar motor PWA
- **Contexto:** Garantir que o aplicativo possua capacidades off-line reais como um Progressive Web App.
- **Contrato:**
  - `vite.config.ts` deve incluir `VitePWA` com as configurações de `registerType: 'autoUpdate'`.
  - `src/main.ts` deve importar `virtual:pwa-register`.
- **BDD Acceptance Criteria:**
  - **Given** eu acesso a página principal, **When** a página termina de carregar, **Then** o service worker deve ser registrado corretamente.
- **Edge Cases:** Suporte em navegadores não-Chromium não é um blocker no momento, mas warnings não devem quebrar o build.

### Tarefa 3: Esquema Base Dexie
- **Contexto:** Definir os repositórios locais para armazenamento local-first.
- **Contrato:** Em `src/core/db.ts` deverá existir um `diviDB` extendendo `Dexie`.
  - `wallets`: `++id, name, type, balance, currency`
  - `transactions`: `++id, walletId, categoryId, amount, date, type, notes`
  - `budgets`: `++id, categoryId, limit, period`
  - `goals`: `++id, name, targetAmount, currentAmount, deadline`
- **BDD Acceptance Criteria:**
  - **Given** o módulo de banco de dados inicializado, **Then** as coleções supracitadas devem estar acessíveis de forma transacional.

### Tarefa 4: Layout Mestre e Routing
- **Contexto:** Navegação unificada com Vue Router.
- **Contrato:**
  - `src/App.vue` deve conter `<router-view>` envolto num layout com Sidebar persistente à esquerda (Desktop) ou Drawer (Mobile).
- **BDD Acceptance Criteria:**
  - **Given** uma rota como `/dashboard`, **Then** devo ver a barra lateral e o conteúdo renderizado de Dashboard.

### Tarefa 5: Implementação de DashboardView
- **Contexto:** Primeiros insights de UI consumindo os stores Pinia integrados com Dexie.
- **Contrato:** Exibir Total Balance e últimos 5 lançamentos (Mocked ou Dexie vazio).

## Limitações
- Autenticação e sincronia Supabase não ativas nesta Sprint.
- Gráficos avançados Chart.js não serão incorporados nas views do Dashboard até o Épico 7, apenas cards estáticos ou sumarização numérica.
