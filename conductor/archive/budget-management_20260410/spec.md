# Especificação Técnica: Gestão de Orçamentos (Budgets)

> Status: Draft | Data: 2026-04-10

## 1. Contexto e Motivação
O usuário precisa de limites claros para suas despesas para atingir a paz de espírito financeira. O sistema de orçamentos permite definir quanto se pretende gastar por categoria.

## 2. Contrato de Interface

### 2.1 Modelo de Dados (Dexie/Local)
```typescript
interface LocalBudget {
  id: string; // UUID
  category_id: string;
  amount: number;
  period: 'monthly';
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  sync_status: 'pending' | 'synced';
}
```

### 2.2 Cálculo de Saldo (Derivado)
```typescript
function calculateRemaining(budget: LocalBudget, transactions: Transaction[]): number {
  const spent = transactions
    .filter(t => t.category_id === budget.category_id && !t.deleted)
    .reduce((acc, t) => acc + t.amount, 0);
  return budget.amount - spent;
}
```

## 3. Fluxo de Execução
1. Usuário acessa a aba "Orçamentos".
2. O sistema busca todos os orçamentos ativos do Dexie.
3. Para cada orçamento, o sistema realiza um query no Dexie buscando transações do mês corrente para aquela categoria.
4. O saldo é calculado e exibido em uma barra de progresso.
5. Se o saldo for < 10%, a barra fica vermelha.

## 4. Edge Cases
1. **Transações em Moedas Diferentes:** O sistema assume a moeda padrão do usuário (v1 não suporta multi-currency nos budgets).
2. **Mudança de Categoria:** Se uma transação muda de categoria, o saldo de dois orçamentos deve ser atualizado instantaneamente via reatividade do Dexie/Pinia.
3. **Orçamento Sem Categoria:** Todo orçamento deve estar atrelado a uma categoria válida.

## 5. Cenários BDD

```gherkin
Feature: Gestão de Orçamentos Mensais

  Scenario: Visualizar consumo do orçamento
    Given que eu tenho um orçamento de R$ 1000 para "Lazer"
    And eu já gastei R$ 600 em transações de "Lazer" este mês
    When eu visualizo a tela de orçamentos
    Then eu devo ver que restam R$ 400 (40%)
    And a barra de progresso deve estar amarela

  Scenario: Alerta de limite excedido
    Given que meu orçamento de "Alimentação" é R$ 500
    And eu já gastei R$ 550
    Then o saldo deve ser exibido como R$ -50
    And a barra de progresso deve estar 100% preenchida em vermelho
```

## 6. Critérios de Aceitação (DoD)
- [ ] CRUD de Orçamentos funcionando offline.
- [ ] Atualização em tempo real do saldo ao adicionar transações.
- [ ] Componente visual de barra de progresso com feedback de cores.
- [ ] Integração com o SyncEngine para persistência no Supabase.

## 7. Notas de Implementação
- Criar `BudgetStore` no Pinia em `src/modules/budgets/application/stores/budgetStore.ts`.
- Criar componente `BudgetProgressBar.vue` em `src/modules/budgets/ui/components/BudgetProgressBar.vue`.
- Seguir os padrões de Clean Architecture definidos no projeto (modules/budgets/{domain,application,infrastructure,ui}).
