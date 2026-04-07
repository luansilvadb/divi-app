# SPRINT ATUAL: v0.2.0 - Fundação & Dashboard Central

## [OBJETIVO]
Estabilizar a interface principal de usuário e estabelecer os padrões de fluxo de dados centrais para o Dashboard.

## [TAREFAS]

### Infraestrutura Core
- [ ] Implementar a lógica base do `SynchronizationService` (seguindo o ADR 001).
- [ ] Padronizar o uso de `BaseCard` e `BaseButton` em `DashboardView.vue`.
- [ ] Correção: Garantir que todos os dados mockados em `DashboardView.vue` sejam substituídos por valores da `dashboardStore` e `transactionStore`.

### Refinamento de UI/UX
- [ ] Adicionar esqueletos de carregamento (*loading skeletons*) para os cartões do Dashboard enquanto os dados estão sendo buscados.
- [ ] Implementar funcionalidade "Pull-to-Refresh" na visão mobile para o Dashboard.
- [ ] Auditar e corrigir classes Tailwind CSS para consistência com o `diviPreset`.

### Testes & Qualidade
- [ ] Criar testes unitários para `dashboardStore` e `transactionStore`.
- [ ] Corrigir falha de teste existente em `TransactionsView.spec.ts` (caso de visão mobile).
- [ ] Rodar `npm run lint` e resolver quaisquer problemas pendentes.

---

## [IMPEDIMENTOS]
- Nenhum identificado no momento.

## [NOTAS]
- Sprint iniciada em 2026-04-07.
- Conclusão prevista: 2026-04-21.
