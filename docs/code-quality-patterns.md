# Code Quality Patterns

This document outlines the code quality patterns established during the code-quality-cleanup refactoring.

## Error Handling

### AppError Class Hierarchy

All errors should use the standardized `AppError` class or its subclasses:

```typescript
import { AppError, ValidationError, NotFoundError, AuthError, ApiError } from '@/core/errors'

// Base error
throw new AppError('Something went wrong', 'CUSTOM_CODE', 500, true)

// Specific error types
throw new ValidationError('Invalid email format')
throw new NotFoundError('User')
throw new AuthError('Session expired')
throw new ApiError('Network failure', 503)
```

### API Error Handling

Use the `withErrorHandling` helper for async operations:

```typescript
import { withErrorHandling } from '@/shared/utils/api-helpers'

const result = await withErrorHandling(
  () => fetchUserData(userId),
  'Failed to load user data'
)

if (!result.success) {
  // result.error contains user-friendly message
  // result.code contains error code
}
```

## Naming Conventions

### Boolean Variables

Use descriptive prefixes: `is`, `has`, `can`, `should`

```typescript
// Good
const isLoading = ref(false)
const hasPermission = computed(() => ...)
const canDelete = ref(true)

// Bad
const loading = ref(false)  // Ambiguous
const flag = ref(false)   // Unclear purpose
```

### Functions

Use verb-noun pattern:

```typescript
// Good
function fetchUserData() { }
function calculateTotal() { }
function validateEmail() { }
function handleSubmit() { }

// Bad
function user() { }  // Noun only
function data() { }   // Noun only
```

### Interfaces

Use PascalCase without `I` prefix:

```typescript
// Good
interface UserRepository { }
interface TransactionService { }

// Bad
interface IUserRepository { }  // I prefix not needed
interface ITransactionService { }
```

## Shared Utilities

### Validators

```typescript
import { isNonEmptyString, isValidEmail, isPositiveNumber } from '@/shared/utils/validators'

if (isNonEmptyString(name)) { }
if (isValidEmail(email)) { }
```

### Parsers

```typescript
import { safeJsonParse, parseDate, parseNumber } from '@/shared/utils/parsers'

const data = safeJsonParse(jsonString, defaultValue)
const date = parseDate(dateString)
const num = parseNumber(input)
```

### Formatters

```typescript
import { formatCurrency, formatDate } from '@/shared/utils/formatters'

const price = formatCurrency(10000n)  // R$ 100,00
const date = formatDate('2024-01-15') // 15/01/2024
```

## Error Component

Use the standardized `ErrorMessage` component:

```vue
<template>
  <ErrorMessage
    :error="error"
    :retryable="true"
    @retry="loadData"
  />
</template>

<script setup>
import ErrorMessage from '@/shared/components/ErrorMessage.vue'
</script>
```

## Code Style Guidelines

1. **Early Returns**: Prefer early returns over nested conditionals
2. **Immutability**: Use spread operator for state updates
3. **Type Safety**: Avoid `any`, use proper TypeScript types
4. **Dead Code**: Remove unused imports, variables, and functions
5. **Magic Numbers**: Extract to named constants

## Testing

All shared utilities must have comprehensive tests:

```typescript
// src/shared/utils/__tests__/validators.spec.ts
import { describe, it, expect } from 'vitest'
import { isNonEmptyString } from '../validators'

describe('validators', () => {
  it('should validate non-empty strings', () => {
    expect(isNonEmptyString('hello')).toBe(true)
    expect(isNonEmptyString('')).toBe(false)
  })
})
```
