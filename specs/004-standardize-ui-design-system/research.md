# Research & Decisions - Standardize UI & Design System

## Decision 1: Centralized View Layout Structure
- **Decision**: Mover as classes de layout `.view-wrapper`, `.view-content-grid`, `.main-column` e `.side-column` de `BudgetsView.vue` para `src/core/styles/main.css`.
- **Rationale**: Essas classes definem a estrutura fundamental da página ("Santo Graal"). Mantê-las centralizadas garante que todas as views tenham o mesmo comportamento responsivo e alinhamento sem duplicação de CSS.
- **Alternatives considered**: Manter em componentes de layout Vue. Rejeitado por ser mais complexo de gerenciar do que classes utilitárias CSS globais baseadas em Tailwind.

## Decision 2: Enhancement of `BaseViewHeader`
- **Decision**: Adicionar uma prop `highlight` ao componente `BaseViewHeader` para permitir o efeito visual de destaque em uma palavra do título (ex: "Meus **Orçamentos**").
- **Rationale**: Esse é um elemento chave na UI de Orçamentos que deve ser replicado em outras telas.
- **Alternatives considered**: Utilizar slots para o título inteiro. Rejeitado para manter o contrato do componente simples e garantir a consistência do estilo do destaque.

## Decision 3: Standardizing Empty States
- **Decision**: Padronizar o componente de Empty State (atualmente inline em `BudgetsView`) para ser um componente compartilhado ou um padrão CSS bem definido em `BaseCard`.
- **Rationale**: Melhora a consistência visual em telas sem dados (ex: Dashboard novo, lista de Metas vazia).

## Decision 4: Semantic Colors Mapping
- **Decision**: Mapear as cores semânticas (`info`, `success`, `warning`, `error`) explicitamente para os tokens do Tailwind e variáveis CSS no `theme.css`.
- **Rationale**: Garante que o feedback visual (ex: badges, barras de progresso) seja consistente entre as telas.
