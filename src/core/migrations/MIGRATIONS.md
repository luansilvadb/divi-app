# Guia de Migrations — Divi

## Visão Geral

O Divi usa um sistema de migrations dual:
- **Dexie (client-side)**: Schema do IndexedDB gerenciado via `MigrationRunner`
- **Supabase (server-side)**: Arquivos SQL versionados (`up.sql` / `down.sql`)

Ambas as camadas devem estar sempre alinhadas.

---

## Como Criar uma Nova Migration

### Passo 1: Criar Migration Dexie

Crie um arquivo em `src/core/migrations/dexie/`:

```
src/core/migrations/dexie/NNN_descricao.ts
```

**Template:**

```typescript
import type { DexieMigration } from '../types'

export const migrationNNNDescricao: DexieMigration = {
  version: NNN,          // Sequencial, sem gaps
  name: 'descricao',
  description: 'O que esta migration faz',
  createdAt: new Date().toISOString(),
  stores: {
    // ⚠️ IMPORTANTE: Liste TODAS as tabelas, não apenas as que mudaram.
    // Dexie requer o mapa completo de stores para cada versão.
    transactions: 'id, user_id, date, sync_status, deleted, payee_id, *tags',
    wallets: 'id, user_id, name, sync_status, deleted',
    categories: 'id, user_id, name, sync_status, deleted',
    payees: 'id, user_id, name, sync_status, deleted',
    loans: 'id, user_id, name, sync_status, deleted',
    subscriptions: 'id, user_id, name, sync_status, deleted',
    activities: 'id, user_id, timestamp',
    budgets: 'id, user_id, name, sync_status, deleted',
    goals: 'id, user_id, name, sync_status, deleted',
    // Adicione novas tabelas ou modifique índices aqui
  },
  upgrade: async (tx) => {
    // Transformação de dados existentes
    // Acesse tabelas via tx.table('nome_tabela')
  },
  downgrade: async (tx) => {
    // Rollback da transformação de dados
  },
}
```

### Passo 2: Registrar no Index

Edite `src/core/migrations/dexie/index.ts`:

```typescript
import { migrationNNNDescricao } from './NNN_descricao'

const allMigrations = [
  migration001InitialSchema,
  migration002AddTagsToTransactions,
  migrationNNNDescricao,  // ← Adicionar aqui
]
```

### Passo 3: Criar Par SQL (Supabase)

```
src/core/migrations/supabase/NNN_descricao.up.sql    ← Aplicar mudanças
src/core/migrations/supabase/NNN_descricao.down.sql   ← Reverter mudanças
```

### Passo 4: Atualizar Interfaces TypeScript

Se a migration adiciona/remove campos, atualize as interfaces em:
- `src/core/db.ts` (`Local*` interfaces)
- `src/shared/domain/entities/` (shared interfaces)
- `src/modules/*/domain/` (module-specific interfaces)

### Passo 5: Criar Testes

```
src/core/migrations/__tests__/NNN_descricao.spec.ts
```

### Passo 6: Validar

```bash
# Rodar testes de migrations
npx vitest run src/core/migrations/__tests__/

# Rodar toda a suite
CI=true npm run test

# Verificar type-checking
npm run type-check
```

---

## Exemplos de Transformações Comuns

### Adicionar campo com valor default

```typescript
upgrade: async (tx) => {
  await tx.table('transactions').toCollection().modify((record) => {
    record.newField = 'default_value'
  })
}
```

### Renomear campo

```typescript
upgrade: async (tx) => {
  await tx.table('wallets').toCollection().modify((record) => {
    record.new_name = record.old_name
    delete record.old_name
  })
}
```

### Calcular campo derivado

```typescript
upgrade: async (tx) => {
  await tx.table('goals').toCollection().modify((record) => {
    record.progress = (record.current_value / record.target_value) * 100
  })
}
```

### Migrar enum

```typescript
upgrade: async (tx) => {
  await tx.table('subscriptions').toCollection().modify((record) => {
    if (record.frequency === 'month') record.frequency = 'monthly'
    if (record.frequency === 'year') record.frequency = 'yearly'
  })
}
```

### Adicionar nova tabela

```typescript
stores: {
  // ...manter todas as tabelas existentes...
  nova_tabela: 'id, user_id, name, sync_status, deleted',
}
```

### Remover tabela

```typescript
stores: {
  // ...manter todas as tabelas existentes...
  tabela_removida: null,  // null = drop table
}
```

---

## Checklist de Validação

- [ ] Version é sequencial (sem gaps)
- [ ] `stores` inclui TODAS as tabelas (não apenas as modificadas)
- [ ] Upgrade function é idempotente (pode rodar mais de uma vez sem problemas)
- [ ] Downgrade function existe e reverte as mudanças
- [ ] Par SQL correspondente criado (up + down)
- [ ] Interfaces TypeScript atualizadas
- [ ] Testes unitários cobrindo upgrade e downgrade
- [ ] Teste de integração com Dexie real (fake-indexeddb)
- [ ] `SYNCABLE_TABLES` em `syncConfig.ts` atualizado se nova tabela adicionada

---

## Troubleshooting

### "VersionError: The requested version is lower than existing version"
O Dexie não permite versionar para trás. A migration nova precisa ter version **maior** que a atual.

### Dados sumiram após migration
- Verifique se o DB name não foi alterado (deve ser `DiviDB_v2`)
- Verifique se `stores` inclui todas as tabelas anteriores
- Tabelas não listadas em `stores` NÃO são apagadas pelo Dexie, mas tabelas com valor `null` SIM

### Upgrade function não executou
- Upgrade functions só executam quando o IndexedDB detecta que a version mudou
- Se o DB já está na version alvo, o upgrade é pulado
- Para testar, delete o IndexedDB no DevTools > Application > Storage

### Migration SQL falhou no Supabase
- Verifique se a migration anterior foi aplicada primeiro
- Verifique RLS policies com `auth.uid()`
- Teste em ambiente local antes de produção

---

## Arquitetura

```
src/core/migrations/
├── types.ts                        # Interfaces TypeScript
├── MigrationRegistry.ts            # Registro centralizado
├── MigrationRunner.ts              # Orquestrador de execução
├── MIGRATIONS.md                   # ← Este documento
├── dexie/
│   ├── index.ts                    # Registra todas as migrations
│   ├── 001_initial_schema.ts       # Schema base
│   └── 002_add_tags_to_transactions.ts  # Exemplo
├── supabase/
│   ├── README.md                   # Instruções de uso
│   ├── 001_initial_schema.up.sql
│   ├── 001_initial_schema.down.sql
│   ├── 002_add_tags_to_transactions.up.sql
│   ├── 002_add_tags_to_transactions.down.sql
│   └── seed.sql                    # Dados iniciais
└── __tests__/
    ├── MigrationRegistry.spec.ts
    ├── MigrationRunner.spec.ts
    ├── 001_initial_schema.spec.ts
    └── 002_add_tags.spec.ts
```
