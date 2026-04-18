## ADDED Requirements

### Requirement: Test files follow co-location pattern
Test files SHALL be co-located with source code following consistent naming and directory conventions.

#### Scenario: Module tests are in __tests__ directory
- **WHEN** examining any module directory
- **THEN** a `__tests__/` subdirectory SHALL exist containing module-specific tests

#### Scenario: Test files use .spec.ts extension
- **WHEN** examining test files
- **THEN** all test files SHALL use the `.spec.ts` extension

#### Scenario: Test directories mirror source structure
- **WHEN** examining a module's __tests__ directory
- **THEN** subdirectories SHALL mirror the structure: unit/, integration/, ui/components/, ui/views/

### Requirement: Global test utilities are centralized
Shared test utilities, mocks, and setup SHALL be centralized in src/__tests__/.

#### Scenario: Global mocks directory exists
- **WHEN** examining src/__tests__/
- **THEN** a `mocks/` subdirectory SHALL exist with reusable mocks

#### Scenario: Global test setup file exists
- **WHEN** examining src/__tests__/
- **THEN** a setup file (setup.ts) SHALL configure global test utilities

#### Scenario: Factory functions for test data
- **WHEN** examining src/__tests__/mocks/
- **THEN** factory functions SHALL exist for creating common test entities
