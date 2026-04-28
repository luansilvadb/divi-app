# Quickstart: Restoring Stability

## Environment Setup
1. Ensure Node.js >= 22.12.
2. Run `npm install` to ensure all dependencies (Vite 7, Vitest 3) are present.

## Restoration Workflow
1. **Fix Build Errors**:
   - Align `VaultTransactionRepository` with the standardized `ITransactionRepository` interface.
   - Update `vitest.config.ts` to resolve type overloads.
   - Implement `bigint-adapter` in `shared/utils`.
2. **Fix Dashboard Store**:
   - Rename `initializationError` to `hasInitializationError` in usage sites.
3. **Stabilize Tests**:
   - Create test factories in `src/__tests__/factories`.
   - Update existing tests to use factories instead of manual mocks.
   - Run `npm run test:unit` to verify.

## Verification
- `npm run build` MUST complete without errors.
- `npm run type-check` MUST report 0 errors.
