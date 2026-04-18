## Context

The codebase has 32 failing tests across multiple categories. These failures stem from:

1. **PWA Virtual Module**: Vitest cannot resolve `virtual:pwa-register/vue` used by `PWAUpdatePrompt.vue` when `App.spec.ts` imports the root App component
2. **Vue Test Utils Configuration**: Component tests lack proper stubs for naive-ui components, causing "empty VueWrapper" errors
3. **Style Format Mismatch**: Tests expect hex color formats but components now output rgba formats (likely due to library updates)
4. **Service Mock Issues**: Auth persistence, transaction, and ledger tests have incomplete or incorrect mocks for dependencies like `syncEngine` and Dexie transactions
5. **Component Behavior Changes**: View components have updated text content that tests don't reflect

The project uses Vitest with `@vue/test-utils`, naive-ui component library, and Dexie for IndexedDB operations.

## Goals / Non-Goals

**Goals:**
- Restore all 32 failing tests to passing status
- Configure Vitest to handle PWA virtual modules
- Fix Vue component test stubs and assertions
- Update service test mocks to properly simulate dependencies
- Align view component test assertions with actual rendered content
- Maintain existing test coverage levels

**Non-Goals:**
- Refactoring production code (only test fixes)
- Adding new test coverage
- Changing component behavior in production
- Upgrading testing dependencies

## Decisions

### Decision: Use Manual Mock for PWA Virtual Module
**Rationale**: `vitest-plugin-pwa` adds complexity. A simple `vitest.config.ts` alias to a mock file is cleaner for this use case.
**Alternative Considered**: Adding `vitest-plugin-pwa` - rejected to avoid new dependency for a single import.

### Decision: Add Global Stubs in vitest.setup.ts
**Rationale**: Many tests need the same naive-ui component stubs (`NButton`, `NSkeleton`, `NProgress`, etc.). Adding to global config reduces repetition.
**Implementation**: Extend existing `config.global.stubs` in `vitest.setup.ts`.

### Decision: Update Color Format Assertions
**Rationale**: The tests expect hex (`#ff000015`) but receive rgba (`rgba(255, 0, 0, 0.082)`). The rgba format is valid and comes from the design system. Tests should match actual output.
**Alternative Considered**: Changing component to output hex - rejected as it would be a production code change.

### Decision: Mock syncEngine as Object with trigger Method
**Rationale**: `AuthPersistence.spec.ts` fails because `syncEngine.trigger()` is undefined. Create a proper mock object instead of a stub.

### Decision: Fix Dexie Transaction Mock Pattern
**Rationale**: `VaultTransactionRepository.spec.ts` fails because `db.transaction()` callback is not a function. Need to mock Dexie's transaction API properly with a callback that receives a transaction object.

### Decision: Update Text Assertions to Match Components
**Rationale**: Tests for `BudgetsView`, `DashboardView` check for text that doesn't exist. The components show different empty state messages. Tests should verify actual rendered content.

## Risks / Trade-offs

**Risk**: Some tests may have been testing incorrect behavior that became "correct" through drift.
→ **Mitigation**: Verify each fix against the actual component/service implementation to ensure tests are validating intended behavior.

**Risk**: Global stubs may hide actual integration issues.
→ **Mitigation**: Keep global stubs minimal; use local stubs for component-specific behavior testing. E2E tests will catch real integration issues.

**Risk**: Color format changes may indicate a design system regression.
→ **Mitigation**: Verify with `design-system` skill that rgba output is expected. If hex was intentional, flag for separate fix.

**Risk**: Mocking `syncEngine` may miss real sync issues.
→ **Mitigation**: Auth persistence test is about store/service interaction, not sync engine functionality. Sync engine has its own test suite.

## Migration Plan

Not applicable - this is a test-only change with no production deployment impact. Changes are:
1. Merge test fixes
2. Verify CI test suite passes
3. Developers rebase ongoing work to get green tests

## Open Questions

None - all test failures have clear root causes identified in the error output.
