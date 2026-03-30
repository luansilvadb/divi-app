# Arquitetura Divi Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-29

## Active Technologies
- Vue 3 (Composition API), TypeScript (Strict Mode) + Pinia, Vite (002-refactor-color-palette)
- Supabase (SDK / RPC) (002-refactor-color-palette)
- Vue 3 (Composition API), TypeScript (Strict Mode) + Tailwindcss, Vite (002-refactor-color-palette)
- LocalStorage (Persistência de preferência de tema) (002-refactor-color-palette)

- Vue 3 (Composition API)
- TypeScript (Strict Mode)
- Pinia (State Management)
- Supabase (Backend-as-a-Service)
- Vite (Build Tool)

## Project Structure (Vertical Slicing)

```text
src/
├── core/                # Infra global (DI, router, base configs)
├── shared/              # Atomic Design (átomos, moléculas, organismos)
└── modules/
    └── [feature]/       # Camadas estritas da feature
        ├── domain/      # Entidades e Interfaces do Repositório (Contratos)
        ├── application/ # Stores (Pinia) e Casos de Uso
        ├── infrastructure/ # Implementação concreta do Repositório (Supabase SDK)
        └── ui/          # Componentes e views específicos da feature
```

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run test suite
- `npm run lint` - Run linter

## Code Style

- **Clean Architecture**: Contratos em `domain/`, lógica em `application/`, acesso a dados em `infrastructure/`.
- **Vertical Slicing**: Mantenha tudo relacionado a uma feature dentro de `src/modules/[feature]/`.
- **DI**: Utilize Injeção de Dependência para conectar camadas. Não instancie classes concretas de infraestrutura diretamente em stores ou componentes.
- **Naming**: Use nomes declarativos para entidades e contratos. Suffixe interfaces de repositório com `Repository`.
- **Atomic Design**: Componentes em `src/shared/` devem ser puramente visuais e genéricos.

## Recent Changes
- 002-refactor-color-palette: Added Vue 3 (Composition API), TypeScript (Strict Mode) + Tailwindcss, Vite
- 002-refactor-color-palette: Added Vue 3 (Composition API), TypeScript (Strict Mode) + Pinia, Vite

- **Initial Architecture Setup**: Divi Constitution v1.0.0 established with Vertical Slicing and Clean Architecture principles.

<!-- MANUAL ADDITIONS START -->
## Design System & Themes

### Color Tokens (Tailwind & CSS Variables)
A aplicação utiliza um sistema de temas baseado em variáveis CSS injetadas no Tailwind CSS.

- **Brand Tokens**: `primary-main` (Navy), `secondary-main` (Emerald), `accent-main` (Gold).
- **Neutral Tokens**: `bg-main`, `surface-main`, `border-main`.
- **Text Tokens**: `text-primary`, `text-secondary`, `text-disabled`.
- **Semantic Tokens**: `success-main`, `error-main`, `warning-main`, `info-main`.

### Usage
Sempre utilize classes do Tailwind para cores:
- `<div class="bg-bg-main text-text-primary">`
- `<button class="bg-primary-main hover:opacity-90">`

### Theme Toggling
O tema é controlado pela classe `.dark` no elemento `<html>`.
Utilize o hook `useTheme()` de `src/core/theme` para gerenciar o estado programaticamente.
<!-- MANUAL ADDITIONS END -->
