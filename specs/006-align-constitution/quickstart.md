# Quickstart: Architectural Alignment

This guide explains how to approach the codebase after the Constitution Alignment refactoring.

## 1. Finding Business Logic
All pure business rules and use cases are now located strictly in `src/modules/[module]/core/`.
These files have **zero** external dependencies. They contain the "what" and "why" of the application.

## 2. Dealing with External Services (Ports & Adapters)
If a core use case needs to interact with the outside world (Database, API, Local Storage):
1. Look in `src/modules/[module]/ports/` for the `I`-prefixed interface (e.g., `IUserRepository.ts`).
2. The core logic depends **only** on this interface.
3. The concrete implementation (e.g., Supabase or Dexie) is found in `src/modules/[module]/adapters/`.
4. Adapters are injected at runtime (via Vue's `provide/inject` in `main.ts` or passed directly to stores/use cases).

## 3. Working with Messages
Never hardcode strings for the user in the UI components or business logic!
Instead, import the message catalog and use the appropriate code:

```typescript
import { messages, formatMessage } from '@/shared/messages/catalog';

// For static messages
const error = messages.MSG_E_USER_NOT_FOUND;

// For dynamic messages
const validationError = formatMessage('MSG_E_FIELD_REQUIRED', { field: 'Email' });
```

## 4. Avoiding Dead Code
The project strictly prohibits dead code. Do not comment out old code to save it. If it is no longer used, delete it. Version control (Git) is your backup. Before committing, run the static analysis tool (e.g., `npm run lint:all` or `ts-prune`) to ensure no unused files/exports remain.
