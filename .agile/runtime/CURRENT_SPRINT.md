# Sprint 1 - Epic 1: Motor de Insights Proativos Locais

**Objetivo:** Implementar a fundação do motor de insights (rodando no client) para analisar anomalias de gastos nas categorias do mês atual vs média histórica.

## Tasks

- [ ] **Task 1:** Criar um módulo de domínio `src/modules/insights/core/InsightsEngine.ts`. Ele deve receber uma lista de transações e regras (heurísticas) para retornar uma lista de `Insight` (interface com id, title, description, severity, type).
- [ ] **Task 2:** Criar a regra de negócio `AnomalyDetectionRule.ts` que implementa a interface de regra do motor. Ela deve calcular a média diária de gastos por categoria nos meses anteriores e alertar se o gasto da categoria no mês atual já excedeu 120% da média histórica projetada para o dia atual.
- [ ] **Task 3:** Criar testes unitários exaustivos para o `InsightsEngine` e para a `AnomalyDetectionRule` em `src/modules/insights/__tests__/`.
- [ ] **Task 4:** Criar o Store Pinia `useInsightsStore` (`src/modules/insights/stores/insights.ts`) que orquestra a chamada do Motor de Insights utilizando os dados cacheados pelo Dexie (`useTransactionsStore`).
- [ ] **Task 5:** Atualizar a View de Dashboard (`src/modules/dashboard/views/DashboardView.vue`) para consumir o `useInsightsStore` e exibir um componente de lista de alertas/insights no topo da tela, caso haja algum com severidade Alta ou Média.
