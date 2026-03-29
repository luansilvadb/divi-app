# Repository Contracts: Divi Personal Finance App

**Feature**: `001-divi-finance-app`
**Status**: Draft

## Transaction Repository
Responsible for CRUD operations on transactions.
- **getAll(filter: DateRange): Promise<Transaction[]>**
- **getById(id: UUID): Promise<Transaction>**
- **create(data: TransactionData): Promise<Transaction>**
- **update(id: UUID, data: Partial<TransactionData>): Promise<Transaction>**
- **delete(id: UUID): Promise<void>**
- **getSummaryByMonth(month: number, year: number): Promise<MonthlySummary>**

## Wallet Repository
Responsible for managing user wallets.
- **getAll(): Promise<Wallet[]>**
- **getById(id: UUID): Promise<Wallet>**
- **create(data: WalletData): Promise<Wallet>**
- **update(id: UUID, data: Partial<WalletData>): Promise<Wallet>**
- **delete(id: UUID): Promise<void>**
- **setDefault(id: UUID): Promise<void>**

## Category Repository
Responsible for hierarchical categorization.
- **getAll(): Promise<Category[]>**
- **getById(id: UUID): Promise<Category>**
- **create(data: CategoryData): Promise<Category>**
- **update(id: UUID, data: Partial<CategoryData>): Promise<Category>**
- **delete(id: UUID): Promise<void>**
- **getByParent(parentId: UUID): Promise<Category[]>**

## Budget Repository
Responsible for budget monitoring.
- **getAllActive(): Promise<Budget[]>**
- **getHistory(budgetId: UUID): Promise<BudgetPeriod[]>**
- **create(data: BudgetData): Promise<Budget>**
- **update(id: UUID, data: Partial<BudgetData>): Promise<Budget>**
- **delete(id: UUID): Promise<void>**

## Goal Repository
Responsible for goal tracking.
- **getAll(): Promise<Goal[]>**
- **updateProgress(goalId: UUID, amount: decimal): Promise<Goal>**
- **create(data: GoalData): Promise<Goal>**
- **delete(id: UUID): Promise<void>**
