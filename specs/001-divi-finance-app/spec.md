# Feature Specification: Divi Personal Finance App

**Feature Branch**: `001-divi-finance-app`  
**Created**: 2026-03-29  
**Status**: Draft  
**Input**: Full project functional specification for Divi.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Financial Health Dashboard (Priority: P1)

As a user, I want to see a consolidated view of my finances (balance, budgets, recent transactions) as soon as I open the app, so I can understand my current financial situation without extra effort.

**Why this priority**: The dashboard is the central hub of the app and fulfills the core objective of providing immediate financial empowerment and clarity.

**Independent Test**: Can be tested by navigating to the "Início" screen and verifying that account balances, active budgets, and the recent transaction list are displayed correctly.

**Acceptance Scenarios**:

1. **Given** a user with registered accounts and transactions, **When** they open the Dashboard, **Then** they see their account balance carousal, active budget cards (50/30/20), and the most recent transactions list.
2. **Given** an active budget, **When** viewed on the dashboard, **Then** it shows the remaining amount, a daily suggested spending/saving cadence, and a temporal progress bar.

---

### User Story 2 - Transaction Management & Auto-categorization (Priority: P1)

As a user, I want to record my income and expenses quickly, with the system suggesting categories based on the transaction title, so I can maintain an accurate financial record with minimal friction.

**Why this priority**: Accurate tracking is the foundation of all other features (budgets, reports, goals). Auto-categorization directly addresses the "flexibility" and "low friction" objectives.

**Independent Test**: Can be tested by creating a new transaction with a title previously used and verifying if the category is automatically suggested.

**Acceptance Scenarios**:

1. **Given** a new transaction form, **When** a user enters a known title (e.g., "Supermercado"), **Then** the system automatically selects the associated category (e.g., "Alimentação").
2. **Given** the transaction list, **When** the user navigates between months, **Then** the list updates to show transactions for that specific month with a summary of inflows and outflows.

---

### User Story 3 - Budgeting with 50/30/20 Rule (Priority: P2)

As a user, I want to set up budgets for different categories (Needs, Wants, Savings), so I can control my spending habits and stick to my financial plan.

**Why this priority**: Budgeting is a key tool for financial management beyond simple tracking.

**Independent Test**: Can be tested by creating a budget, linking it to a category, and verifying that transactions in that category update the budget's progress.

**Acceptance Scenarios**:

1. **Given** a budget configuration, **When** a user links categories to it, **Then** any transaction in those categories is reflected in the budget's consumption bar.
2. **Given** a budget card, **When** the user views it, **Then** they see a daily spending limit ("You can spend R$ X/day") calculated based on the remaining budget and days in the period.

---

### User Story 4 - Goal Tracking (Priority: P2)

As a user, I want to create specific saving or spending goals, so I can track my progress towards significant financial milestones (e.g., a trip or paying off a debt).

**Why this priority**: Encourages long-term financial planning and provides motivation through visual progress.

**Independent Test**: Can be tested by creating a "Saving Goal" and adding transactions to it to see the progress percentage increase.

**Acceptance Scenarios**:

1. **Given** a goal list, **When** a user adds a transaction to a goal, **Then** the goal's "Accumulated Value" increases and the progress bar updates.

---

### User Story 5 - Loan and Debt Control (Priority: P3)

As a user, I want to track money I've lent to others or borrowed, including installments, so I don't lose track of these commitments.

**Why this priority**: Specialized financial tracking that adds depth to the app but is secondary to daily cash flow.

**Acceptance Scenarios**:

1. **Given** a long-term loan, **When** a user records an installment payment, **Then** the remaining balance of the loan is updated correctly.

---

### User Story 6 - Recurring Subscriptions (Priority: P3)

As a user, I want to manage my recurring expenses (Netflix, Internet, etc.) in one place, so I can anticipate future outflows and avoid surprises.

**Why this priority**: Automates the recording of frequent transactions and improves the accuracy of future financial projections.

**Acceptance Scenarios**:

1. **Given** a subscription entry, **When** the next occurrence date is reached, **Then** the system generates a "To Pay?" or "Scheduled" transaction.

