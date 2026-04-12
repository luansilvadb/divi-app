# Plan: Sistema de Migrations Completo (Dexie + Supabase)

> **Spec:** [spec.md](./spec.md)

---

## Phase 1: Infraestrutura de Migrations (Types + Runner)

### Objetivo
Criar toda a infraestrutura base: tipos TypeScript, o MigrationRunner e o MigrationRegistry.

- [ ] **1.1** Criar `src/core/migrations/types.ts` com interfaces `DexieMigration`, `MigrationResult`, `MigrationContext`
  - `DexieMigration`: version (number), name (string), description (string), createdAt (string), stores (Record<string, string | null>), upgrade? (fn), downgrade? (fn)
  - `MigrationResult`: version, name, status ('applied' | 'skipped' | 'failed'), error?, duration (ms)
  - `MigrationContext`: db reference, previousVersion, targetVersion

- [ ] **1.2** Criar `src/core/migrations/MigrationRegistry.ts`
  - Classe estática que mantém array ordenado de `DexieMigration`
  - Método `register(migration)` com validação de duplicatas e ordem
  - Método `getAll()` retorna migrations ordenadas por version
  - Método `getRange(fromVersion, toVersion)` para migrations parciais
  - Validação: versions devem ser sequenciais sem gaps

- [ ] **1.3** Criar `src/core/migrations/MigrationRunner.ts`
  - Método `applyAll(db: Dexie)`: aplica todas migrations pendentes no construtor do Dexie
  - Internamente: itera sobre migrations do registry e chama `db.version(N).stores(migration.stores).upgrade(migration.upgrade)` para cada uma
  - Logging detalhado: início, fim, duração, sucesso/falha de cada migration
  - Error handling: captura erros, loga detalhes, re-throw para o Dexie tratar
  - Retorna `MigrationResult[]` com status de cada migration aplicada

- [ ] **1.4** Criar testes unitários para `MigrationRegistry`
  - Testar registro de migrations
  - Testar validação de duplicatas
  - Testar ordenação por version
  - Testar `getRange()`

- [ ] **1.5** Criar testes unitários para `MigrationRunner`
  - Testar que `applyAll()` chama `db.version().stores()` para cada migration
  - Testar que upgrade functions são passadas corretamente
  - Testar logging de resultados
  - Mock do Dexie para testes isolados

---

## Phase 2: Migration 001 - Schema Inicial + Refatoração do db.ts

### Objetivo
Converter o schema atual hardcoded em uma migration formal e refatorar `db.ts` para usar o novo sistema.

- [ ] **2.1** Criar `src/core/migrations/dexie/001_initial_schema.ts`
  - Version: 1
  - Name: 'initial_schema'
  - Stores: exatamente o mesmo schema que está em `db.ts` hoje:
    ```
    transactions: 'id, user_id, date, sync_status, deleted, payee_id'
    wallets: 'id, user_id, name, sync_status, deleted'
    categories: 'id, user_id, name, sync_status, deleted'
    payees: 'id, user_id, name, sync_status, deleted'
    loans: 'id, user_id, name, sync_status, deleted'
    subscriptions: 'id, user_id, name, sync_status, deleted'
    activities: 'id, user_id, timestamp'
    budgets: 'id, user_id, name, sync_status, deleted'
    goals: 'id, user_id, name, sync_status, deleted'
    ```
  - Sem upgrade function (é o schema base)

- [ ] **2.2** Criar `src/core/migrations/dexie/index.ts`
  - Importa todas as migrations e exporta array ordenado
  - Registra cada migration no `MigrationRegistry`

- [ ] **2.3** Refatorar `src/core/db.ts` para usar MigrationRunner
  - Remover `this.version(1).stores({...})` hardcoded
  - No constructor: chamar `MigrationRunner.applyAll(this)` que configura todas as versions
  - Manter EXATAMENTE o mesmo DB name (`DiviDB_v2`) para preservar dados existentes
  - Manter todas as Table declarations e types
  - Manter `setupSyncHooks()` e `clearAllData()` inalterados

- [ ] **2.4** Criar teste de integração validando que o schema final é idêntico ao original
  - Criar DB com schema antigo (hardcoded) e DB com novo sistema (migrations)
  - Comparar que ambos têm as mesmas tabelas e índices
  - Verificar que dados existentes são preservados

- [ ] **2.5** Teste de smoke: verificar que o app inicia corretamente com o novo sistema
  - `npm run dev` deve funcionar sem erros
  - Dados existentes no IndexedDB devem estar intactos

---

## Phase 3: Migrations Supabase (SQL Versionado)

### Objetivo
Versionar o schema do Supabase em arquivos SQL no repositório.

