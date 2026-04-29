# Feature Specification: fix-naive-ui-type-error

**Feature Branch**: `012-fix-naive-ui-type-error`  
**Created**: 2026-04-29  
**Status**: Draft  
**Input**: User description: "Fix build error: Module 'naive-ui/lib/message/src/types' has no exported member 'MessageApiInjection'"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Resolve Build Failure (Priority: P1)

As a developer, I want the application to build successfully in production environments so that I can deploy updates.

**Why this priority**: Blocking error that prevents production builds and CI/CD pipelines.

**Independent Test**: Running `npm run build` or `vue-tsc --build` completes without TypeScript errors in `useTransactionForm.ts`.

**Acceptance Scenarios**:

1. **Given** the current codebase with the missing export error, **When** I run `npm run build`, **Then** the build fails with TS2305.
2. **Given** the fix is applied, **When** I run `npm run build`, **Then** the build completes successfully.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST use correct exported types from `naive-ui` for the message API.
- **FR-002**: The `useTransactionForm` composable MUST correctly type its `message` parameter using `MessageApi` instead of `MessageApiInjection`.
- **FR-003**: The import path MUST be updated to avoid internal library paths that may change between versions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero TypeScript errors related to `MessageApiInjection` in the codebase.
- **SC-002**: Production build (`npm run build`) exits with code 0.

## Assumptions

- The version of `naive-ui` installed is `^2.44.1`.
- `MessageApi` is the correct public type for the message instance in this version.

## Out of Scope *(mandatory)*

- Refactoring other components not affected by this specific build error.
- Updating `naive-ui` to a newer version unless necessary for the fix.
