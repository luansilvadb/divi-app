import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, computed } from 'vue'
import { useTransactionSearch } from '../../application/stores/useTransactionSearch'
import { useTransactionGrouping } from '../../application/stores/useTransactionGrouping'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import type { Category } from '@/shared/domain/entities/Category'

type UITransaction = Transaction & { _titleLower: string; _timestamp: number; _dateKey: string }

describe('Transaction Filtering and Grouping', () => {
  describe('useTransactionSearch', () => {
    let mockTransactions: UITransaction[]
    let mockCategoryMap: Record<string, Category>

    beforeEach(() => {
      mockTransactions = [
        {
          id: 'tx-1',
          title: 'Grocery Shopping',
          _titleLower: 'grocery shopping',
          amount: 15000n,
          type: 'expense',
          category_id: 'cat-food',
          wallet_id: 'wallet-1',
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
          id: 'tx-2',
          title: 'Netflix Subscription',
          _titleLower: 'netflix subscription',
          amount: 4500n,
          type: 'expense',
          category_id: 'cat-entertainment',
          wallet_id: 'wallet-1',
          date: '2026-04-14',
          _dateKey: '2026-04-14',
          _timestamp: 1713052800000,
          user_id: 'user-1',
          tags: [],
          sync_status: 'synced',
          created_at: '2026-04-14T00:00:00Z',
          client_updated_at: '2026-04-14T00:00:00Z',
          version: 1,
          deleted: false,
        },
        {
          id: 'tx-3',
          title: 'Salary',
          _titleLower: 'salary',
          amount: 500000n,
          type: 'income',
          category_id: 'cat-income',
          wallet_id: 'wallet-1',
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
      ]

      mockCategoryMap = {
        'cat-food': { id: 'cat-food', name: 'Food & Groceries', color: '#10b981', icon: 'shopping' },
        'cat-entertainment': { id: 'cat-entertainment', name: 'Entertainment', color: '#8b5cf6', icon: 'movie' },
        'cat-income': { id: 'cat-income', name: 'Income', color: '#3b82f6', icon: 'wallet' },
      }
    })

    it('should return all transactions when search query is empty', () => {
      const activeTransactions = computed(() => mockTransactions)
      const categoryMap = ref(mockCategoryMap)

      const { filteredTransactions } = useTransactionSearch(activeTransactions, categoryMap)

      expect(filteredTransactions.value).toHaveLength(3)
    })

    it('should filter transactions by title', () => {
      const activeTransactions = computed(() => mockTransactions)
      const categoryMap = ref(mockCategoryMap)

      const { searchQuery, filteredTransactions } = useTransactionSearch(activeTransactions, categoryMap)
      searchQuery.value = 'grocery'

      expect(filteredTransactions.value).toHaveLength(1)
      expect(filteredTransactions.value[0].title).toBe('Grocery Shopping')
    })

    it('should filter transactions by category name', () => {
      const activeTransactions = computed(() => mockTransactions)
      const categoryMap = ref(mockCategoryMap)

      const { searchQuery, filteredTransactions } = useTransactionSearch(activeTransactions, categoryMap)
      searchQuery.value = 'entertainment'

      expect(filteredTransactions.value).toHaveLength(1)
      expect(filteredTransactions.value[0].title).toBe('Netflix Subscription')
    })

    it('should be case insensitive when filtering', () => {
      const activeTransactions = computed(() => mockTransactions)
      const categoryMap = ref(mockCategoryMap)

      const { searchQuery, filteredTransactions } = useTransactionSearch(activeTransactions, categoryMap)
      searchQuery.value = 'NETFLIX'

      expect(filteredTransactions.value).toHaveLength(1)
      expect(filteredTransactions.value[0].title).toBe('Netflix Subscription')
    })

    it('should return empty array when no matches found', () => {
      const activeTransactions = computed(() => mockTransactions)
      const categoryMap = ref(mockCategoryMap)

      const { searchQuery, filteredTransactions } = useTransactionSearch(activeTransactions, categoryMap)
      searchQuery.value = 'nonexistent'

      expect(filteredTransactions.value).toHaveLength(0)
    })

    it('should handle partial matches', () => {
      const activeTransactions = computed(() => mockTransactions)
      const categoryMap = ref(mockCategoryMap)

      const { searchQuery, filteredTransactions } = useTransactionSearch(activeTransactions, categoryMap)
      searchQuery.value = 'sub'

      expect(filteredTransactions.value).toHaveLength(1)
      expect(filteredTransactions.value[0].title).toBe('Netflix Subscription')
    })

    it('should clear search and return all transactions', () => {
      const activeTransactions = computed(() => mockTransactions)
      const categoryMap = ref(mockCategoryMap)

      const { searchQuery, filteredTransactions, clearSearch } = useTransactionSearch(
        activeTransactions,
        categoryMap,
      )

      searchQuery.value = 'grocery'
      expect(filteredTransactions.value).toHaveLength(1)

      clearSearch()
      expect(filteredTransactions.value).toHaveLength(3)
    })
  })

  describe('useTransactionGrouping', () => {
    it('should group transactions by date key', () => {
      const mockTransactions: UITransaction[] = [
        {
          id: 'tx-1',
          title: 'Lunch',
          _titleLower: 'lunch',
          amount: 2500n,
          type: 'expense',
          category_id: 'cat-1',
          wallet_id: 'wallet-1',
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
          id: 'tx-2',
          title: 'Dinner',
          _titleLower: 'dinner',
          amount: 3500n,
          type: 'expense',
          category_id: 'cat-1',
          wallet_id: 'wallet-1',
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
          title: 'Coffee',
          _titleLower: 'coffee',
          amount: 500n,
          type: 'expense',
          category_id: 'cat-1',
          wallet_id: 'wallet-1',
          date: '2026-04-14',
          _dateKey: '2026-04-14',
          _timestamp: 1713052800000,
          user_id: 'user-1',
          tags: [],
          sync_status: 'synced',
          created_at: '2026-04-14T00:00:00Z',
          client_updated_at: '2026-04-14T00:00:00Z',
          version: 1,
          deleted: false,
        },
      ]

      const filteredTransactions = computed(() => mockTransactions)
      const { groupedTransactions } = useTransactionGrouping(filteredTransactions)

      const groups = groupedTransactions.value

      expect(Object.keys(groups)).toHaveLength(2)
      expect(groups['2026-04-15'].items).toHaveLength(2)
      expect(groups['2026-04-14'].items).toHaveLength(1)
    })

    it('should calculate group totals correctly', () => {
      const mockTransactions: UITransaction[] = [
        {
          id: 'tx-1',
          title: 'Income',
          _titleLower: 'income',
          amount: 500000n,
          type: 'income',
          category_id: 'cat-1',
          wallet_id: 'wallet-1',
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
          id: 'tx-2',
          title: 'Expense',
          _titleLower: 'expense',
          amount: 15000n,
          type: 'expense',
          category_id: 'cat-1',
          wallet_id: 'wallet-1',
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
      ]

      const filteredTransactions = computed(() => mockTransactions)
      const { groupedTransactions } = useTransactionGrouping(filteredTransactions)

      const group = groupedTransactions.value['2026-04-15']

      expect(group.total).toBe(4850) // 5000 - 150 = 4850
      expect(group.items).toHaveLength(2)
    })

    it('should handle empty transaction list', () => {
      const filteredTransactions = computed(() => [] as UITransaction[])
      const { groupedTransactions } = useTransactionGrouping(filteredTransactions)

      expect(Object.keys(groupedTransactions.value)).toHaveLength(0)
    })
  })
})
