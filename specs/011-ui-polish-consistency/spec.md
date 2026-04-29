# Feature Specification: UI Polish and Consistency

**Feature Branch**: `011-ui-polish-consistency`  
**Created**: 2026-04-29  
**Status**: Draft  
**Input**: User description: "precisamos de polimento em algumas partes da ui seguindo consistencia visual, marquei de vermelho algumas coisas que encontrei"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fix Sidebar Icons Rendering (Priority: P1)

The user expects all navigation items in the sidebar to have visible, consistent icons that represent the section accurately. Currently, the "Orçamentos" item displays a placeholder or broken icon (white box).

**Why this priority**: Navigation is a core part of the UX. Broken icons make the app look unpolished and reduce usability.

**Independent Test**: User can navigate to the sidebar and see a valid icon for "Orçamentos" that matches the style of other icons.

**Acceptance Scenarios**:

1. **Given** the user is on any page with the sidebar visible, **When** they look at the "Orçamentos" menu item, **Then** a valid wallet-themed icon should be displayed instead of a white box.
2. **Given** the sidebar is collapsed or expanded, **When** the icons are rendered, **Then** they should be perfectly aligned with the text and other menu items.

---

### User Story 2 - Enhance Sync Status Visibility (Priority: P2)

The user needs to clearly see the synchronization status and access notifications. In the current UI, the "Sincronizado" indicator and the notification bell icon have low contrast or inconsistent styling compared to the header's primary elements.

**Why this priority**: Users need feedback on data persistence. Low contrast can lead to uncertainty about whether their data is safe.

**Independent Test**: The "Sincronizado" status and notification bell are clearly legible and visually balanced in the header.

**Acceptance Scenarios**:

1. **Given** the app is in a synchronized state, **When** the user views the header, **Then** the "Sincronizado" text should be clearly readable with appropriate color (e.g., success green) and typography.
2. **Given** the notification bell is visible, **When** the user views it, **Then** its size and color should match the header's design system.

---

### Edge Cases

- **Mobile View**: How do these polish changes affect the Bottom Bar (mobile navigation)?
- **Dark/Light Mode**: Do the color adjustments for the sync indicator maintain legibility in both themes?
- **Long Labels**: How does the sidebar handle longer labels if font sizes are adjusted?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sidebar MUST render all icons correctly using the project's icon set (Lucide).
- **FR-002**: Sidebar menu items MUST maintain consistent vertical and horizontal alignment.
- **FR-003**: Header status indicators MUST have sufficient contrast ratio (WCAG AA).
- **FR-004**: Hover states for all interactive elements in sidebar and header MUST be consistent with the global theme.
- **FR-005**: All user-facing strings in UI polish MUST be retrieved from the message catalog.

### Key Entities *(include if feature involves data)*

- **Navigation Item**: Represents a link in the sidebar, containing a label, an icon, and a route.
- **Sync Status**: Represents the current state of data synchronization (e.g., Sincronizado, Sincronizando, Erro).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of sidebar menu items display valid icons.
- **SC-002**: Header status indicator text contrast ratio is at least 4.5:1 against the background.
- **SC-003**: 100% alignment of icons and text in the sidebar navigation.

## Assumptions

- The "white box" in the screenshot is a rendering failure of an icon named `i-lucide-IWallet`.
- The project uses `i-lucide-` prefix for Lucide icons.
- The design system defines specific colors for "Success" states that should be applied to the sync indicator.

## Out of Scope *(mandatory)*

- Adding new menu items to the sidebar.
- Changing the functional logic of the Sync Engine.
- Redesigning the entire header or sidebar layout from scratch.
