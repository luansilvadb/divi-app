# Quickstart: Codebase Refactoring and Cleanup

This document provides the workflow for executing the codebase cleanup tasks safely.

## 1. Setup

Ensure your local environment is up-to-date and all dependencies are installed:

```bash
npm install
```

## 2. Identify Dead Code

Run Knip to find unused files, dependencies, and exports:

```bash
npx knip
```
*Note: Carefully review the output. Knip may flag dynamically imported files or Vue components used in dynamic `<component :is="...">` tags.*

## 3. Identify High Complexity

Temporarily add or adjust the complexity rule in `.eslintrc.cjs` (or `eslint.config.js`) to target complex functions:

```javascript
rules: {
  'complexity': ['warn', 10]
}
```

Then run ESLint:

```bash
npm run lint
```

## 4. Refactoring Loop

For each identified issue (dead code or high complexity):

1. **Delete or Refactor**: Make the localized change.
2. **Type Check**: `npm run build:typecheck`
3. **Unit Test**: `npm run test`
4. **Commit**: Keep commits small and atomic (e.g., `refactor: remove unused variables in Auth module`).

## 5. Final Verification

Before concluding the cleanup feature, ensure the build pipeline runs flawlessly:

```bash
npm run build:typecheck
npm run test
npm run lint
```
