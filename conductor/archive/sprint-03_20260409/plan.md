# Plan: Sprint 03 — v0.3.0: Inserção Rápida e Predição (`sprint-03_20260409`)

## Fase 1: Motor de Predição Local (Domain & Application) [checkpoint: c37dd7a]

- [x] Task: Definir Interfaces e Tipos para Predição (c32e412)
  - [x] Criar tipos em `src/modules/transactions/domain/prediction.ts`
- [x] Task: Implementar `PredictionService` (660e72c)
  - [x] Criar testes unitários para a lógica de predição em `src/modules/transactions/application/__tests__/PredictionService.spec.ts`
  - [x] Implementar `PredictionService` em `src/modules/transactions/application/PredictionService.ts`
  - [x] Integrar busca histórica via Dexie
- [x] Task: Registrar `PredictionService` no container de DI (abb728b)
  - [x] Atualizar `src/core/di.ts` e `src/core/di-tokens.ts`
- [x] Task: Conductor - User Manual Verification 'Fase 1: Motor de Predição Local' (c37dd7a)

## Fase 2: UI Quick Entry (Modal) [checkpoint: 0f707f2]

- [x] Task: Criar componente `QuickEntryModal.vue` (d12fd47)
  - [x] Escrever testes de componente para o modal (foco inicial, atalhos Enter/Esc)
  - [x] Implementar estrutura do modal com campos de Valor, Payee, Categoria e Carteira
- [x] Task: Integrar Predição na UI (70de4dd)
  - [x] Adicionar `watch` no campo Payee para disparar o `PredictionService`
  - [x] Implementar preenchimento automático visual dos campos sugeridos
- [x] Task: Conductor - User Manual Verification 'Fase 2: UI Quick Entry' (0f707f2)

## Fase 3: Integração e Persistência [checkpoint: 520e769]

- [x] Task: Salvar Transação e disparar SyncEngine (ea22f53)
  - [x] Implementar lógica de salvamento local via Dexie no `QuickEntryModal`
  - [x] Garantir chamada de `SyncEngine.enqueueSync()` após o salvamento
- [x] Task: Feedback Visual e UX (07eeccf)
  - [x] Adicionar Toast de sucesso ao salvar
  - [x] Garantir fechamento automático do modal e limpeza dos campos
- [x] Task: Conductor - User Manual Verification 'Fase 3: Integração e Persistência' (520e769)
