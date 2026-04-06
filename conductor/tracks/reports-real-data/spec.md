# Especificação: Integração de Dados Reais no Módulo de Relatórios

## Objetivo
Substituir os dados mockados no componente `ReportsView.vue` por dados reais provenientes do `transactionStore` e `budgetStore`.

## Requisitos
- **Distribuição por Categoria**: Usar `transactionStore.topCategories` (ou derivar de `transactions`).
- **Fluxo de Caixa**: Calcular histórico de entradas vs saídas dos últimos 6 meses usando o repositório de transações.
- **Média Diária**: Calcular `(totalExpense / dias_decorridos_no_mes)`.
- **Maior Gasto**: Encontrar a transação de maior valor no mês atual.
- **Economia Potencial**: Implementar lógica simples baseada em categorias de lazer/supérfluos.

## Critérios de Aceite
- O gráfico de pizza/barras de categorias deve refletir os dados reais do IndexedDB.
- Os cards de métricas (Média Diária, Maior Gasto) devem ser dinâmicos.
- O `BaseMonthSwitcher` deve disparar novas buscas no `transactionStore`.
