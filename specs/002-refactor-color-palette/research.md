# Research: Refactor Design System Color Palette (Traditional/Premium)

**Feature**: 002-refactor-color-palette
**Date**: 2026-03-29

## Decision: Color Palette Selection

### Rationale
To evoke "Security, Trust, and Solidity" for a "Traditional/Premium" banking profile, we selected a palette based on Deep Navy (Primary), Emerald Green (Success/Secondary), and Champagne Gold (Accent).

### Selected Colors (Draft)

| Category | Token | Light Mode | Dark Mode | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Brand** | `primary-main` | `#1A2B4C` (Deep Navy) | `#3D5A80` (Steel Blue) | Navy represents stability and professionalism. |
| **Brand** | `secondary-main` | `#004B23` (Emerald) | `#00A34D` (Bright Emerald) | Green represents growth and wealth. |
| **Brand** | `accent-main` | `#C5A059` (Gold) | `#D4AF37` (Metallic Gold) | Gold represents prestige and premium quality. |
| **Neutral** | `bg-main` | `#F8F9FA` (Soft Gray) | `#0B0E14` (Deep Night) | Clean light background vs. high-quality dark surface. |
| **Neutral** | `surface-main` | `#FFFFFF` | `#161B22` | Cards and surfaces. |
| **Neutral** | `border-main` | `#E1E4E8` | `#30363D` | Subtle borders for structure. |
| **Text** | `text-primary` | `#0B0E14` | `#F0F6FC` | Maximum legibility. |
| **Text** | `text-secondary` | `#586069` | `#8B949E` | Supporting text. |
| **Semantic** | `success` | `#008000` | `#32CD32` | Standard green for success. |
| **Semantic** | `error` | `#D73A49` | `#F85149` | Clear warning/error red. |

## Contrast Validation (WCAG AA)

- **Light Mode**: `text-primary` (#0B0E14) on `bg-main` (#F8F9FA) = ~20:1 (PASS)
- **Dark Mode**: `text-primary` (#F0F6FC) on `bg-main` (#0B0E14) = ~15:1 (PASS)
- **Primary on BG**: `primary-main` (#1A2B4C) on Light BG = ~12:1 (PASS)

## Alternatives Considered
- **Vibrant Blue/Purple**: Rejected because it feels too "Tech/Startup" and less "Traditional/Premium".
- **Monochrome (Black/White)**: Rejected as it can feel cold and less welcoming for a personal finance app.

## Implementation Pattern: Tailwindcss + CSS Variables

### CSS Variables Strategy
We will define tokens as CSS Variables in a global stylesheet (e.g., `src/core/styles/theme.css`).
- `:root`: Light theme values.
- `.dark`: Dark theme values.

### Tailwindcss Integration
Map these variables in `tailwind.config.js` to enable utility classes:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          main: 'var(--color-primary-main)',
        },
        secondary: {
          main: 'var(--color-secondary-main)',
        },
        accent: {
          main: 'var(--color-accent-main)',
        },
        bg: {
          main: 'var(--color-bg-main)',
        },
        surface: {
          main: 'var(--color-surface-main)',
        },
        border: {
          main: 'var(--color-border-main)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        }
      }
    }
  }
}
```

### Rationale for Tailwindcss
- **Productivity**: Rapid UI building with utility classes.
- **Consistency**: Centralized theme management.
- **Dynamic Themes**: CSS Variables allow real-time theme switching without re-rendering Tailwind's generated styles.
