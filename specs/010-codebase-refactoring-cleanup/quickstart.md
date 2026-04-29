# Quickstart: Codebase Cleanup Verification

This guide outlines how to verify the refactoring and cleanup feature.

## Prerequisites

- Node.js and npm installed.
- Current feature branch `010-codebase-refactoring-cleanup` checked out.

## Verification Steps

### 1. Static Analysis (Dead Code)
Run `knip` to ensure no new dead code was introduced and that unreferenced artifacts were removed.
```bash
npx knip
```
**Expected**: No unused files or exports reported.

### 2. Complexity Audit
Run ESLint to check for complexity violations.
```bash
npx eslint src --rule 'complexity: ["error", 10]'
```
**Expected**: No "Complexity is too high" errors.

### 3. Functional Integrity
Run the full test suite to ensure the refactoring didn't break business logic.
```bash
npm test
```
**Expected**: 100% pass rate.

### 4. Code Density
Check the size of refactored files.
**Targets**:
- `src/shared/components/organisms/ITransactionFormContent.vue`: Should be significantly smaller.
- `src/modules/transactions/application/stores/transactionStore.ts`: Should be streamlined.
