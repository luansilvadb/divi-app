# Sprint 04 — v0.4.0

> Épico: 04 — O Espelho Orçamentário
> Objetivo: Implementar a gestão de budgets reativa para controle financeiro em tempo real.

## Checklist

- [ ] **TASK-01: Esquema de Budgets no Dexie**
  - Spec: `spec/TECHNICAL_SPEC_V0.5.0.md`
  - DoD: Adicionar tabela `budgets` ao Dexie e atualizar repositórios.

- [ ] **TASK-02: BudgetStore e Reatividade**
  - Spec: `spec/TECHNICAL_SPEC_V0.5.0.md`
  - DoD: Implementar Store para gerenciar orçamentos e calcular saldos derivados via `liveQuery`.

- [ ] **TASK-03: UI de Visualização de Orçamentos**
  - Spec: `spec/TECHNICAL_SPEC_V0.5.0.md`
  - DoD: Criar tela/seção de orçamentos com barras de progresso dinâmicas.

- [ ] **TASK-04: Sincronização de Orçamentos**
  - Spec: `spec/TECHNICAL_SPEC_V0.5.0.md`
  - DoD: Integrar orçamentos ao `SyncEngine` para persistência no backend.

## Notas

- A experiência de configurar um budget deve ser tão fluida quanto registrar uma transação.
- Priorizar o feedback visual imediato.
