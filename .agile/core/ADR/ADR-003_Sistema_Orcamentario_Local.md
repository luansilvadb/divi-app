# ADR-003: Sistema de Orçamentação Local-First Reativo

> Status: Aceito | Data: 2026-04-10 | Versão: 0.4.0

## Contexto
O Epic 4 exige a gestão de orçamentos (budgets). Como o sistema é local-first, o cálculo de quanto resta em cada orçamento deve ser instantâneo e resiliente à falta de conexão.

## Decisão
1. **Esquema de Dados:** Criar tabela `budgets` no Dexie com `category_id`, `amount` (limite), `period` (mensal por padrão) e `user_id`.
2. **Cálculo Reativo:** Utilizar `liveQuery` do Dexie combinado com Pinia para calcular o saldo restante em tempo real. O saldo não será persistido, mas derivado da soma das transações da categoria no período atual subtraído do limite do orçamento.
3. **Alertas Visuais:** Implementar um componente de "Progress Bar" que muda de cor (verde -> amarelo -> vermelho) baseado na porcentagem de uso.

## Alternativas Consideradas
1. **Cálculo no Servidor:** Rejeitado. Viola o princípio de latência zero e offline-first.
2. **Persistir Saldo Restante:** Rejeitado. Complexo de manter sincronizado com edições/deleções de transações passadas. O cálculo derivado é mais confiável.

## Consequências
- **Positivas:** Saldo sempre atualizado, performance máxima, simplicidade de sincronização (apenas os limites são sincronizados).
- **Negativas/Riscos:** Se houver milhares de transações em um único mês para uma categoria, o cálculo derivado pode ter impacto de performance (mitigado por índices no Dexie no campo `date` e `category_id`).
