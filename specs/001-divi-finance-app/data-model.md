# Data Model: Divi Personal Finance App

**Feature**: `001-divi-finance-app`
**Created**: 2026-03-29

## Entities

### User (Profile)
Represents the authenticated user and their global preferences.
- **id**: UUID (Supabase User ID)
- **full_name**: string
- **email**: string
- **base_currency**: string (default: 'BRL')
- **theme**: enum ('light', 'dark', 'system')
- **language**: string
- **created_at**: timestamp

### Wallet (Account)
A financial repository belonging to a user.
- **id**: UUID
- **user_id**: UUID (Foreign Key)
- **name**: string (e.g., 'Nubank', 'Cash')
- **balance**: decimal (stored in cents/micros to avoid floating point issues)
- **currency**: string (3-letter ISO code)
- **color**: string (hex code)
- **icon**: string
- **is_default**: boolean
- **is_favorite**: boolean
- **created_at**: timestamp

### Category
Hierarchical classification for transactions.
- **id**: UUID
- **user_id**: UUID (Foreign Key)
- **name**: string
- **type**: enum ('income', 'expense')
- **icon**: string (emoji or icon name)
- **color**: string
- **parent_id**: UUID (Optional, points to parent Category for hierarchical grouping)
- **created_at**: timestamp

### Transaction
A single financial movement.
- **id**: UUID
- **user_id**: UUID (Foreign Key)
- **wallet_id**: UUID (Foreign Key)
- **category_id**: UUID (Foreign Key)
- **title**: string
- **value**: decimal (positive for income, negative for expense)
- **date**: timestamp
- **status**: enum ('paid', 'pending', 'scheduled', 'overdue')
- **note**: string (optional)
- **payee_id**: UUID (Optional, link to a Payee entity)
- **is_recurring**: boolean
- **created_at**: timestamp

### Budget
A financial limit or goal for a period.
- **id**: UUID
- **user_id**: UUID (Foreign Key)
- **name**: string
- **type**: enum ('spending', 'saving')
- **limit_value**: decimal
- **period_start**: date
- **period_end**: date
- **color**: string
- **categories**: UUID[] (Array of linked Category IDs)
- **wallets**: UUID[] (Array of linked Wallet IDs)
- **created_at**: timestamp

### Goal (Meta)
A specific saving or spending target.
- **id**: UUID
- **user_id**: UUID (Foreign Key)
- **name**: string
- **target_value**: decimal
- **current_value**: decimal
- **type**: enum ('saving', 'debt')
- **color**: string
- **icon**: string
- **created_at**: timestamp

### Payee (Título)
Memorized receiver/sender for auto-categorization mapping.
- **id**: UUID
- **user_id**: UUID (Foreign Key)
- **title**: string (Unique per user)
- **default_category_id**: UUID (Foreign Key)
- **last_used_at**: timestamp

## Relationships

1.  **User (1:N) Wallets**: A user can have multiple accounts.
2.  **User (1:N) Categories**: A user can have custom categories.
3.  **Wallet (1:N) Transactions**: A wallet records many transactions.
4.  **Category (1:N) Transactions**: Transactions are classified by categories.
5.  **Category (1:N) Sub-categories**: Recursive parent-child relationship for hierarchy.
6.  **Budget (M:N) Categories**: A budget can monitor multiple categories.
7.  **Budget (M:N) Wallets**: A budget can be linked to specific wallets.
8.  **Goal (1:N) Transactions**: Transactions can be linked to a goal (e.g., transfers to savings).

## Validation Rules

- **Transactions**: Value cannot be zero. Date must be valid. Status must align with date (e.g., 'scheduled' for future dates).
- **Budgets**: `limit_value` must be positive. `period_start` must be before `period_end`.
- **Goals**: `target_value` must be positive.
- **Categories**: Name must be unique within the same parent category for a user.
