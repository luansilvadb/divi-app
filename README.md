# divi

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
# Run tests once
npm run test:unit

# Run tests with coverage
npm run test:unit -- --coverage

# Run tests in watch mode during development
npm run test:unit -- --watch
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Development Guidelines

### Architecture Standards

This project follows strict **Hexagonal Architecture** (Core/Ports/Adapters) and **Interface-First** design principles.

1.  **Module Structure**: Every feature module under `src/modules/` must follow this structure:
    -   `core/entities/`: Domain entities and interfaces.
    -   `core/ports/`: Port interfaces (prefixed with `I`) that define what the module needs or provides.
    -   `application/services/`: Core business logic (Services) that implements or uses ports.
    -   `application/stores/`: State management (Pinia).
    -   `adapters/`: Concrete implementations of ports (e.g., Supabase, Dexie).
    -   `ui/views/` & `ui/components/`: Framework-specific UI code.

2.  **Interface-First Design (Principle VI)**:
    -   All cross-boundary dependencies MUST use interfaces.
    -   Interfaces MUST be prefixed with `I` (e.g., `IAuthService`, `ITransaction`).
    -   Concrete classes must never be imported directly from other modules.

3.  **Architecture & Fail Fast (Principles VIII, XVII)**:
    -   Strict Hexagonal separation.
    -   System MUST fail fast on invalid configuration or unresolvable dependencies at startup.
    -   Use the manual DI container in `src/core/di.ts` to register and resolve services.
    -   Use `container.resolve(DI_TOKENS.IService)` in classes and the `useService` composable in Vue components.

4.  **Backward Compatibility (Principle XVIII)**:
    -   Changes to public contracts or schemas MUST be backward compatible.
    -   "Expand before contract" approach for all destructive changes.
    -   Rollbacks MUST be safe and non-destructive.

### Monetary Values (BigInt)

All monetary operations and values in this application must use `BigInt` to prevent floating-point precision errors. We use a centralized `bigint-adapter` to parse and format these values. 

- **Always** import and use `parseDecimalToBigInt` when receiving user input (e.g. from UI forms).
- **Always** import and use `formatBigIntToDecimal` when formatting internal `BigInt` amounts for display.
- Ensure all repository implementations properly serialize/deserialize `BigInt` values if the underlying storage does not support them natively.
