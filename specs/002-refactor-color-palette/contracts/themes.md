# CSS Variables & Tailwind Contract: UI Themes

**Feature**: 002-refactor-color-palette
**Date**: 2026-03-29

## Interface: CSS Root Variables
The system exposes core CSS custom properties in `:root` (Light) and `.dark` (Dark).

### Brand Tokens
| Variable | Light | Dark | Tailwind Class | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `--color-primary-main` | `#1A2B4C` | `#3D5A80` | `text-primary-main` / `bg-primary-main` | Estabilidade e Profissionalismo. |
| `--color-secondary-main` | `#004B23` | `#00A34D` | `text-secondary-main` / `bg-secondary-main` | Crescimento e Riqueza. |
| `--color-accent-main` | `#C5A059` | `#D4AF37` | `text-accent-main` / `bg-accent-main` | Prestígio e Qualidade Premium. |

### Neutral Tokens
| Variable | Light | Dark | Tailwind Class | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `--color-bg-main` | `#F8F9FA` | `#0B0E14` | `bg-bg-main` | Fundo principal da aplicação. |
| `--color-surface-main` | `#FFFFFF` | `#161B22` | `bg-surface-main` | Cards e superfícies. |
| `--color-border-main` | `#E1E4E8` | `#30363D` | `border-border-main` | Estrutura e divisores. |

### Text Tokens
| Variable | Light | Dark | Tailwind Class | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `--color-text-primary` | `#0B0E14` | `#F0F6FC` | `text-text-primary` | Conteúdo principal (Legibilidade máxima). |
| `--color-text-secondary` | `#586069` | `#8B949E` | `text-text-secondary` | Conteúdo de apoio. |

## Consumption Policy
- **Global Access**: Variables are available via standard CSS `var(--name)`.
- **Tailwind First**: Prefer using Tailwind utility classes (`text-primary-main`) for faster development.
- **Theme Switching**: The system toggles the `.dark` class on the `<html>` or `<body>` element.
