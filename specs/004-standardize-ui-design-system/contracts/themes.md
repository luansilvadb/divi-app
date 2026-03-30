# UI & Theme Contract - Standardize UI & Design System

## Global Layout Classes

As views que seguem o padrão "Santo Graal" devem utilizar a seguinte estrutura de classes CSS globais (centralizadas em `src/core/styles/main.css`):

```css
.view-wrapper {
  padding: 2rem;
  max-width: var(--view-max-width, 1440px);
  margin: 0 auto;
}

.view-content-grid {
  display: grid;
  grid-template-columns: 1fr var(--side-column-width, 380px);
  gap: var(--content-gap, 1.5rem);
  align-items: start;
}

@media (max-width: 1024px) {
  .view-content-grid {
    grid-template-columns: 1fr;
  }
}

.main-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.side-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
```

## Atomic Component Rules

1. **`BaseViewHeader`**: O título deve ser renderizado como `h1` com pesos de fonte extra-negrito e tracking negativo para um visual moderno. O `subtitle` deve ser `h2` ou `p` em cinza secundário.
2. **`BaseCard`**: Deve obrigatoriamente usar a classe `.glass-card` que aplica o efeito de desfoque de fundo e bordas suaves. Não deve ter largura fixa (deve preencher o container pai).
3. **`BaseIconBox`**: Deve centralizar o ícone e aplicar uma cor de fundo com transparência baseada na cor do ícone (`rgba(color, 0.1)`).

## Visual Consistency Metrics

- **Gaps**: Todos os grids principais de cards devem utilizar `gap: 1.5rem` (24px).
- **Radii**: Cantos arredondados padrão de `20px` para cards grandes e `12px` para botões/inputs.
- **Glassmorphism**: Opacidade do fundo do card deve ser `0.7` em modo claro e `0.4` em modo escuro, com `backdrop-filter: blur(12px)`.
