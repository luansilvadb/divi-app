# Data Model: Refatoração do Módulo Finance

As entidades foram movidas para `src/shared/domain/entities/` para permitir o consumo por múltiplos módulos independentes.

## Entidades Compartilhadas

| Entidade | Propriedades Chave | Relacionamentos |
|----------|--------------------|-----------------|
| **Transaction** | id, amount, type, date, notes | Category (id), Wallet (id) |
| **Budget** | id, name, limit_value, period | Category (ids) |
| **Goal** | id, name, target_value, current_value | - |
| **Loan** | id, name, total_value, remaining_value | - |
| **Wallet** | id, name, balance, currency | - |
| **Category** | id, name, icon, color | - |

## Estrutura de Infraestrutura (Dexie/Supabase)

Cada módulo terá seu repositório implementando o sync:
- `DexieTransactionRepository`: Persistência local em `db.transactions`.
- `DexieBudgetRepository`: Persistência local em `db.budgets`.
- ...
