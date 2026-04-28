# Interface Contracts: Dependency Injection

The project uses manual constructor-based dependency injection.

## DI Container Contract (`src/core/di.ts`)

```typescript
export interface IDIContainer {
  register<T>(token: string, implementation: T): void;
  resolve<T>(token: string): T;
}

export const DI_TOKENS = {
  IAuthService: 'IAuthService',
  ITransactionRepository: 'ITransactionRepository',
  // ... all interfaces listed here
} as const;
```

## Module Port Example (`src/modules/auth/core/ports/IAuthService.ts`)

```typescript
export interface IAuthService {
  login(credentials: Credentials): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
}
```

## Adapter Implementation Example (`src/modules/auth/adapters/SupabaseAuthService.ts`)

```typescript
import { IAuthService } from '../core/ports/IAuthService';

export class SupabaseAuthService implements IAuthService {
  constructor(private supabaseClient: any) {}
  
  async login(credentials: Credentials): Promise<User> {
    // implementation using supabaseClient
  }
  // ...
}
```
