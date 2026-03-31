# Gargalos Arquiteturais Identificados e Soluções

1. **Reatividade e O(1) Lookups no State (Pinia)**
   - **Gargalo:** O uso de `ref` com instâncias grandes em `transactions`, `categoryMap` e `walletMap` no `financeStore` força a avaliação recursiva do Vue (Proxy Object Reavitivity overhead). O framework ficava inspecionando cada propriedade dos maps que sofriam mutações iterativas O(N) nas propriedades computadas.
   - **Solução (Aplicada):** Substituir por `shallowRef` para coleções extensas ou mapas estáticos não mutáveis intrinsecamente, removendo a alocação densa de CPU pelo runtime.

2. **Sync Sequencial Bloqueante (Infraestrutura)**
   - **Gargalo:** No `DexieSupabaseTransactionRepository`, o método `sync()` não utilizava o bulk de gravação com eficácia na retroalimentação dos Ids remotos para local `bulkPut`, utilizando lógicas lineares que bloqueavam I/O e desperdiçavam lookups.
   - **Solução (Aplicada):** A lógica iterativa no Dexie sync foi consolidada num laço linear que usa uma estrutura `Set(remotesIds)` rápida e `bulkPut` nativo para resolver tudo em O(1) lookups de confirmação, garantindo I/O sem gargalos massivos.

3. **Derivações de Estado Custosas na Camada UI (TransactionsView)**
   - **Gargalo:** `.sort()` dinâmico associado com transformações custosas (e.g., `_timestamp || new Date(date)`) instanciadas por todo render.
   - **Solução (Aplicada):** A lógica inteira do Store `transactionStore.ts` foi otimizada trocando `filter` via higher order functions por loops Nativos `for(let i=0)`. As chaves `_timestamp`, `_dateKey` e `_titleLower` tornaram-se obrigatórias (Zero Null Fallbacks). O `sort` foi desvinculado dos computeds repetitivos e passado para ser calculado 1x logo após a query do Dexie `fetchTransactionsByMonth`.

4. **Computações Redundantes de Totais (Pinia)**
   - **Gargalo:** `.filter().reduce()` rodava O(2N) ou mais com overhead do callback function do JS.
   - **Solução (Aplicada):** Troquei por laço nativo direto `for(let i=0)` integrado na variável `trans`, diminuindo brutalmente o memory footprint e acelerando loops para apenas O(N).
