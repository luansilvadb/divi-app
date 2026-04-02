## [LRN-20250522-001] best_practice

**Logged**: 2025-05-22T04:15:00Z
**Priority**: low
**Status**: pending
**Area**: frontend

### Summary
Enhanced BottomSheet UX with @douxcode/vue-spring-bottom-sheet advanced features.

### Details
Utilized `#header` slot for sticky titles and a visual drag handle. Implemented `instinct-height` by removing static `max-h` constraints from inner content, allowing the library to calculate optimal sheet height automatically. Improved visual depth with `backdrop-filter: blur(8px)`.

### Suggested Action
Always use `instinct-height` and `snap-points` when using vue-spring-bottom-sheet for better mobile UX, and ensure inner content doesn't have hardcoded max-heights that interfere with calculation.

### Metadata
- Source: conversation
- Related Files: src/shared/components/organisms/TransactionBottomSheet.vue, src/shared/components/organisms/TransactionFormContent.vue
- Tags: ux, bottomsheet, vue
---
