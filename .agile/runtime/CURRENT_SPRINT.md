# Sprint 03 — v0.3.0

> Épico: 03 — A Dança dos Números
> Objetivo: Implementar a inserção ultrarrápida de transações com motor de predição local para latência zero.

## Checklist

- [ ] **TASK-01: Motor de Predição Local**
  - Spec: `spec/TECHNICAL_SPEC_V0.4.0.md`
  - DoD: Implementar `PredictionService` com lógica de histórico e preenchimento automático.

- [ ] **TASK-02: UI Quick Entry (Modal)**
  - Spec: `spec/TECHNICAL_SPEC_V0.4.0.md`
  - DoD: Criar componente de entrada rápida com foco automático e suporte a atalhos (Enter/Esc).

- [ ] **TASK-03: Integração com SyncEngine**
  - Spec: `spec/TECHNICAL_SPEC_V0.4.0.md`
  - DoD: Garantir que transações criadas via Quick Entry disparem o `SyncEngine.enqueueSync()`.

## Notas

- Focar na eliminação de cliques desnecessários.
- A predição deve ser silenciosa e não intrusiva.
