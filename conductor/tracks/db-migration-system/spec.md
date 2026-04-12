# Spec: Sistema de Migrations Completo (Dexie + Supabase)

## 1. Problema

Atualmente o projeto Divi não possui um sistema formal de migrations. O schema do banco Dexie (IndexedDB) é definido de forma hardcoded em `src/core/db.ts` com um único `this.version(1).stores({...})`. O schema do Supabase (PostgreSQL) é gerenciado manualmente via dashboard, sem nenhum arquivo SQL versionado no repositório.

### Riscos do estado atual:
- **Perda de dados**: Alterações no schema podem apagar dados existentes do IndexedDB
- **Sem rollback**: Impossível reverter uma mudança de schema que causou problemas
- **Sem rastreabilidade**: Não há histórico de quais mudanças foram feitas e quando
- **Inconsistência**: Schema do Dexie e do Supabase podem ficar dessincronizados
- **Deploy arriscado**: Novas features que alteram schema não têm processo seguro de deployment
- **Sem retrocompatibilidade**: Versões antigas do app podem quebrar com dados novos

## 2. Objetivo

Implementar um sistema de migrations de nível profissional que cubra **ambas as camadas** (Dexie local e Supabase remoto), seguindo as melhores práticas da indústria.

## 3. Requisitos Funcionais

### 3.1. Migrations Dexie (Client-Side)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| D1 | Cada alteração de schema deve ser uma migration numerada e sequencial | MUST |
| D2 | Migrations devem suportar `upgrade` (transformação de dados para frente) | MUST |
| D3 | Migration runner deve aplicar automaticamente todas as migrations pendentes na ordem correta | MUST |
| D4 | O schema atual hardcoded em `db.ts` deve ser refatorado para usar o sistema de migrations | MUST |
| D5 | Migrations devem poder adicionar/remover tabelas e índices | MUST |
| D6 | Migrations devem poder transformar dados existentes (ex: renomear campo, calcular novo campo) | MUST |
| D7 | O sistema deve rastrear a versão atual do schema no banco local | MUST |
| D8 | Suporte a rollback via migration de "downgrade" para cada migration | SHOULD |
| D9 | Validação de integridade pós-migration (verificar se dados foram migrados corretamente) | SHOULD |
| D10 | CLI/helper para gerar scaffold de nova migration | COULD |

### 3.2. Migrations Supabase (Server-Side)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| S1 | Arquivos SQL versionados no repositório (up/down) | MUST |
| S2 | Migration `001_initial_schema` que represente o schema atual do Supabase | MUST |
| S3 | Documentação clara de como aplicar migrations no Supabase | MUST |
| S4 | Cada migration SQL deve ter seu par `up.sql` e `down.sql` | MUST |
| S5 | Arquivo de seed para dados iniciais (categorias padrão, etc.) | SHOULD |
| S6 | Script/instruções para aplicar via Supabase CLI ou dashboard | SHOULD |
| S7 | Validação de que migrations Dexie e Supabase estão alinhadas | COULD |

### 3.3. Infraestrutura

| ID | Requisito | Prioridade |
|----|-----------|------------|
| I1 | Tipagem forte TypeScript para todas as interfaces de migration | MUST |
| I2 | Logging detalhado de cada migration executada (sucesso/falha) | MUST |
| I3 | Tratamento de erros robusto - falha em uma migration não corrompe o banco | MUST |
| I4 | Testes unitários para o MigrationRunner e cada migration individual | MUST |
| I5 | Documentação de como criar novas migrations (guia para desenvolvedores) | MUST |
| I6 | Integração transparente com o SyncEngine existente | MUST |

## 4. Arquitetura Proposta

```
src/core/
├── db.ts                          # Refatorado para usar MigrationRunner
├── migrations/
│   ├── types.ts                   # Interfaces: Migration, MigrationContext, etc.
│   ├── MigrationRunner.ts         # Orquestra execução de migrations
│   ├── MigrationRegistry.ts       # Registro centralizado de todas as migrations
│   ├── dexie/
│   │   ├── index.ts               # Exporta array ordenado de migrations
│   │   ├── 001_initial_schema.ts  # Schema atual convertido em migration
│   │   └── ... (futuras migrations)
│   └── supabase/
│       ├── README.md              # Instruções de uso
│       ├── 001_initial_schema.up.sql
│       ├── 001_initial_schema.down.sql
│       ├── seed.sql               # Dados iniciais
│       └── ... (futuras migrations)
```

