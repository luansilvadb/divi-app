# Track Specification: Improve the transactions screen using PrimeVue

## Overview
Enhance the transactions screen by replacing custom components with PrimeVue components, improving UX with bulk actions, saved filters, CSV export, inline editing, smart form suggestions, and mobile optimizations.

## Functional Requirements
1. **Transaction List**: Replace current custom list with PrimeVue DataView, keeping card-based grouped layout with proper PrimeVue styling
2. **Bulk Actions**: Add multi-select capability for transactions with bulk delete and bulk edit operations
3. **Saved Filters**: Allow users to save and apply filter presets (date range, category, type, amount range)
4. **Export to CSV**: Add button to export filtered or all transactions to CSV format
5. **Inline Editing**: Enable quick edits of transaction amount, category, or title directly in the list
6. **Transaction Dialog**: Use PrimeVue Dialog for add/edit with smart suggestions (auto-suggest categories based on title, suggest amounts from history)
7. **Metrics Panel**: Update summary panels with PrimeVue components (SelectButton for filters, better progress indicators)
8. **Mobile UX**: Responsive card layout, swipe gestures for quick delete/edit on mobile, optimized mobile dialog

## Non-Functional Requirements
- Maintain TypeScript strict mode
- Follow PrimeVue 4.5 theming conventions with DiviPreset
- All components must be responsive and accessible (WCAG AA)
- Maintain current month-scoped data fetching performance

## Acceptance Criteria
- [ ] DataView displays transactions grouped by date with PrimeVue styling
- [ ] Bulk selection works with confirm dialog for bulk delete
- [ ] Filter presets can be saved and applied
- [ ] CSV export downloads correctly formatted file
- [ ] Inline editing updates transaction without full reload
- [ ] Transaction dialog shows smart suggestions
- [ ] Mobile layout is optimized with swipe gestures
- [ ] All changes pass type-check and lint

## Out of Scope
- Backend/database schema changes
- Authentication flow changes
- New feature development beyond transactions screen
- Test environment fixes (blocked separately)
