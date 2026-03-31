# Contracts: Refatoração do Módulo Finance para Fatiamento Vertical

Este documento descreve os contratos (interfaces) que definem a interação entre os submódulos de finanças e a infraestrutura global.

## 1. Contratos de Repositório (Domain/Infrastructure)

Cada submódulo deve expor interfaces de repositório em seu respectivo diretório `domain/contracts/` (ou `domain/repositories/` conforme o padrão atual).

### Exemplo: `src/modules/finance/transactions/domain/repositories/ITransactionRepository.ts`
```typescript
export interface ITransactionRepository {
  findAll(): Promise<Transaction[]>
  findById(id: string): Promise<Transaction | null>
  create(transaction: Transaction): Promise<void>
  update(transaction: Transaction): Promise<void>
  delete(id: string): Promise<void>
}
```

## 2. Contratos de Serviço (Application/Services)

Interfaces para comunicação cross-módulo.

### Exemplo: `src/modules/finance/transactions/application/services/ITransactionService.ts`
```typescript
export interface ITransactionService {
  getRecentTransactions(limit: number): Promise<Transaction[]>
  getTotalBalanceByWallet(walletId: string): Promise<number>
}
```

## 3. Registro no DI (Core)

Todos os contratos devem ser registrados no contêiner global (`src/core/di.ts`) usando tokens de string ou classes de interface para permitir a resolução em qualquer camada.

### Exemplo de Registro:
```typescript
container.register('ITransactionRepository', new DexieSupabaseTransactionRepository())
container.register('ITransactionService', new TransactionService())
```

## 4. Comunicação entre Módulos

Quando um módulo (ex: `dashboard`) precisa de dados de outro (ex: `transactions`), ele DEVE:
1. Declarar a dependência do contrato (ex: `ITransactionService`) em seu construtor ou via `useService`.
2. O contêiner de DI provê a implementação concreta registrada no `src/core/di.ts`.
3. O `dashboard` chama os métodos do contrato sem conhecer detalhes de persistência ou lógica interna do módulo `transactions`.
