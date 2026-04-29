# Research Report: Codebase Refactoring and Cleanup

## Decision: Refactoring and Cleanup Strategy

### What was chosen
1.  **Complexity Analysis**: Use `eslint-plugin-sonarjs` (via `oxlint` and `eslint`) to identify functions with cognitive and cyclomatic complexity > 10.
2.  **Composable Extraction**: Extract complex UI logic from `ITransactionFormContent.vue` into `useTransactionForm.ts`.
3.  **Store Decoupling**: Refactor `transactionStore.ts` to remove direct delegation to wallets/categories, following a stricter Port/Adapter pattern where the store only handles its primary entity.
4.  **Dead Code Removal**: Manual removal of unreferenced "any" types, redundant comments, and old boilerplate found during the refactoring process (as `knip` reported the current structure as clean).

### Rationale
-   **Maintainability**: Large components like `ITransactionFormContent.vue` (400+ lines) are hard to test and maintain.
-   **SRP (Single Responsibility Principle)**: The transaction store currently handles too many concerns (stats, search, grouping, wallet/category delegation).
-   **Performance**: Reducing cognitive complexity makes the code faster to parse for developers and potentially more efficient for the runtime.

### Alternatives considered
-   **Automated Refactoring with ts-morph**: Evaluated but rejected for the initial phase as the refactorings required (like extracting composables) are too contextual for reliable automation without extensive custom scripts. Manual refactoring with LLM assistance is safer.
-   **Strict Knip enforcement**: `knip` is already configured and shows the project is mostly clean of traditional "dead code" (unused files/exports), so the focus must shift to "logic rot" and complexity.

## Key Targets Identified

1.  **ITransactionFormContent.vue**: ~440 lines. Mixes form state, UI masking, and business logic.
2.  **transactionStore.ts**: ~260 lines. Mixes transaction persistence with wallet/category management and complex stats computation.
3.  **bigint-adapter.ts**: Contains commented-out pseudo-TODOs that should be finalized or removed.

## Success Metrics for Refactoring
-   `ITransactionFormContent.vue` script section reduced by 50% (delegated to composables).
-   `transactionStore.ts` reduced by 30% (removing delegations).
-   ESLint `complexity` warnings reduced to zero.
