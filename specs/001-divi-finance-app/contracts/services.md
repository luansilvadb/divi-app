# Service Contracts: Divi Personal Finance App

**Feature**: `001-divi-finance-app`
**Status**: Draft

## Currency Service
Handles currency conversion and exchange rate management.
- **convert(amount: decimal, from: string, to: string): Promise<decimal>**
- **getExchangeRate(from: string, to: string): Promise<decimal>**
- **getAllSupportedCurrencies(): Promise<Currency[]>**
- **updateExchangeRates(): Promise<void>**

## Sync Service
Coordinates data synchronization between the local Dexie.js database and the remote Supabase database.
- **syncPendingChanges(): Promise<SyncResult>**
- **fetchRemoteUpdates(): Promise<SyncResult>**
- **handleConflict(local: Entity, remote: Entity, strategy: ConflictStrategy): Promise<Entity>**
- **getSyncStatus(): SyncStatus**

## Auth Service
Handles user authentication and session management via Supabase.
- **signInWithGoogle(): Promise<UserSession>**
- **signOut(): Promise<void>**
- **getCurrentSession(): Promise<UserSession | null>**
- **onSessionChange(callback: (session: UserSession | null) => void): void**

## Budget Logic Service
Domain logic for budget calculation and cadence suggestion.
- **calculateDailyCadence(budget: Budget, daysRemaining: number): decimal**
- **calculateConsumption(budget: Budget, transactions: Transaction[]): decimal**
- **isOverBudget(budget: Budget, consumed: decimal): boolean**

## Goal Logic Service
Domain logic for goal progress and projections.
- **calculateProgressPercentage(goal: Goal): number**
- **estimateCompletionDate(goal: Goal, averageMonthlySaving: decimal): Date**
- **linkTransactionToGoal(transactionId: UUID, goalId: UUID): Promise<void>**
