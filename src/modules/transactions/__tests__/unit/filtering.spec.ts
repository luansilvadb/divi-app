import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, computed } from 'vue'
import { useTransactionSearch } from '../../application/stores/useTransactionSearch'
import { useITransactionGrouping } from '../../application/stores/useITransactionGrouping'
import type { ITransaction } from '@/modules/transactions/core/entities/ITransaction'
import type { ICategory } from '@/modules/categories/core/entities/ICategory'

type UITransaction = any

describe('ITransaction Filtering and Grouping', () => {
  describe('usetransactionsearch', () => {
    let mocktransactions: UITransaction[]
    let mockCategoryMap: Record<string, ICategory>

    beforeEach(() => {
      mocktransactions = [
        {
          id: 'tx-1',
          title: 'Grocery Shopping',
          _titleLower: 'grocery shopping',
          amount: 15000n,
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
          id: 'tx-2',
          title: 'Netflix ISubscription',
          _titleLower: 'netflix subscription',
          amount: 4500n,
          type: 'expense',
          category_id: 'cat-entertainment',
          wallet_id: 'IWallet-1',
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
      ]

      mockCategoryMap = {
        'cat-food': { id: 'cat-food', name: 'Food & Groceries', color: '#10b981', icon: 'shopping' },
        'cat-entertainment': { id: 'cat-entertainment', name: 'Entertainment', color: '#8b5cf6', icon: 'movie' },
        'cat-income': { id: 'cat-income', name: 'Income', color: '#3b82f6', icon: 'IWallet' },
      }
    })

    it('should return all transactions when search query is empty', () => {
      const activetransactions = computed(() => mocktransactions)
      const categoryMap = ref(mockCategoryMap)

      const { filteredtransactions } = useTransactionSearch(activetransactions, categoryMap)

      expect(filteredtransactions.value).toHaveLength(3)
    })

    it('should filter transactions by title', () => {
      const activetransactions = computed(() => mocktransactions)
      const categoryMap = ref(mockCategoryMap)

      const { searchQuery, filteredtransactions } = useTransactionSearch(activetransactions, categoryMap)
      searchQuery.value = 'grocery'

      expect(filteredtransactions.value).toHaveLength(1)
      expect(filteredtransactions.value[0].title).toBe('Grocery Shopping')
    })

    it('should filter transactions by category name', () => {
      const activetransactions = computed(() => mocktransactions)
      const categoryMap = ref(mockCategoryMap)

      const { searchQuery, filteredtransactions } = useTransactionSearch(activetransactions, categoryMap)
      searchQuery.value = 'entertainment'

      expect(filteredtransactions.value).toHaveLength(1)
      expect(filteredtransactions.value[0].title).toBe('Netflix ISubscription')
    })

    it('should be case insensitive when filtering', () => {
      const activetransactions = computed(() => mocktransactions)
      const categoryMap = ref(mockCategoryMap)

      const { searchQuery, filteredtransactions } = useTransactionSearch(activetransactions, categoryMap)
      searchQuery.value = 'NETFLIX'

      expect(filteredtransactions.value).toHaveLength(1)
      expect(filteredtransactions.value[0].title).toBe('Netflix ISubscription')
    })

    it('should return empty array when no matches found', () => {
      const activetransactions = computed(() => mocktransactions)
      const categoryMap = ref(mockCategoryMap)

      const { searchQuery, filteredtransactions } = useTransactionSearch(activetransactions, categoryMap)
      searchQuery.value = 'nonexistent'

      expect(filteredtransactions.value).toHaveLength(0)
    })

    it('should handle partial matches', () => {
      const activetransactions = computed(() => mocktransactions)
      const categoryMap = ref(mockCategoryMap)

      const { searchQuery, filteredtransactions } = useTransactionSearch(activetransactions, categoryMap)
      searchQuery.value = 'sub'

      expect(filteredtransactions.value).toHaveLength(1)
      expect(filteredtransactions.value[0].title).toBe('Netflix ISubscription')
    })

    it('should clear search and return all transactions', () => {
      const activetransactions = computed(() => mocktransactions)
      const categoryMap = ref(mockCategoryMap)

      const { searchQuery, filteredtransactions, clearSearch } = useTransactionSearch(
        activetransactions,
        categoryMap,
      )

      searchQuery.value = 'grocery'
      expect(filteredtransactions.value).toHaveLength(1)

      clearSearch()
      expect(filteredtransactions.value).toHaveLength(3)
    })
  })

  describe('useITransactionGrouping', () => {
    it('should group transactions by date key', () => {
      const mocktransactions: UITransaction[] = [
        {
          id: 'tx-1',
          title: 'Lunch',
          _titleLower: 'lunch',
          amount: 2500n,
          type: 'expense',
          category_id: 'cat-1',
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
          id: 'tx-2',
          title: 'Dinner',
          _titleLower: 'dinner',
          amount: 3500n,
          type: 'expense',
          category_id: 'cat-1',
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
          title: 'Coffee',
          _titleLower: 'coffee',
          amount: 500n,
          type: 'expense',
          category_id: 'cat-1',
          wallet_id: 'IWallet-1',
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

      const filteredtransactions = computed(() => mocktransactions)
      const { groupedtransactions } = useITransactionGrouping(filteredtransactions)

      const groups = groupedtransactions.value

      expect(Object.keys(groups)).toHaveLength(2)
      expect(groups['2026-04-15'].items).toHaveLength(2)
      expect(groups['2026-04-14'].items).toHaveLength(1)
    })

    it('should calculate group totals correctly', () => {
      const mocktransactions: UITransaction[] = [
        {
          id: 'tx-1',
          title: 'Income',
          _titleLower: 'income',
          amount: 500000n,
          type: 'income',
          category_id: 'cat-1',
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
          id: 'tx-2',
          title: 'Expense',
          _titleLower: 'expense',
          amount: 15000n,
          type: 'expense',
          category_id: 'cat-1',
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
      ]

      const filteredtransactions = computed(() => mocktransactions)
      const { groupedtransactions } = useITransactionGrouping(filteredtransactions)

      const group = groupedtransactions.value['2026-04-15']

      expect(group.total).toBe(4850) // 5000 - 150 = 4850
      expect(group.items).toHaveLength(2)
    })

    it('should handle empty ITransaction list', () => {
      const filteredtransactions = computed(() => [] as UITransaction[])
      const { groupedtransactions } = useITransactionGrouping(filteredtransactions)

      expect(Object.keys(groupedtransactions.value)).toHaveLength(0)
    })
  })
})
