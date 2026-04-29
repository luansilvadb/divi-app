# Feature Specification: Refine Categories UI Aesthetics

**Feature Branch**: `013-refine-categories-ui`  
**Created**: 2026-04-29  
**Status**: Draft  
**Input**: User description: "Analyze repository and implement one micro aesthetic UI improvement (< 50 lines) that significantly elevates visual quality — specifically targeting hardcoded style values in CategoriesView that break dark-mode consistency and violate the design token system."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent Card Visuals Across Themes (Priority: P1)

A user navigates to the Categories page in either light or dark mode. Category cards and the stats sidebar panel display with visually consistent elevation, borders, and radius values that adapt correctly to the active theme — appearing polished and cohesive rather than having "dirty" light-mode shadows bleeding through on dark backgrounds.

**Why this priority**: This is the core visual inconsistency — hardcoded `rgba(0,0,0,...)` shadows and border colors render incorrectly in dark mode, producing a visually jarring, unpolished appearance that undermines the premium design language of the entire application.

**Independent Test**: Can be fully tested by toggling between light and dark mode on the Categories page and confirming that card shadows, hover borders, and icon radius values adapt correctly to each theme.

**Acceptance Scenarios**:

1. **Given** the app is in dark mode, **When** the user views the Categories page, **Then** category cards display with no light-mode shadow artifacts and borders adapt to the dark surface system.
2. **Given** the app is in light mode, **When** the user hovers over a category card, **Then** the card elevates with the design-system `--shadow-lg` token and the border transitions to `--border-color-hover`.
3. **Given** any theme, **When** the user views the stats sidebar panel, **Then** the panel card uses the same design-token-based elevation and border system as other application cards.

---

### User Story 2 - Icon Container Consistency (Priority: P2)

A user views category cards and notices that the icon container's border-radius aligns with the design system's radius scale rather than using an arbitrary hardcoded pixel value.

**Why this priority**: While a subtle detail, inconsistent radius values (e.g., `14px` where the scale offers `12px` or `16px`) create a subliminal sense of visual discord that erodes the "designed" feel of the interface.

**Independent Test**: Can be tested by inspecting the icon container's computed border-radius and confirming it maps to a design token (`--radius-lg`).

**Acceptance Scenarios**:

1. **Given** a category card is rendered, **When** inspecting the icon container, **Then** its border-radius uses `var(--radius-lg)` from the design token scale.

---

### Edge Cases

- What happens when category cards render with no `--category-color` set? *(Existing fallback behavior is unaffected — this change only touches elevation/border/radius tokens.)*
- How does the hover state look when shadows are `none` in dark mode? *(Cards rely on border and subtle transform for feedback — the existing `translateY(-2px)` and border-color shift provide sufficient hover indication.)*

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Category cards MUST use design-system shadow tokens (`--shadow-sm`, `--shadow-lg`) instead of hardcoded `rgba()` box-shadow values.
- **FR-002**: Category card hover state MUST use `--border-color-hover` token instead of hardcoded `rgba(0, 0, 0, 0.08)`.
- **FR-003**: Category card active state MUST use `--shadow-sm` token instead of hardcoded shadow.
- **FR-004**: Icon container border-radius MUST use `--radius-lg` design token instead of hardcoded `14px`.
- **FR-005**: Stats panel card MUST use `--shadow-md` token instead of hardcoded composite box-shadow.
- **FR-006**: All changes MUST be scoped to CSS-only modifications within `CategoriesView.vue` `<style>` block — no template or script changes.
- **FR-007**: Total change MUST be under 50 lines of code.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Category cards in dark mode display zero visible light-mode shadow artifacts.
- **SC-002**: All shadow, border, and radius values in CategoriesView reference design tokens — zero hardcoded `rgba()` shadows remain in the card and stat styles.
- **SC-003**: Visual appearance in light mode remains equivalent or improved (no visual regressions).
- **SC-004**: Total changeset is ≤ 50 lines.
- **SC-005**: Existing lint rules and tests continue to pass without modification.

## Assumptions

- The existing design token system (`design-tokens.css`) correctly sets `--shadow-sm`, `--shadow-md`, `--shadow-lg` to `none` in dark mode, which is the intended Apple HIG behavior.
- The `--border-color-hover` token is appropriate for card hover states (consistent with input hover behavior elsewhere in the system).
- Replacing `border-radius: 14px` with `var(--radius-lg)` (12px) is an acceptable 2px difference that aligns with the design scale.
- No other views or components depend on the specific hardcoded values being replaced.

## Out of Scope *(mandatory)*

- Refactoring other views (Transactions, Dashboard, etc.) to use design tokens — this spec targets CategoriesView only.
- Adding new design tokens to the token system.
- Changing template structure, component logic, or business behavior.
- Accessibility improvements (focus states, ARIA attributes).
- Creating new components or composables.
- Responsive layout changes.
