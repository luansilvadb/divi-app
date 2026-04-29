# Research: Refine Categories UI Aesthetics

## Technical Context
The feature is a micro aesthetic UI improvement in `CategoriesView.vue`, replacing hardcoded styles with design system tokens.
- **Language/Framework**: Vue.js 3 with TypeScript
- **Design System**: Custom CSS tokens + Tailwind CSS + Naive UI
- **Target File**: `src/modules/categories/ui/views/CategoriesView.vue`
- **Tokens File**: `src/styles/design-tokens.css`

## Findings
No complex research is needed as the task simply involves mapping hardcoded `rgba` box-shadows, border-colors, and specific border-radius pixels to their respective variables defined in `design-tokens.css` to properly support light/dark modes.

**Decisions**:
- Use `var(--shadow-sm)` and `var(--shadow-lg)` for category cards instead of `box-shadow` with `rgba()`.
- Use `var(--border-color-hover)` instead of `rgba(0, 0, 0, 0.08)` for card hover borders.
- Use `var(--radius-lg)` for the card icon container instead of `14px`.
- Use `var(--shadow-md)` for the stats panel card.