---

### Edge Cases

- **Multiple Currencies**: How does the system handle a budget in BRL when the user has transactions in USD? (Assumption: Conversion based on configured exchange rates).
- **Over-budget**: What happens when a user exceeds a budget limit? (System should display a negative "remaining" balance and a warning cadence like "You need to save R$ X/day").
- **Deleted Categories**: How are existing transactions handled if their category is deleted? (System should prompt to re-categorize or move to "Uncategorized").

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST be a Progressive Web App (PWA) that is responsive for smartphones and desktops.
- **FR-002**: The Dashboard MUST display a carousal of accounts, 50/30/20 budget cards, recent transactions, and a patrimonial evolution chart.
- **FR-003**: The system MUST allow hierarchical categorization (Categories and Sub-categories) with customizable icons and colors.
- **FR-004**: The system MUST automatically suggest a category when a transaction title matches a previously saved "Payee/Title".
- **FR-005**: Budgets MUST support both "Spending" (limit) and "Saving" (target) types.
- **FR-006**: The system MUST calculate a "Daily Suggested Cadence" for budgets based on the remaining amount and remaining days in the period.
- **FR-007**: Loans MUST support both "Unique" (one-time) and "Long-term" (multiple installments) tracking.
- **FR-008**: The Subscription module MUST track recurring transactions and display the total monthly/annual commitment.
- **FR-009**: The system MUST provide a Calendar View showing transactions and scheduled events with color-coded indicators (Green for income, Red for expense).
- **FR-010**: The "All Spending" report MUST show a cumulative patrimonial growth chart and a category breakdown (donut chart).
- **FR-011**: The system MUST support multiple wallets/accounts with different currencies and manual balance adjustments.
- **FR-012**: The system MUST maintain a "Registration of Activity" log to audit all modifications to transactions.
- **FR-013**: The system MUST support data synchronization via Google account.
- **FR-014**: The system MUST support Light, Dark, and System theme modes.
- **FR-015**: The system MUST allow exporting all transaction data to a CSV file.

### Key Entities

- **Account/Wallet**: Represents a financial repository (Bank, Cash, etc.). Attributes: Name, Balance, Currency, Color, Icon.
- **Transaction**: A single financial movement. Attributes: Title, Value, Date, Type (Income/Expense), Status (Paid/Pending), Account ID, Category ID.
- **Category/Sub-category**: Hierarchical classification for transactions. Attributes: Name, Icon, Color, Type (Income/Expense), Associated Keywords.
- **Budget**: A financial limit or goal for a period. Attributes: Name, Value, Period, Linked Categories, Linked Accounts, Color.
- **Goal (Meta)**: A specific saving or spending target. Attributes: Name, Target Value, Current Value, Type (Saving/Debt), Icon.
- **Loan (Empréstimo)**: Money lent or borrowed. Attributes: Creditor/Devedor, Total Value, installments, Status.
- **Subscription (Assinatura)**: Recurring transaction template. Attributes: Frequency, Next Date, Value, Account, Category.
- **Payee (Título)**: A memorized receiver/sender for auto-categorization mapping.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can record a new transaction in less than 10 seconds.
- **SC-002**: The system correctly auto-categorizes at least 80% of transactions that have titles matching previously used payees.
- **SC-003**: The Dashboard loads and displays all critical widgets (Balance, Budgets, Recent) in under 2 seconds.
- **SC-004**: Data synchronization between devices (via Google) completes in under 5 seconds after a change is made.
- **SC-005**: 100% of functional requirements defined in section 4.1 to 15.4 of the briefing are verifiable through the UI.

## Assumptions

- **Cloud Sync**: Users will primarily use Google Authentication for cross-device data consistency.
- **PWA Context**: The app is designed to work offline but requires a connection for the initial load and synchronization.
- **Default Data**: The application will be initialized with a standard set of categories and sub-categories common to personal finance.
- **Date/Time**: All period calculations (months, daily cadence) assume the user's local timezone.
- **Currency**: While multiple currencies are supported, the dashboard and reports will aggregate values into a "Main Account" or "Preferred Currency" using configured exchange rates.
