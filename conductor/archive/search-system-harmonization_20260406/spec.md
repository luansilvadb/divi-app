# Specification: Search System Harmonization

## Problem Statement
The current `BaseSearchInput` component has hardcoded styling (e.g., `emerald-400`) that deviates from the project's primary theme. Additionally, several views that could benefit from search functionality currently lack it, leading to a fragmented user experience.

## Goals
1.  **Refine Search Design**: Update `BaseSearchInput.vue` to align with the `DiviPreset` and the project's primary color scheme.
2.  **Improve Functionality**: Add debouncing and a loading state to the search component for better user experience.
3.  **Standardize Usage**: Implement the search bar across all relevant entity views (`Budgets`, `Goals`, `Loans`, `Subscriptions`).

## Non-Functional Requirements
- **Consistency**: All search inputs should look and behave identically across the application.
- **Accessibility**: Support keyboard navigation and have appropriate ARIA attributes.
- **Performance**: Debounce input to minimize unnecessary re-computations or store updates.

## Design Refinement Details
- **Primary Color Integration**: Use the project's primary and secondary colors instead of `emerald-400`.
- **Border Radius Alignment**: Ensure the search input's border radius follows the project's UI language (e.g., `rounded-full` or consistent with `BaseButton`).
- **Focus States**: Refine focus states to be consistent with other input elements while maintaining its unique "modern" look.
