import { describe, it, expect, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useTransactionStats } from '../../application/stores/useTransactionStats'
import type { ITransaction } from '@/modules/transactions/core/entities/ITransaction'
import type { ICategory } from '@/modules/categories/core/entities/ICategory'

type UITransaction = any

describe('Balance Calculation', () => {
  let mocktransactions: UITransaction[]
  let mockCategoryMap: Record<string, ICategory>

  beforeEach(() => {
    mocktransactions = [
      {
        id: 'tx-1',
        title: 'Salary',
        _titleLower: 'salary',
        amount: 500000n, // R$ 5.000,00
        type: 'income',
        category_id: 'cat-income',
        wallet_id: 'IWallet-1',
        date: '2026-04-01',
        _dateKey: '2026-04-01',
        _timestamp: 1711929600000,
        user_id: 'user-1',
        tags: [],
        sync_status: 'synced',
        created_at: '2026-04-01T00:00:00Z',
        client_updated_at: '2026-04-01T00:00:00Z',
        version: 1,
        deleted: false,
      },
      {
        id: 'tx-2',
        title: 'Grocery Shopping',
        _titleLower: 'grocery shopping',
        amount: 15000n, // R$ 150,00
        type: 'expense',
        category_id: 'cat-food',
        wallet_id: 'IWallet-1',
        date: '2026-04-15',
        _dateKey: '2026-04-15',
        _timestamp: 1713139200000,
        user_id: 'user-1',
        tags: [],
        sync_status: 'synced',
        created_at: '2026-04-15T00:00:00Z',
        client_updated_at: '2026-04-15T00:00:00Z',
        version: 1,
        deleted: false,
      },
      {
        id: 'tx-3',
        title: 'Netflix',
        _titleLower: 'netflix',
        amount: 4500n, // R$ 45,00
        type: 'expense',
        category_id: 'cat-entertainment',
        wallet_id: 'IWallet-1',
        date: '2026-04-20',
        _dateKey: '2026-04-20',
        _timestamp: 1713571200000,
        user_id: 'user-1',
        tags: [],
        sync_status: 'synced',
        created_at: '2026-04-20T00:00:00Z',
        client_updated_at: '2026-04-20T00:00:00Z',
        version: 1,
        deleted: false,
      },
    ]

    mockCategoryMap = {
      'cat-income': { id: 'cat-income', name: 'Salary', color: '#3b82f6', icon: 'IWallet' },
      'cat-food': { id: 'cat-food', name: 'Food', color: '#10b981', icon: 'shopping' },
      'cat-entertainment': { id: 'cat-entertainment', name: 'Entertainment', color: '#8b5cf6', icon: 'movie' },
    }
  })

  describe('usetransactionstats', () => {
    it('should calculate total income correctly', () => {
      const transactionsRef = ref(mocktransactions as unknown as ITransaction[])
      const categoryMap = mockCategoryMap

      const { totalIncome } = useTransactionStats(transactionsRef, () => ref(categoryMap))

      expect(totalIncome.value).toBe(5000) // 500000n / 100 = 5000
    })

    it('should calculate total expense correctly', () => {
      const transactionsRef = ref(mocktransactions as unknown as ITransaction[])
      const categoryMap = mockCategoryMap

      const { totalExpense } = useTransactionStats(transactionsRef, () => ref(categoryMap))

      // 15000n + 4500n = 19500n / 100 = 195
      expect(totalExpense.value).toBe(195)
    })

    it('should calculate monthly balance correctly', () => {
      const transactionsRef = ref(mocktransactions as unknown as ITransaction[])
      const categoryMap = mockCategoryMap

      const { monthlyBalance, totalIncome, totalExpense } = useTransactionStats(
        transactionsRef,
        () => ref(categoryMap),
      )

      expect(monthlyBalance.value).toBe(totalIncome.value - totalExpense.value)
      expect(monthlyBalance.value).toBe(4805) // 5000 - 195
    })

    it('should exclude deleted transactions from calculations', () => {
      const deletedITransaction: UITransaction = {
        id: 'tx-deleted',
        title: 'Deleted Expense',
        _titleLower: 'deleted expense',
        amount: 100000n,
        type: 'expense',
        category_id: 'cat-food',
        wallet_id: 'IWallet-1',
        date: '2026-04-10',
        _dateKey: '2026-04-10',
        _timestamp: 1712707200000,
        user_id: 'user-1',
        tags: [],
        sync_status: 'synced',
        created_at: '2026-04-10T00:00:00Z',
        client_updated_at: '2026-04-10T00:00:00Z',
        version: 1,
        deleted: true, // Deleted
      }

      const transactionsRef = ref([...mocktransactions, deletedITransaction] as unknown as ITransaction[])
      const categoryMap = mockCategoryMap

      const { totalExpense, monthlyBalance } = useTransactionStats(transactionsRef, () => ref(categoryMap))

      // Should not include the deleted 100000n expense
      expect(totalExpense.value).toBe(195)
      expect(monthlyBalance.value).toBe(4805)
    })

    it('should calculate top categories correctly', () => {
      const transactionsRef = ref(mocktransactions as unknown as ITransaction[])
      const categoryMap = mockCategoryMap

      const { topCategories } = useTransactionStats(transactionsRef, () => ref(categoryMap))

      // Should have categories (expense categories sorted by total)
      expect(topCategories.value.length).toBeGreaterThan(0)
      // Each category should have required properties
      topCategories.value.forEach((cat) => {
        expect(cat).toHaveProperty('id')
        expect(cat).toHaveProperty('name')
        expect(cat).toHaveProperty('total')
        expect(cat).toHaveProperty('percent')
      })
      // Should be sorted by total (descending)
      if (topCategories.value.length > 1) {
        expect(topCategories.value[0].total).toBeGreaterThanOrEqual(topCategories.value[1].total)
      }
    })

    it('should calculate category percentages correctly', () => {
      const transactionsRef = ref(mocktransactions as unknown as ITransaction[])
      const categoryMap = mockCategoryMap

      const { topCategories } = useTransactionStats(transactionsRef, () => ref(categoryMap))

      // Percentages should sum to 100
      const totalPercent = topCategories.value.reduce((sum, cat) => sum + cat.percent, 0)
      expect(totalPercent).toBeCloseTo(100, 0)

      // Food has higher amount, so higher percentage
      expect(topCategories.value[0].percent).toBeGreaterThan(topCategories.value[1].percent)
    })

    it('should handle empty ITransaction list', () => {
      const transactionsRef = ref([] as ITransaction[])
      const categoryMap = mockCategoryMap

      const { totalIncome, totalExpense, monthlyBalance, topCategories } = useTransactionStats(
        transactionsRef,
        () => ref(categoryMap),
      )

      expect(totalIncome.value).toBe(0)
      expect(totalExpense.value).toBe(0)
      expect(monthlyBalance.value).toBe(0)
      expect(topCategories.value).toHaveLength(0)
    })

    it('should handle transactions with only income', () => {
      const incomeOnly = mocktransactions.filter((t) => t.type === 'income')
      const transactionsRef = ref(incomeOnly as unknown as ITransaction[])
      const categoryMap = mockCategoryMap

      const { totalIncome, totalExpense, monthlyBalance, topCategories } = useTransactionStats(
        transactionsRef,
        () => ref(categoryMap),
      )

      expect(totalIncome.value).toBe(5000)
      expect(totalExpense.value).toBe(0)
      expect(monthlyBalance.value).toBe(5000)
      expect(topCategories.value).toHaveLength(0) // No expenses, so no top categories
    })

    it('should handle transactions with only expenses', () => {
      const expenseOnly = mocktransactions.filter((t) => t.type === 'expense')
      const transactionsRef = ref(expenseOnly as unknown as ITransaction[])
      const categoryMap = mockCategoryMap

      const { totalIncome, totalExpense, monthlyBalance } = useTransactionStats(
        transactionsRef,
        () => ref(categoryMap),
      )

      expect(totalIncome.value).toBe(0)
      expect(totalExpense.value).toBe(195)
      expect(monthlyBalance.value).toBe(-195)
    })
  })
})
