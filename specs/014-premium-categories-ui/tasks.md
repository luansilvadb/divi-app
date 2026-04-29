# Tasks: Premium Categories UI Redesign

**Input**: Design documents from `specs/014-premium-categories-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests were not explicitly requested in the spec, so implementation follows a direct-to-visual-verification approach as documented in quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize redesign task tracking in `specs/014-premium-categories-ui/tasks.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] Add premium design tokens (mesh gradients, glass surfaces) to `src/styles/design-tokens.css`
- [X] T003 [P] Configure global atmosphere background variables in `src/styles/design-tokens.css`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Immersive Visual Experience (Priority: P1) 🎯 MVP

**Goal**: Implement the atmospheric background and glassmorphic card treatments to transform the interface's feel.

**Independent Test**: Navigate to the Categories page and confirm the existence of the mesh gradient background and glass cards in both themes as per `spec.md`.

### Implementation for User Story 1

- [X] T004 [P] [US1] Create the `AtmosphereBackground` component in `src/shared/components/AtmosphereBackground.vue`
- [X] T005 [US1] Integrate `AtmosphereBackground` into the `CategoriesView.vue` in `src/modules/categories/ui/views/CategoriesView.vue`
- [X] T006 [US1] Apply glassmorphism styling to category cards in `src/modules/categories/ui/views/CategoriesView.vue` using `--surface-glass` and `--glass-blur` tokens

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Dynamic Interaction Feedback (Priority: P2)

**Goal**: Add purposeful micro-animations and color glows to category cards to reinforce user interaction.

**Independent Test**: Hover over a category card and verify the lift effect (transform) and the subtle color glow appearing behind the card.

### Implementation for User Story 2

- [X] T007 [P] [US2] Implement the `ease-spring` based lift animation for category cards in `src/modules/categories/ui/views/CategoriesView.vue`
- [X] T008 [US2] Add the dynamic color glow effect on hover in `src/modules/categories/ui/views/CategoriesView.vue` using category-specific colors derived from domain data

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Refined Data Hierarchy (Priority: P3)

**Goal**: Polish typography and spacing to improve clarity and hierarchy within the new aesthetic.

**Independent Test**: Inspect the CategoriesView and confirm that primary balances and names follow the updated typographic weights and spacing defined in the design system.

### Implementation for User Story 3

- [X] T009 [P] [US3] Update typographic weights and sizes for category titles and balances in `src/modules/categories/ui/views/CategoriesView.vue` using design tokens
- [X] T010 [US3] Refine the layout spacing and stats sidebar panel styling in `src/modules/categories/ui/views/CategoriesView.vue` to improve visual rhythm

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T011 [P] Perform final visual audit for dark mode consistency across all CategoriesView elements in `src/modules/categories/ui/views/CategoriesView.vue`
- [X] T012 Run `quickstart.md` validation to ensure all premium effects are correctly implemented and performant (60fps).
- [X] T013 [P] Remove any dead CSS or legacy hardcoded style values identified during the redesign to maintain Principle IX (No Dead Code).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories can then proceed in parallel (if staffed) or sequentially in priority order (US1 → US2 → US3).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independently testable but requires cards from US1 to be visually complete for full effect.
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independently testable.

### Within Each User Story

- Implementation follows: Models/Tokens → Components → Integration.
- Story complete before moving to next priority.

### Parallel Opportunities

- All Foundational tasks (T002, T003) can run in parallel.
- Once Foundational phase completes, all user stories can start in parallel.
- Specific tasks marked [P] across different stories can run in parallel.

---

## Parallel Example: User Story 1 & 2

```bash
# Launch tokens and components in parallel:
Task: "Add premium design tokens to src/styles/design-tokens.css"
Task: "Create the AtmosphereBackground component in src/shared/components/AtmosphereBackground.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently (Atmosphere + Glass cards)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify visual consistency in both light and dark modes at every checkpoint
- Commit after each task or logical group
