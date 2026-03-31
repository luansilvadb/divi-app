# Research: Refatoração para Fatiamento Plano

**Decision**: Implementação de um diretório `src/shared/domain` para centralizar as fontes de verdade (Entidades e Interfaces de Repositório) que são transversais aos módulos financeiros.
**Rationale**: Como a pasta `finance` será removida, não podemos permitir que um módulo (ex: `budgets`) dependa diretamente de outro (ex: `transactions`) para tipos básicos. `shared/domain` serve como o "Core Financeiro" desacoplado das fatias de negócio.
**Alternatives considered**: Duplicação de tipos (rejeitado por manutenção difícil) e caminhos relativos complexos entre módulos (rejeitado por acoplamento circular).

## Findings

### 1. Organização de `src/shared/domain`
O diretório deve ser estruturado em subpastas:
- `/entities`: `Transaction.ts`, `Wallet.ts`, `Category.ts`, `Budget.ts`, `Goal.ts`, `Loan.ts`, `Subscription.ts`.
- `/contracts`: Interfaces genéricas que não pertencem a uma fatia específica ou que são consumidas por agregadores (como o Dashboard).

### 2. Estratégia de Migração Incremental
A remoção de `src/modules/finance` deve ser a **última tarefa**. A migração ocorrerá movendo um submódulo por vez (Ex: `transactions`) e atualizando as referências globais. Durante o estado transiente, o monólito `finance` coexistirá com os novos módulos planos.

### 3. Registro de DI com String Tokens
Para evitar importações circulares, o registro de DI em `src/core/di.ts` usará tokens de string consistentes (ex: `'ITransactionRepository'`). Isso garante que a UI dependa apenas do contrato centralizado em `shared/domain` e resolva a implementação via token.

## Risks & Mitigations
- **Acoplamento Circular**: Mitigado pelo uso estrito de `shared/domain` para todos os tipos cruzados.
- **Quebra de Sync**: Mitigado por garantir que cada repositório de infraestrutura (`/infrastructure`) mantenha sua lógica de sync Dexie/Supabase isolada.