### 4.1. Interface `Migration` (Dexie)

```typescript
interface DexieMigration {
  version: number                                    // Versão sequencial (1, 2, 3...)
  name: string                                       // Nome descritivo
  description: string                                // O que esta migration faz
  createdAt: string                                  // ISO timestamp
  stores: Record<string, string | null>              // Schema Dexie (null = drop table)
  upgrade?: (tx: Transaction) => Promise<void>       // Transformação de dados
  downgrade?: (tx: Transaction) => Promise<void>     // Rollback de dados
}
```

### 4.2. Fluxo de Execução

```
App Boot → DiviDatabase constructor → MigrationRunner.apply()
  ├─ Lê versão atual do DB
  ├─ Filtra migrations pendentes (version > current)
  ├─ Para cada migration (em ordem):
  │   ├─ Define stores (schema)
  │   ├─ Executa upgrade() se existir
  │   └─ Loga resultado
  └─ DB pronto para uso
```

### 4.3. Compatibilidade com Dexie

O Dexie já possui um sistema de versionamento nativo via `.version(N).stores({}).upgrade(fn)`. O `MigrationRunner` não vai **substituir** esse mecanismo, mas sim **automatizar e organizar** as chamadas em arquivos separados, garantindo:
- Cada migration é um módulo independente e testável
- O registry garante a ordem correta
- O `db.ts` fica limpo e declarativo

## 5. Schema Atual (Referência para Migration 001)

### Dexie Stores:
```
transactions: 'id, user_id, date, sync_status, deleted, payee_id'
wallets:      'id, user_id, name, sync_status, deleted'
categories:   'id, user_id, name, sync_status, deleted'
payees:       'id, user_id, name, sync_status, deleted'
loans:        'id, user_id, name, sync_status, deleted'
subscriptions:'id, user_id, name, sync_status, deleted'
activities:   'id, user_id, timestamp'
budgets:      'id, user_id, name, sync_status, deleted'
goals:        'id, user_id, name, sync_status, deleted'
```

### SyncMetadata Base Fields:
```typescript
id: string
user_id: string
sync_status: SyncStatus  // 'synced' | 'pending' | 'failed'
client_updated_at: string
created_at: string
version: number
deleted: boolean
last_synced_at?: string
server_updated_at?: string
```

## 6. Critérios de Aceitação

- [ ] `db.ts` refatorado para usar migrations em vez de schema hardcoded
- [ ] Migration `001_initial_schema` cria exatamente o mesmo schema que existe hoje
- [ ] É possível criar uma nova migration sem tocar em `db.ts`
- [ ] Dados existentes no IndexedDB são preservados após a refatoração
- [ ] MigrationRunner loga cada migration aplicada
- [ ] Erros em uma migration não corrompem o banco
- [ ] Arquivos SQL do Supabase estão versionados no repositório
- [ ] Documentação clara de como criar e aplicar novas migrations
- [ ] Testes unitários cobrem MigrationRunner e migrations individuais

## 7. Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Renomear DB ou alterar version pode apagar dados existentes | ALTO | Migration 001 deve preservar exatamente o schema atual sem alterar o DB name |
| Dexie não suporta rollback nativo de schema | MÉDIO | Implementar downgrade como "best effort" via nova version com schema anterior |
| Migrations Supabase aplicadas fora de ordem | MÉDIO | Naming convention com timestamp + documentação de processo |
| Teste de migrations é complexo (precisa de DB real) | BAIXO | Usar Dexie fake/indexeddb-mock para testes |

## 8. Fora de Escopo

- Migrations automáticas via CI/CD (pode ser adicionado depois)
- GUI para gerenciar migrations
- Supabase CLI integration completa (apenas arquivos SQL + instruções)
- Migration de dados entre usuários
