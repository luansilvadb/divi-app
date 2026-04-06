# Specification: UI Refinement for Transactions Searchbar

## Overview
This track aims to upgrade the search bar in the `TransactionsView.vue` from a basic text input to a premium, polished component that aligns with the "Cool Harmony" theme.

## Current Pain Points
- The search bar is barely visible (transparent background, no border).
- Lack of interactive feedback (no hover/focus effects).
- The icon is small and static.
- Overall feels "unpolished" and "default".

## Functional Requirements
- **Visual Feedback:**
  - Add a subtle background color (`var(--surface-subtle)` or similar).
  - Use a border that highlights on focus.
  - Add smooth transitions for hover and focus states.
- **Interactions:**
  - Scaling effect when the user types or interacts.
  - A "Clear" (X) button that appearing when text is present.
  - Smooth animation of the magnifying glass icon (e.g., subtle glow on focus).
- **Placement & Layout:**
  - Increase the tap target area.
  - Ensure centered alignment within its row.

## Design Vision
- **Theme:** "Nocturnal Blue" / "Cool Harmony" (#131824).
- **Reference:** Consistent with the premium cards and modals seen in other sections of the app (e.g., Dashboard).
- **Animations:** Use `v-motion` (assuming it's used based on previous summaries) or CSS transitions for a fluid feel.

## Impacted Files
- `src/modules/transactions/ui/views/TransactionsView.vue`
