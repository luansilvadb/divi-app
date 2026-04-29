# Research: fix-naive-ui-type-error

## Decision: Use `MessageApi` from `naive-ui`

**Rationale**: 
The error `Module '"naive-ui/lib/message/src/types"' has no exported member 'MessageApiInjection'` indicates that the internal type `MessageApiInjection` was either removed, moved, or renamed in the version of Naive UI currently being used. 

Directly importing from `lib/` or `src/` inside a library's `node_modules` is brittle and discouraged because internal structures change frequently. The root package export `MessageApi` is the public, stable interface intended for consumers of the library.

**Alternatives considered**:
1. **Searching for `MessageApiInjection` in other internal paths**: Rejected as it remains brittle and violates best practices for library consumption.
2. **Using `any`**: Rejected per project standards for type safety.
3. **Using `ReturnType<typeof useMessage>`**: Possible, but `MessageApi` is the explicit type provided by the library for this purpose.

## Findings

- `naive-ui` version 2.44.1 exports `MessageApi` from the main entry point.
- `useMessage()` returns an object compatible with `MessageApi`.
- Updating the import to `import { MessageApi } from 'naive-ui'` resolves the compilation error while maintaining full type safety for `.success()`, `.error()`, etc.
