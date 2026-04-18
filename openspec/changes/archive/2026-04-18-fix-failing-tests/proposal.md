## Why

The codebase currently has 32 failing tests across 17 test files out of 393 total tests. These failures block CI/CD pipelines, reduce developer confidence, and mask potential regressions. The failing tests span multiple categories:

- **PWA Configuration**: Missing virtual module resolution for `virtual:pwa-register/vue`
- **Vue Component Tests**: Empty VueWrapper errors indicating missing component stubs and mount configuration issues
- **Style Assertions**: Tests expecting hex color formats (`#ff000015`) but receiving rgba formats
- **Service Integration**: Auth persistence, transaction saving, and ledger transfer failures
- **View Component Assertions**: Empty state text mismatches and missing aria attributes

Fixing these tests restores the safety net that enables confident refactoring and ensures the TDD workflow functions properly.

## What Changes

### PWA Test Infrastructure
- Configure Vitest to resolve `virtual:pwa-register/vue` imports using `vitest-plugin-pwa` or manual mocking
- Ensure `App.spec.ts` can mount the root component without import errors

### Vue Component Test Fixes
- Add missing stubs for `NButton`, `NSkeleton`, `NProgress`, `NInput`, `NSelect` naive-ui components
- Fix `BaseInput.spec.ts`, `BaseSelect.spec.ts`, `BaseSearchInput.spec.ts` mount configurations
- Resolve `BaseCard.spec.ts` error/loading state and keyboard event emit assertions
- Fix `BaseIconBox.spec.ts` color format expectations (rgba vs hex)
- Fix `BaseProgressBar.spec.ts` NProgress stub assertion

### Service Integration Fixes
- Fix `AuthPersistence.spec.ts`: Mock `syncEngine.trigger()` properly
- Fix `budgetsIntegration.spec.ts`: Resolve Dexie transaction repository failures
- Fix `TransactionService.spec.ts`: Ensure unauthenticated user rejection works correctly
- Fix `VaultTransactionRepository.spec.ts`: Mock Dexie `transaction()` callback properly
- Fix `LedgerTransactionService.spec.ts`: Correct import/constructor issues

### View Component Fixes
- Fix `LoginView.spec.ts`: Add `aria-hidden` to SVG and spinner elements
- Fix `LoginViewToast.spec.ts`: Ensure success messages are displayed via message service
- Fix `BudgetsView.spec.ts`: Update empty state text assertion to match actual component text
- Fix `DashboardView.spec.ts`: Update empty state and error banner text assertions
- Fix `BudgetCard.spec.ts`: Update budget value format expectations

## Capabilities

### New Capabilities
- `test-infrastructure-pwa`: Configure PWA virtual module resolution for Vitest

### Modified Capabilities
- `component-test-stubs`: Update Vue component tests with proper naive-ui stubs and assertions
- `service-integration-tests`: Fix auth, budget, and transaction service test mocks and assertions
- `view-component-assertions`: Update view test expectations to match actual component behavior

## Impact

**Test Files**: 17 test files will be modified to fix 32 failing tests
**Configuration**: `vitest.config.ts` may need plugin updates for PWA resolution
**Dependencies**: No new dependencies required - using existing testing utilities
**CI/CD**: Restores green test suite enabling reliable automated checks
