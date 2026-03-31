# Feature Specification: Fix Invalid URL Error for Data URIs

**Feature Branch**: `002-fix-invalid-url-error`  
**Created**: 2026-03-30  
**Status**: Draft  
**Input**: User description: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4OcnJyXl5ejo6Onp6ednZ2goKCfbm6urq6np6ejo6Onp6ejo6Onp6ejo6Onp6ejo6Onp6ejo6Onp6ejo6Onp6ejo6Onp6ejo6Onp6fS8vPMAAAAFHRSTlMAB0Y6NE9QUVByZ2eAgIaYp7m9vs7S8vMAAAABYktHRACIBR1IAAAAbUlEQVQ4y2NgYGRiYmJmZsbGxsYEBQUFBRQUFBTU1NTo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OgMFAAA=:1 GET data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4OcnJyXl5ejo6Onp6ednZ2goKCfbm6urq6np6ejo6Onp6ejo6Onp6ejo6Onp6ejo6Onp6ejo6Onp6ejo6Onp6ejo6Onp6ejo6Onp6fS8vPMAAAAFHRSTlMAB0Y6NE9QUVByZ2eAgIaYp7m9vs7S8vMAAAABYktHRACIBR1IAAAAbUlEQVQ4y2NgYGRiYmJmZsbGxsYEBQUFBRQUFBTU1NTo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OgMFAAA= net::ERR_INVALID_URL pinia.js?v=e46623ae:4416 🍍 'dashboard' store installed 🆕 pinia.js?v=e46623ae:4416 🍍 'transactions' store installed 🆕"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Error-free Store Initialization (Priority: P1)

As a user, when I access the application dashboard or the transactions page, I want the application to load without generating console errors so that I have a professional and stable experience.

**Why this priority**: Reliability is a core value. Console errors can indicate underlying performance issues or broken visual elements (placeholders, icons).

**Independent Test**: Can be fully tested by opening the browser's developer tools (Console tab) and navigating to the Dashboard and Transactions views. No `net::ERR_INVALID_URL` should appear.

**Acceptance Scenarios**:

1. **Given** the application is running, **When** the Dashboard store is initialized, **Then** no network errors regarding data URIs should be logged.
2. **Given** the application is running, **When** the Transactions store is initialized, **Then** no network errors regarding data URIs should be logged.

---

### User Story 2 - Visual Consistency for Placeholders (Priority: P2)

As a user, if a real image fails to load or is not yet available, I want to see a valid placeholder icon instead of a broken image link or an empty space.

**Why this priority**: Enhances the UI polish and ensures the user understands that an image is missing rather than the app being broken.

**Independent Test**: Manually trigger a fallback scenario (e.g., by clearing user data or simulating a missing transaction category icon) and verify that the placeholder displays correctly.

**Acceptance Scenarios**:

1. **Given** a transaction without a specific icon, **When** it is displayed in the list, **Then** the default placeholder should render correctly without console errors.

---

### Edge Cases

- **Large Base64 Strings**: System MUST validate Data URIs against a 128KB size limit. Assets exceeding this limit MUST be rejected or logged as a performance warning.
- **Malformed Data URIs**: How does the system handle strings that are not valid Base64? It MUST fallback to a safe static asset.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST use valid, sanitized, and secure Data URIs for all embedded assets, preventing both network errors and XSS vulnerabilities.
- **FR-002**: The `dashboard` store MUST NOT attempt to load malformed image URLs during its initialization hook.
- **FR-003**: The `transactions` store MUST NOT attempt to load malformed image URLs during its initialization hook.
- **FR-004**: The system MUST provide a robust multilevel fallback mechanism for images: Static Asset (e.g., `/public/placeholder.png`) → UI Component (CSS/SVG inline) if a Data URI or static asset is invalid.
- **FR-005**: System MUST validate all Data URIs against a 128KB size limit before processing.
- **FR-006**: System MUST log failed asset loads and sanitization rejections to the `ActivityLogService`.

### Key Entities

- **Asset**: Represents a visual resource (icon, image) used within the application modules.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of store initializations (Dashboard, Transactions) result in zero `net::ERR_INVALID_URL` console errors.
- **SC-002**: All visual placeholders are visible and correctly rendered across all supported browsers.
- **SC-003**: Application initialization time remains stable or improves due to removal of failed network requests.

## Assumptions

- The error is caused by a malformed or excessively long Data URI string defined in the store initialization logic or associated components.
- Standard SVG or PNG fallbacks are acceptable if Data URIs continue to cause issues in certain environments.
- The browser environment supports Data URIs in general (standard for modern browsers).

---
dard SVG or PNG fallbacks are acceptable if Data URIs continue to cause issues in certain environments.
- The browser environment supports Data URIs in general (standard for modern browsers).

---
g defined in the store initialization logic or associated components.
- Standard SVG or PNG fallbacks are acceptable if Data URIs continue to cause issues in certain environments.
- The browser environment supports Data URIs in general (standard for modern browsers).

---
dard SVG or PNG fallbacks are acceptable if Data URIs continue to cause issues in certain environments.
- The browser environment supports Data URIs in general (standard for modern browsers).

---
