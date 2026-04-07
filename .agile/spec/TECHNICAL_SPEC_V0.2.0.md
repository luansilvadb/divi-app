# ESPECIFICAÇÃO TÉCNICA V0.2.0: Refinamento do Dashboard

## 1. Visão Geral
O Dashboard é o hub central do **divi**. Esta especificação detalha a transição de visões com muitos mocks para uma UI totalmente orientada a dados, performática e consistente, seguindo o padrão Clean Architecture.

## 2. Esquemas de Banco de Dados (Dexie - Local-First)

### 2.1. Tabela: `transactions`
Responsável pelo histórico financeiro.
```typescript
interface LocalTransaction {
  localId?: string       // PK Automática do Dexie (Primary Key)
  id?: string            // UUID do Supabase (null se não sincronizado)
  user_id: string        // Relacionamento com Auth
  title: string          // Descrição da transação
  amount: number         // Valor em centavos (inteiro para evitar erros de floating point)
  type: 'income' | 'expense'
  category_id: string    // FK para categorias
  wallet_id: string      // FK para carteiras
  date: string           // Formato ISO8601 (YYYY-MM-DD)
  synced: boolean        // Flag de sincronização
  deleted: boolean       // Soft delete para sync
  updated_at: string     // Timestamp para LWW (Last Write Wins)
}
```

### 2.2. Tabela: `wallets`
Representa contas bancárias ou carteiras.
```typescript
interface LocalWallet {
  id: string             // PK (UUID)
  user_id: string
  name: string
  balance: number        // Saldo atual (centavos)
  currency: string       // Ex: 'BRL'
  synced: boolean
}
```

## 3. Diagramas de Sequência (Inicialização e Sincronização)

### 3.1. Carregamento do Dashboard
```text
[DashboardView] -> [useDashboardStore] : fetchDashboardData()
[DashboardView] -> [useTransactionStore] : fetchTransactionsByMonth(YYYY, MM)

[useDashboardStore] -> [WalletRepository] : getAll()
[WalletRepository] -> [Dexie] : db.wallets.toArray()
[Dexie] -->> [WalletRepository] : LocalWallet[]
[WalletRepository] -->> [useDashboardStore] : Wallet[]

[useTransactionStore] -> [TransactionRepository] : getByMonth(YYYY, MM)
[TransactionRepository] -> [Dexie] : db.transactions.where('date').between(...)
[Dexie] -->> [TransactionRepository] : LocalTransaction[]
[TransactionRepository] -->> [useTransactionStore] : Transaction[]

[useDashboardStore] -->> [DashboardView] : Updates reactive state (Total Balance)
[useTransactionStore] -->> [DashboardView] : Updates reactive state (Recent Activity)
```

### 3.2. Fluxo de Sincronização (Background)
```text
[SyncService] -> [Dexie] : Find records where synced == false
[Dexie] -->> [SyncService] : unsyncedRecords[]

LOOP unsyncedRecords:
  [SyncService] -> [Supabase] : upsert(record)
  [Supabase] -->> [SyncService] : Success(remoteRecord)
  [SyncService] -> [Dexie] : update(record, { synced: true, id: remoteRecord.id })
END LOOP
```

## 4. Lógica de Concorrência e Mitigação de Latência

### 4.1. Concorrência (Optimistic UI)
- Ao adicionar uma transação, o sistema deve atualizar o saldo da carteira na store Pinia **antes** da confirmação do Dexie.
- Se a escrita no Dexie falhar, a store deve ser revertida (Rollback).

### 4.2. Latência
- **Carregamento Offline:** O Dashboard deve sempre carregar dados do Dexie imediatamente.
- **Background Refresh:** Uma sincronização com o Supabase pode ocorrer silenciosamente após o carregamento local, atualizando a UI se novos dados forem encontrados.

## 5. Critérios de Aceitação (BDD)

**Cenário: Usuário abre o Dashboard**
- **Dado** que o usuário está autenticado.
- **Quando** o Dashboard é carregado.
- **Então** os cartões de Renda, Despesa e Saldo devem exibir dados reais do banco local.
- **E** a lista de "Atividade Recente" deve mostrar as últimas 25 transações ordenadas por data.

**Cenário: Acesso a Dados Offline**
- **Dado** que o usuário não possui conexão de internet.
- **Quando** visualizar o Dashboard.
- **Então** a aplicação deve carregar os dados do banco Dexie instantaneamente sem exibir erros de conexão.
