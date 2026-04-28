# Data Model

Since this is an architectural refactoring, the primary "data" being modeled is the Centralized Message Catalog.

## Message Catalog

The Message Catalog is a static dictionary structure.

### Types

```typescript
type MessageCategory = 'MSG_E' | 'MSG_S' | 'MSG_A' | 'MSG_I';

interface IMessageCatalog {
  [code: string]: string;
}
```

### Constraints
- Every key must begin with one of the standard categories (`MSG_E`, `MSG_S`, `MSG_A`, `MSG_I`), followed by a descriptive identifier (e.g., `MSG_E_USER_NOT_FOUND`).
- The values are string literals. If parameters are needed, they use the `{parameterName}` syntax.

## Module Structure

Though not a data model in the traditional sense, the refactored module structure acts as the organizational "schema" for the codebase:

```text
src/modules/[ModuleName]/
├── core/
│   ├── entities/
│   └── useCases/
├── ports/
│   └── I[ServiceName].ts
└── adapters/
    └── [ServiceName]Adapter.ts
```
