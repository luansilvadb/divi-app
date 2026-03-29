# Arquitetura Divi Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-29

## Active Technologies

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

- **Initial Architecture Setup**: Divi Constitution v1.0.0 established with Vertical Slicing and Clean Architecture principles.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
