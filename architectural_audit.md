# Auditoria Arquitetural e Teses de Otimização

Conforme as diretrizes de reestruturação profunda do sistema, esta auditoria mapeia ineficiências latentes e gargalos estruturais identificados nas camadas de Infraestrutura e Gerenciamento de Estado (UI/Application), fornecendo as teses de otimização aplicadas. O foco central foi o ganho extremo de performance computacional e eliminação de bloqueios de I/O, mantendo os contratos e comportamentos externos inalterados.

## 1. Reestruturação do Look-up Reativo no Estado (Pinia)
**Gargalo Identificado:** O uso de instâncias nativas `Map` no Vue 3 (`categoryMap`, `walletMap` no `financeStore`/`transactionStore`) degradava a performance de renderização de grandes listas. Areatividade do Vue 3 reage de forma sub-ótima com objetos pesados do tipo Map quando ocorrem iterações repetitivas.
**Tese de Otimização:** Transformar estruturas `Map` em Dicionários de Objeto Simples (`Record<string, Entity>`). A alocação em dicionários nativos puros (Plain Old Javascript Objects) oferece lookups absolutos em `O(1)` e reduz substancialmente o overhead da árvore de reatividade do Pinia, evitando a instancialização de métodos complexos sob o Proxy do Vue, resultando em listas de transações renderizadas com latência reduzida.

## 2. Otimização de I/O: Sincronização Não-Bloqueante (Infraestrutura)
**Gargalo Identificado:** O método `sync()` do repositório `DexieSupabaseTransactionRepository` executava iterações sequenciais usando `await` em laços `for...of` para operações de rede (Upserts e Deletes no Supabase/PostgREST). Em lotes massivos, isso criava um comportamento de enfileiramento bloqueante (Waterfall), saturando a thread e resultando em extrema latência. Outro erro impedia as atualizações em lote via Dexie pois o identificador auto-incremental (`localId`) vinha como String em vez de Inteiro.
**Tese de Otimização:** Transição integral para Bulk Operations (Operações em Lote).
- **Rede:** Os itens foram aglutinados para despachos únicos via `.upsert(array)` e `.delete().in('id', array)`.
- **Banco de Dados Local (IndexedDB):** Ajuste de tipagem (`localId` para `number` em todas as camadas de domínio, abstração e infra) que desbloqueou as funções `bulkPut` e `bulkGet` do Dexie.
- **Resultado:** A mudança transformou M iterações I/O-bound (`O(M)`) em uma única requisição (`O(1)` na perspectiva de Network Trips) garantindo altíssima vazão (Throughput).

## 3. Desoneração Computacional na Camada de Visão (UI Derivations)
**Gargalo Identificado:** A reatividade calculada (`groupedTransactions` e Filtros) exigia instanciações de data pesadas (`new Date(b.date).getTime()`) e conversões textuais redundantes (`.toLowerCase()`) no nível do renderizador (`TransactionsView`), causando spikes de processamento `O(N log N)` toda vez que o estado era mutado.
**Tese de Otimização:** Processamento pré-render e Injeção Precoce de Metadados (Early Materialization). Durante o mapeamento da entidade do BD Local para o domínio (na classe do Repositório), injetaram-se as propriedades `_titleLower`, `_timestamp` e `_dateKey` (Cálculo antecipado - AOT). Isso converteu a rotina de processamento intenso da camada UI de `O(N log N)` instanciando objetos em renderizações puras baseadas em leitura direta, economizando CPU.

## 4. Otimização O(N) para Acumuladores de Saldos (State Management)
**Gargalo Identificado:** As propriedades computadas para totais (`totalIncome` e `totalExpense`) invocavam sucessivamente funções como `.filter().reduce()`, processando a lista completa duas vezes (`O(2N)`).
**Tese de Otimização:** Implementação de Single Pass Evaluation (Avaliação de Passagem Única) via observação reativa. Um `watch` direto sobre a lista de `transactions` intera em um simples laço for-loop imperativo para classificar e acumular os totais simultaneamente, transformando a carga num complexidade exata de `O(N)`.
