# ESPECIFICAÇÃO TÉCNICA EXAUSTIVA - v0.3.0
**Módulo:** Identidade e o Cordão Umbilical (Epic 2)
**Autor:** Mente Brilhante Ω

## 1. VISÃO GERAL E ARQUITETURA
O objetivo desta especificação é definir a integração de identidade e autenticação (Supabase) e estabelecer a fundação para a sincronização em background dos dados locais (Dexie) com o servidor. A estrutura de sincronização garante que a experiência continue 100% "Offline is the New Online".

### Paradigma: Sincronização Assíncrona
Toda leitura e escrita continua focada no Dexie.js (IndexedDB). O Sync Engine atuará de forma totalmente assíncrona, desvinculada das interações da UI.

---

## 2. IDENTIDADE E AUTENTICAÇÃO (Supabase)

### 2.1 Contratos de Domínio
A autenticação deve abstrair a infraestrutura usando interfaces claras.

```typescript
// Localização: src/modules/auth/domain/entities/User.ts
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

// Localização: src/modules/auth/domain/contracts/IAuthService.ts
import { User } from '../entities/User';

export interface IAuthService {
  getCurrentUser(): Promise<User | null>;
  signIn(email: string, password?: string): Promise<User>;
  signUp(email: string, password?: string): Promise<User>;
  signOut(): Promise<void>;
  onAuthStateChange(callback: (user: User | null) => void): void;
}
```

### 2.2 Infraestrutura e Adapters
- Implementar o `SupabaseAuthService` em `src/modules/auth/infrastructure/SupabaseAuthService.ts` implementando a `IAuthService`.
- Utilizar o SDK `@supabase/supabase-js`. As chaves de acesso devem ser buscadas de variáveis de ambiente do Vite (`import.meta.env`).

---

## 3. MOTOR DE SINCRONIZAÇÃO (Sync Engine)

### 3.1 Arquitetura do Sync
O Sync Engine será um job de background ou worker (via setInterval ou Service Worker no futuro, para agora um processo no store/application principal rodando a cada N segundos se online).

```typescript
// Localização: src/modules/sync/application/SyncEngine.ts
export interface ISyncEngine {
  start(): void;
  stop(): void;
  syncPendingTransactions(): Promise<void>;
}
```

### 3.2 Diagrama de Sequência Textual:
1. Usuário cria uma Transação (Offline/Online não importa).
2. `TransactionRepository` salva no Dexie. Status = `pending`.
3. UI atualiza instantaneamente a partir do Dexie.
4. O `SyncEngine` desperta (por evento "online" ou timer de loop).
5. `SyncEngine` lê Dexie procurando Transações com `syncStatus === 'pending'`.
6. `SyncEngine` tenta enviar as transações via chamada ao backend/Supabase.
7. Se Sucesso (200 OK): `SyncEngine` atualiza o Dexie definindo `syncStatus = 'synced'`.
8. Se Falha de Rede: Ignora e tenta de novo no próximo ciclo.
9. Se Falha de Conflito/Erro Servidor (400/500): Status muda para `failed` para análise manual ou fallback.

### 3.3 Concorrência e Regras de Borda (Edge Cases)
- **Locking Básico:** O Sync Engine não deve tentar sincronizar se um loop anterior ainda está rodando. Usar uma flag de lock (ex: `isSyncing = true/false`).
- **Idempotência no Servidor:** O backend Supabase usará o `uuid` gerado localmente (criado na Epic 1) como chave primária de conflito. Inserções duplas pelo Sync Engine em caso de timeouts devem ser ignoradas pelo servidor (usar `ON CONFLICT (uuid) DO NOTHING` ou similar no Supabase, mapeado via upsert na API).

---

## 4. UI LAYER (Login e Estado de Rede)

### 4.1 BDD (Acceptance Criteria)

**Cenário: O usuário faz login e acessa o sistema**
- DADO QUE o usuário não está autenticado e o token local está vazio
- QUANDO ele abre a aplicação
- ENTÃO a aplicação redireciona para a view de Login
- QUANDO o usuário insere credenciais válidas e clica em Entrar
- ENTÃO a sessão é salva via Supabase SDK
- E a aplicação redireciona de volta para o Dashboard.

**Cenário: Sincronização invisível de transações pendentes**
- DADO QUE o usuário está online
- E possui 2 transações com `syncStatus` 'pending' no Dexie
- QUANDO o Sync Engine for acionado
- ENTÃO as transações devem ser enviadas ao servidor
- E o Dexie deve registrar ambas as transações com `syncStatus` 'synced'.
