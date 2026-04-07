# ESPECIFICAÇÃO TÉCNICA EXAUSTIVA - v0.2.0
**Módulo:** A Fundação e o Núcleo Local-First (Epic 1)
**Autor:** Mente Brilhante Ω

## 1. VISÃO GERAL E ARQUITETURA
O objetivo desta especificação é definir a infraestrutura para a persistência local de dados e a arquitetura inicial da camada de aplicação do projeto **divi**. Tudo deve ser implementado seguindo o padrão Module-Based Clean Architecture.

### Paradigma: Local-First e Reatividade
Toda leitura e escrita ocorrerá primariamente no Dexie.js (IndexedDB). O estado global no Vue/Pinia será atualizado de forma reativa a partir das mudanças neste banco local.

---

## 2. INFRAESTRUTURA DE DADOS (Dexie.js)

### 2.1 Esquema de Banco (Database Schema)
O banco de dados do Dexie deve ser configurado como `DiviDatabase`.
Abaixo estão os esquemas imutáveis que o Tech Lead deve implementar.

```typescript
// Localização Recomendada: src/infrastructure/db/DexieDB.ts

import Dexie, { Table } from 'dexie';

export interface TransactionEntity {
  id?: number; // Auto-increment para a chave primária local
  uuid: string; // Identificador universal único (necessário para sync futuro)
  amount: number;
  type: 'income' | 'expense';
  categoryId?: string;
  description: string;
  date: Date; // Armazenado como timestamp ou date object dependendo da config
  createdAt: Date;
  updatedAt: Date;
  syncStatus: 'pending' | 'synced' | 'failed'; // Crucial para o Epic 2
}

export class DiviDatabase extends Dexie {
  transactions!: Table<TransactionEntity, number>;

  constructor() {
    super('DiviLocalDB');
    this.version(1).stores({
      // Índices: id principal, indices por uuid, date, type e syncStatus para buscas rápidas
      transactions: '++id, &uuid, date, type, syncStatus'
    });
  }
}

export const db = new DiviDatabase();
```

---

## 3. DOMAIN & APPLICATION LAYER CONTRATOS

### 3.1 Entidades de Domínio
A interface de domínio abstrata para `Transaction` não deve conhecer o Dexie ou campos de sync (`id`, `syncStatus`). Deve focar no negócio.

```typescript
// Localização: src/modules/transactions/domain/Transaction.ts
export interface Transaction {
  uuid: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId?: string;
  description: string;
  date: Date;
}
```

### 3.2 Repositório Interface (Ports)
```typescript
// Localização: src/modules/transactions/application/TransactionRepositoryPort.ts
import { Transaction } from '../domain/Transaction';

export interface TransactionRepositoryPort {
  save(transaction: Transaction): Promise<void>;
  getAll(): Promise<Transaction[]>;
  // Métodos adicionais podem vir nos próximos épicos
}
```

### 3.3 Repositório Implementação (Adapters)
O `DexieTransactionRepository` deverá implementar a porta acima e traduzir do domínio para a entidade Dexie (inserindo `createdAt`, `updatedAt`, e `syncStatus: 'pending'`).

---

## 4. UI LAYER (Dashboard Inicial)

### 4.1 Requisitos BDD (Acceptance Criteria)

**Cenário: O usuário acessa a tela inicial vazia**
- DADO QUE o banco de dados local está limpo
- QUANDO o usuário abre a aplicação no caminho `/`
- ENTÃO a tela deve carregar em menos de 100ms
- E exibir uma mensagem amigável: "Nenhuma transação registrada. Que tal começar?"

**Cenário: O usuário registra a primeira transação (Simulada)**
- DADO QUE a aplicação está carregada
- E o usuário injeta programaticamente uma transação no Dexie
- QUANDO o Dexie notifica a mudança via reatividade (ex: useObservable)
- ENTÃO a View deve ser atualizada instantaneamente, refletindo a nova transação no resumo.

### 4.2 Restrições de Concorrência e Latência
- As consultas ao Dexie não devem bloquear a thread principal; use Promises ou hooks reativos apropriados (como `@vueuse/core` ou integrações providas pelo Dexie `liveQuery`).
- Erros de inicialização do IndexedDB em modo incógnito rigoroso (em alguns navegadores) devem ser capturados de forma transparente e retornar um alerta sistêmico amigável.
