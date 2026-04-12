# Supabase Migrations

## Visão Geral

Esta pasta contém as migrations SQL versionadas para o banco de dados Supabase (PostgreSQL).
Cada migration deve ter um par de arquivos `up.sql` (aplica) e `down.sql` (reverte).

## Convenção de Nomenclatura

```
NNN_descricao_em_snake_case.up.sql
NNN_descricao_em_snake_case.down.sql
```

Onde `NNN` é um número sequencial com 3 dígitos (001, 002, 003...).

## Como Aplicar Migrations

### Via Supabase Dashboard (SQL Editor)

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione o projeto Divi
3. Vá em **SQL Editor**
4. Copie e cole o conteúdo do arquivo `.up.sql`
5. Clique em **Run**
6. Verifique que nenhum erro foi reportado

### Via Supabase CLI

```bash
# Instalar a CLI (se não tiver)
npm install -g supabase

# Login
supabase login

# Aplicar migration
supabase db push

# Ou executar SQL diretamente
supabase db execute --file ./src/core/migrations/supabase/001_initial_schema.up.sql
```

## Processo de Rollback

1. Identifique qual migration precisa ser revertida
2. Execute o arquivo `.down.sql` correspondente no SQL Editor
3. **⚠️ ATENÇÃO**: Rollbacks podem causar perda de dados. Sempre faça backup antes.

```bash
# Via CLI
supabase db execute --file ./src/core/migrations/supabase/001_initial_schema.down.sql
```

## Checklist Antes de Aplicar em Produção

- [ ] Migration testada em ambiente local/staging
- [ ] Backup do banco de produção realizado
- [ ] `.down.sql` testado e funcional
- [ ] RLS policies verificadas
- [ ] Índices adequados incluídos
- [ ] Migration Dexie correspondente criada e alinhada
- [ ] Equipe notificada sobre a mudança

## Arquivo seed.sql

O `seed.sql` contém dados iniciais (categorias padrão). Ele deve ser executado manualmente
para cada novo usuário, substituindo `<USER_ID>` pelo UUID real do usuário.

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `001_initial_schema.up.sql` | Schema inicial completo (todas as tabelas, RLS, triggers) |
| `001_initial_schema.down.sql` | Rollback do schema inicial |
| `seed.sql` | Categorias padrão para novos usuários |
