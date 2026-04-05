# Track Specification: Improve the transactions searchbar component

## Overview
Replace the current search input with PrimeVue AutoComplete component, adding multi-field search, advanced filters, real-time suggestions, search history, fuzzy matching, and instant results.

## Functional Requirements
1. **PrimeVue AutoComplete**: Replace current BaseInput search with PrimeVue AutoComplete component with dropdown suggestions
2. **Multi-field Search**: Search across title, category, wallet, and amount fields simultaneously
3. **Advanced Filters**: Add filter options for date range, category, transaction type, and amount range
4. **Real-time Suggestions**: Show matching transactions in dropdown as user types
5. **Search History**: Keep recent searches and allow users to select previous searches
6. **Fuzzy Matching**: Find results even with typos or partial words
7. **Case/Accent Insensitive**: 'transacao' should match 'transação', search ignores case
8. **Instant Results**: Update displayed list instantly without reload

## Non-Functional Requirements
- Maintain TypeScript strict mode
- Follow PrimeVue 4.5 theming with DiviPreset
- Search performance: results within 100ms for typical month data
- All components must be responsive and accessible (WCAG AA)

## Acceptance Criteria
- [ ] PrimeVue AutoComplete replaces current search input
- [ ] Multi-field search works across title, category, wallet, amount
- [ ] Advanced filters panel for date, category, type, amount range
- [ ] Dropdown shows real-time suggestions as user types
- [ ] Search history accessible and selectable
- [ ] Fuzzy matching finds results with typos
- [ ] Search is case/accent insensitive
- [ ] Results update instantly without reload
- [ ] All changes pass type-check and lint

## Out of Scope
- Backend search or server-side filtering
- Database indexing changes
- Search analytics or tracking
