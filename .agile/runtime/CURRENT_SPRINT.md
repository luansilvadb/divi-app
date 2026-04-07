# SPRINT 1 (v0.2.0): Fundamentação e Dashboard Central

## STATUS: ATIVA

## TAREFAS

### [ ] #1: Implementar Dados Reais de Evolução Patrimonial
- **Contexto:** Atualmente o gráfico de Evolução Patrimonial no Dashboard (`DashboardView.vue`) utiliza dados mockados (`growthData`). Precisamos que ele reflita a realidade dos saldos históricos agregados.
- **Micro-RFC:**
  - **Contrato de Dados:**
    - `dashboardStore.ts` deve expor um novo getter `patrimonialEvolutionData` que retorna: `{ labels: string[], values: number[] }`.
    - `labels` devem ser os últimos 6 meses (Ex: ["Out", "Nov", "Dez", "Jan", "Fev", "Mar"]).
    - `values` devem ser o saldo acumulado de todas as contas até o último dia de cada mês.
  - **Critérios de Aceite (BDD):**
    - **Dado que** o usuário acessa o Dashboard, **Quando** o componente carrega, **Então** o gráfico exibe 6 pontos de dados baseados nas transações reais.
    - O valor de cada mês deve considerar: (Saldo Inicial de Todas as Contas) + (Transações até a data final do mês).
  - **Edge Cases & Tratamento de Erros:**
    - Se não houver transações em um mês, o valor deve ser o saldo do mês anterior.
    - Se o banco de dados falhar ao buscar transações, exibir gráfico vazio com mensagem de erro.
  - **Limitações:** Não implementar troca de período (6 meses fixos).

### [ ] #2: Integração de Resumos de Orçamentos e Objetivos
- **Contexto:** O dashboard central deve dar visibilidade rápida ao progresso de orçamentos e metas para incentivar o usuário a manter o plano financeiro.
- **Micro-RFC:**
  - **Contrato de Dados:**
    - `dashboardStore.ts` deve incluir `budgets: Budget[]` e `goals: Goal[]` no estado e carregá-los via `fetchDashboardData`.
    - Expor getters `topBudgets` e `topGoals` (limitados a 3 cada).
  - **Critérios de Aceite (BDD):**
    - **Dado que** o usuário tem 5 orçamentos criados, **Quando** no Dashboard, **Então** exibe os 3 com maior percentual de gasto.
    - **Dado que** o usuário não tem metas, **Quando** no Dashboard, **Então** exibe um card "Adicione sua primeira meta financeira".
  - **Edge Cases:** Se o `budgetLogicService` demorar a responder, exibir Skeleton Loaders.
  - **Limitações:** O card de detalhes no dashboard deve ser somente leitura, redirecionando para a página do módulo para edições.

---

[SYSTEM] Sprint 1 (v0.2.0) detalhada com Micro-RFCs. Aguardando execução.
