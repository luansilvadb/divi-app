# Gargalos Arquiteturais Identificados e Soluções

1. **Reatividade e O(1) Lookups no State (Pinia)**
   - **Gargalo:** O uso de `Map` em computed properties (`categoryMap`, `walletMap`) no `financeStore` força a recriação total do Map sempre que a lista muda, além de ter suporte reativo inferior a objetos puros no Vue 3. Isso degrada a performance de componentes que renderizam listas extensas de transações (ex: `TransactionsView`), onde esses Maps são acessados a cada iteração.
   - **Solução:** Substituir `Map` por dicionários puros (`Record<string, Entity>`). O Vue otimiza reativamente as propriedades de objetos rasos ou reativos. Assim, o `categoryMap` vira um dicionário simples, e o lookup permanece O(1) sem o overhead de instanciar novos objetos `Map`.

2. **Sync Sequencial Bloqueante (Infraestrutura)**
   - **Gargalo:** No `DexieSupabaseTransactionRepository`, o método `sync()` realiza iterações com `await` em um `for...of` loop para requisições de rede individuais (upsert e delete). Para sincronizações maiores, isso causa bloqueios massivos de I/O e alta latência.
   - **Solução:** Utilizar operações em lote (Bulk Ops). Agrupar os itens a serem deletados para um `delete().in('id', [...])` e agrupar os itens de insert/update para passar um array direto ao `.upsert(array)`. O Supabase e o PostgREST suportam arrays por padrão. O mesmo para as deleções e atualizações locais no Dexie (`bulkDelete`, `bulkPut`).

3. **Derivações de Estado Custosas na Camada UI (TransactionsView)**
   - **Gargalo:** O `groupedTransactions` realiza um `.sort()` não memoizado instanciando objetos `Date` repetidamente: `new Date(b.date).getTime()`. O `dateKey` também sofre um `.split('T')[0]` constante em cada iteração dentro da `TransactionsView`. E o filtro textual recria `toLowerCase()` múltiplos durante o loop.
   - **Solução:**
     - Pre-calcular o valor numérico da data no próprio objeto ao chegar da API/DB ou realizar o cast otimizado.
     - Reduzir as chamadas string no filtro memoizando a `searchQuery`.
     - Otimizar o agrupador para não precisar mutar arrays extensos e realizar alocações `O(N log N)` em tempo de render.

4. **Computações Redundantes de Totais (Pinia)**
   - **Gargalo:** `totalIncome`, `totalExpense` usam `.filter().reduce()`, o que itera a array `transactions` duas vezes (uma para filtrar, outra para reduzir).
   - **Solução:** Consolidar as iterações de totais em um único laço (`reduce` direto) ou usar um `watch` sobre a `transactions.value` para computar saldos incrementalmente em uma única iteração (O(N) ao invés de O(2N)).
