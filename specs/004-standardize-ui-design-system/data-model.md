# Data Model & UI Components - Standardize UI & Design System

## Design Tokens (CSS Variables)

Mapeamento de tokens baseado em `src/core/styles/theme.css`:

- **Layout Structure**:
  - `--view-max-width`: Largura máxima das views.
  - `--side-column-width`: Largura da coluna lateral (ex: `380px`).
  - `--content-gap`: Espaçamento entre as colunas (ex: `1.5rem`).

- **Color Tokens (Semantic)**:
  - `--color-primary-main`: Navy/Dark principal.
  - `--color-secondary-main`: Emerald/Verde para sucessos.
  - `--color-accent-main`: Gold/Destaques.
  - `--color-error-main`: Vermelho para erros/estouro.
  - `--color-warning-main`: Amarelo para avisos.
  - `--color-info-main`: Azul para informações neutras.

## Shared UI Components (Contracts)

### BaseViewHeader
- **Props**:
  - `title`: string (obrigatório)
  - `subtitle`: string (opcional)
  - `highlight`: string (opcional, para destacar palavra-chave)
- **Slots**:
  - `action`: para botões de ação principal (ex: "Novo Orçamento").

### BaseCard
- **Props**:
  - `clickable`: boolean (efeito de hover e cursor pointer)
- **Slots**:
  - `header`: Título e ícone no topo do card.
  - `default`: Conteúdo principal.
  - `footer`: Rodapé para ações ou metadados.

### BaseSummaryItem
- **Props**:
  - `label`: string (título do item)
  - `value`: string (valor formatado)
  - `color`: string (cor do marcador visual)
  - `status`: 'normal' | 'info' | 'success' | 'warning' | 'error'
- **Slots**:
  - `icon`: Ícone associado ao item.
