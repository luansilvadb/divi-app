# Plan: Sprint 03 — v0.3.0: Inserção Rápida e Predição (`sprint-03_20260409`)

## Fase 1: Motor de Predição Local (Domain & Application)

- [x] Task: Definir Interfaces e Tipos para Predição (c32e412)
  - [x] Criar tipos em `src/modules/transactions/domain/prediction.ts`
- [x] Task: Implementar `PredictionService` (660e72c)
  - [x] Criar testes unitários para a lógica de predição em `src/modules/transactions/application/__tests__/PredictionService.spec.ts`
  - [x] Implementar `PredictionService` em `src/modules/transactions/application/PredictionService.ts`
  - [x] Integrar busca histórica via Dexie
- [ ] Task: Registrar `PredictionService` no container de DI
  - [ ] Atualizar `src/core/di.ts` e `src/core/di-tokens.ts`
- [ ] Task: Conductor - User Manual Verification 'Fase 1: Motor de Predição Local'

## Fase 2: UI Quick Entry (Modal)

- [ ] Task: Criar componente `QuickEntryModal.vue`
  - [ ] Escrever testes de componente para o modal (foco inicial, atalhos Enter/Esc)
  - [ ] Implementar estrutura do modal com campos de Valor, Payee, Categoria e Carteira
- [ ] Task: Integrar Predição na UI
  - [ ] Adicionar `watch` no campo Payee para disparar o `PredictionService`
  - [ ] Implementar preenchimento automático visual dos campos sugeridos
- [ ] Task: Conductor - User Manual Verification 'Fase 2: UI Quick Entry'

## Fase 3: Integração e Persistência

- [ ] Task: Salvar Transação e disparar SyncEngine
  - [ ] Implementar lógica de salvamento local via Dexie no `QuickEntryModal`
  - [ ] Garantir chamada de `SyncEngine.enqueueSync()` após o salvamento
- [ ] Task: Feedback Visual e UX
  - [ ] Adicionar Toast de sucesso ao salvar
  - [ ] Garantir fechamento automático do modal e limpeza dos campos
- [ ] Task: Conductor - User Manual Verification 'Fase 3: Integração e Persistência'
