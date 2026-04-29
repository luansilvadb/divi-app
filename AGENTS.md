<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:
specs/010-codebase-refactoring-cleanup/plan.md
<!-- SPECKIT END -->

## Established Project Patterns

### 1. Centralized Error Handling (Principle XII)
- Use `@/core/errors` as the SSOT for all domain, infrastructure, and validation exceptions.
- All custom errors MUST extend `DomainError`.

### 2. Message Catalog (Principle X)
- All user-facing strings MUST be defined in `@/shared/messages/catalog.ts`.
- Use `messages.MSG_CODE` in components.

### 3. Local Storage Types
- Private storage interfaces (only used by `VaultDatabase`) should reside in `@/infrastructure/storage/types/internal.ts`.
- Only shared/transitional types should be exported via `@/infrastructure/storage/types/index.ts`.

### 4. Composables for Complex Logic
- Extract theme mapping and form validation to dedicated composables (e.g., `useChartTheme`, `useWalletValidation`).
- Maintain unit test parity for all extracted logic.