- [ ] **3.1** Criar `src/core/migrations/supabase/001_initial_schema.up.sql`
  - CREATE TABLE para todas as 8 tabelas sincronizáveis + activities
  - Incluir todas as colunas baseadas nas interfaces TypeScript + SyncMetadata
  - Incluir RLS policies (enable RLS, policies para user_id = auth.uid())
  - Incluir índices relevantes (user_id, sync_status, etc.)
  - Incluir function + trigger para `server_updated_at` automático

- [ ] **3.2** Criar `src/core/migrations/supabase/001_initial_schema.down.sql`
  - DROP TABLE CASCADE para todas as tabelas criadas
  - DROP FUNCTION/TRIGGER correspondentes
  - Remover RLS policies

- [ ] **3.3** Criar `src/core/migrations/supabase/seed.sql`
  - Categorias padrão (alimentação, transporte, moradia, lazer, saúde, educação, etc.)
  - Nota: seed usa `auth.uid()` placeholder ou aceita user_id como parâmetro

- [ ] **3.4** Criar `src/core/migrations/supabase/README.md`
  - Como aplicar migrations via Supabase Dashboard (SQL Editor)
  - Como aplicar via Supabase CLI (`supabase db push`)
  - Convenção de nomenclatura: `NNN_description.up.sql` / `NNN_description.down.sql`
  - Processo de rollback
  - Checklist antes de aplicar migration em produção

---

## Phase 4: Migration de Exemplo (002) + Guia para Desenvolvedores

### Objetivo
Criar uma migration de exemplo que demonstre o workflow completo e documentar o processo.

- [ ] **4.1** Criar `src/core/migrations/dexie/002_add_tags_to_transactions.ts` (migration de exemplo)
  - Version: 2
  - Adiciona índice `tags` à tabela transactions
  - Upgrade: adiciona campo `tags: []` vazio a todos os transactions existentes
  - Downgrade: remove o campo `tags` de todos os records

- [ ] **4.2** Criar par SQL correspondente
  - `src/core/migrations/supabase/002_add_tags_to_transactions.up.sql`: ALTER TABLE + índice
  - `src/core/migrations/supabase/002_add_tags_to_transactions.down.sql`: rollback

- [ ] **4.3** Atualizar interfaces TypeScript
  - Adicionar `tags?: string[]` em `LocalTransaction` e `Transaction`
  - Manter como opcional para retrocompatibilidade

- [ ] **4.4** Testes para migration 002
  - Testar upgrade: dados antigos recebem `tags: []`
  - Testar downgrade: campo tags é removido
  - Testar que dados existentes não são afetados negativamente

- [ ] **4.5** Criar documentação `src/core/migrations/MIGRATIONS.md`
  - Guia passo a passo: "Como criar uma nova migration"
  - Template de migration Dexie
  - Template de migration SQL
  - Checklist de validação
  - Troubleshooting comum
  - Exemplos de transformações de dados comuns (renomear campo, calcular campo, migrar enum)

---

## Phase 5: Polimento e Integração Final

### Objetivo
Garantir que tudo funciona end-to-end e está bem integrado.

- [ ] **5.1** Verificar integração com SyncEngine
  - SyncEngine deve funcionar normalmente com o novo sistema
  - Novos campos adicionados via migration devem ser sincronizados automaticamente
  - Testar que `SYNCABLE_TABLES` é consistente com as migrations

- [ ] **5.2** Adicionar logging observável via SyncStore
  - Emitir eventos de "migration started" / "migration completed" no store
  - Útil para UI de loading mostrar progresso de migrations

- [ ] **5.3** Rodar suite completa de testes
  - `CI=true npm run test`
  - Garantir que nenhum teste existente quebrou
  - Coverage para os novos módulos > 80%

- [ ] **5.4** Atualizar `conductor/tech-stack.md` se necessário
  - Documentar o sistema de migrations como parte da arquitetura

---

## Notas de Implementação

### Preservação de Dados (CRÍTICO)
- O DB name DEVE permanecer `DiviDB_v2` — mudar o nome cria um banco vazio
- A migration 001 DEVE ter a mesma version (1) e os mesmos stores que existem hoje
- Ao refatorar `db.ts`, o resultado final deve ser **funcionalmente idêntico** ao original

### Convenção de Nomenclatura
- Dexie: `NNN_snake_case_description.ts` (ex: `001_initial_schema.ts`)
- Supabase: `NNN_snake_case_description.{up|down}.sql`
- Versions são inteiros sequenciais sem gaps

### Rollback Strategy
- **Dexie**: Rollback é limitado pelo IndexedDB — uma nova version com schema anterior é a melhor opção
- **Supabase**: `down.sql` completo para cada migration, aplicado manualmente
- Em produção: backup antes de qualquer migration
