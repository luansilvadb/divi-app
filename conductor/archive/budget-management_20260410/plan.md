# Implementation Plan - Gestão de Orçamentos (Budgets)

## Phase 1: Fundação e Dados [checkpoint: 058f891]
Implementação da camada de dados local (Dexie) e lógica de negócio inicial.

- [x] **TASK-01: Esquema de Budgets no Dexie** (f821dc6)
  - **Goal:** Adicionar a tabela `budgets` ao Dexie e atualizar os repositórios para suportar o novo modelo.
  - **Details:** Definir o esquema no `src/core/db.ts` e criar a entidade em `src/infrastructure/db/entities/BudgetEntity.ts` (seguindo os padrões do projeto).
- [x] **TASK-02: BudgetStore e Reatividade** (5a4b799)
  - **Goal:** Implementar Store para gerenciar orçamentos e calcular saldos derivados via `liveQuery`.
  - **Details:** Criar `src/modules/budgets/application/stores/budgetStore.ts`. Garantir que o cálculo de saldo (`calculateRemaining`) seja reativo às mudanças nas transações.

## Phase 2: UI e Componentização
Criação dos componentes visuais e integração com a interface do usuário.

- [x] **TASK-03: Componente BudgetProgressBar** (a237a01)
  - **Goal:** Criar um componente de barra de progresso reutilizável que mude de cor conforme o consumo.
  - **Details:** Criar `src/modules/budgets/ui/components/BudgetProgressBar.vue` usando PrimeVue ou Vanilla CSS conforme os guidelines.
- [x] **TASK-04: Tela de Gestão de Orçamentos** (f8c0668)
  - **Goal:** Desenvolver a interface principal para visualizar e gerenciar (CRUD) orçamentos.
  - **Details:** Criar `src/modules/budgets/ui/views/BudgetsView.vue`. Deve listar os orçamentos com suas respectivas barras de progresso.

## Phase 3: Sincronização e Integração Final
Garantir que os dados sejam sincronizados com o backend e realizar o polimento final.

- [x] **TASK-05: Sincronização de Orçamentos (SyncEngine)** (020b3b1)
  - **Goal:** Integrar a tabela de orçamentos ao `SyncEngine` para persistência no Supabase.
  - **Details:** Atualizar `src/core/sync/SyncEngine.ts` para incluir a nova tabela. Criar as políticas de RLS necessárias no Supabase (se acessível).
- [x] **TASK-06: Testes de Integração e Mobile** (980f5b8)
  - **Goal:** Validar o fluxo completo em diferentes cenários e dispositivos.
  - **Details:** Escrever testes em `src/modules/budgets/__tests__/` e validar a responsividade no mobile.

## Phase: Review Fixes
- [x] Task: Apply review suggestions fbf33c4
