import { defineStore } from 'pinia'
import { ref, shallowRef, computed, watch } from 'vue' // watch adicionado
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import { useSyncStore } from '@/core/sync/syncStore' // SyncStore importada
import { useAuthStore } from '@/modules/auth/application/authStore'
import type { ITransactionRepository } from '@/shared/domain/contracts/ITransactionRepository'
import type { IWalletRepository } from '@/shared/domain/contracts/IWalletRepository'
import type { ICategoryRepository } from '@/shared/domain/contracts/ICategoryRepository'
import type { IActivityLogService } from '@/modules/activity-log/domain/contracts/IActivityLogService'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import type { Wallet } from '@/shared/domain/entities/Wallet'
import type { Category } from '@/shared/domain/entities/Category'

type UITransaction = Transaction & { _titleLower: string; _timestamp: number; _dateKey: string }

export const useTransactionStore = defineStore('transactions', () => {
  // Repositories
  const transactionRepo = container.resolve<ITransactionRepository>(DI_TOKENS.TransactionRepository)
  const walletRepo = container.resolve<IWalletRepository>(DI_TOKENS.WalletRepository)
  const categoryRepo = container.resolve<ICategoryRepository>(DI_TOKENS.CategoryRepository)
  const activityLogService = container.resolve<IActivityLogService>(DI_TOKENS.ActivityLogService)
  const syncStore = useSyncStore()
  const authStore = useAuthStore()

  // State
  const transactions = shallowRef<Transaction[]>([])
  const wallets = shallowRef<Wallet[]>([])
  const categories = shallowRef<Category[]>([])
  const isLoading = ref(false)
  
  // RASTREIO DE CONTEXTO: Guarda o que a UI está vendo no momento
  const currentYear = ref(new Date().getFullYear())
  const currentMonth = ref(new Date().getMonth() + 1)

  // ... (GAPS: manter getters e outras refs)

  async function fetchTransactionsByMonth(year: number, month: number) {
    isLoading.value = true
    currentYear.value = year
    currentMonth.value = month
    
    try {
      const raw = await transactionRepo.getByMonth(year, month)
      raw.sort((a, b) => {
        const timeA = (a as UITransaction)._timestamp
        const timeB = (b as UITransaction)._timestamp
        return timeB - timeA
      })
      transactions.value = [...raw]
    } finally {
      isLoading.value = false
    }
  }

  // REATIVIDADE AUTOMÁTICA: 
  // Sempre que o SyncEngine notificar que "algo mudou fisicamente no banco",
  // nós refazemos a busca local para manter a UI em dia com o Supabase.
  watch(() => syncStore.updateCounter, () => {
    console.log('[TransactionStore] Re-buscando dados devido a mudança no Sync...')
    fetchTransactionsByMonth(currentYear.value, currentMonth.value)
  })

  // UI State
  const searchQuery = ref('')

  // Maps for O(1) Lookups
  const categoryMap = shallowRef<Record<string, Category>>({})
  const walletMap = shallowRef<Record<string, Wallet>>({})


  // 2. GETTERS DERIVADOS (O que a UI realmente consome)
  // A UI NUNCA usa o array 'transactions' diretamente para exibição.
  const activeTransactions = computed(() => {
    return (transactions.value as UITransaction[]).filter(t => !t.deleted)
  })

  // Gráficos e Saldos derivam de activeTransactions.
  const totalIncome = computed(() => {
    let inc = 0
    const trans = activeTransactions.value
    for (let i = 0, len = trans.length; i < len; i++) {
      if (trans[i]?.type === 'income') inc += trans[i]!.amount
    }
    return inc
  })

  const totalExpense = computed(() => {
    let exp = 0
    const trans = activeTransactions.value
    for (let i = 0, len = trans.length; i < len; i++) {
      if (trans[i]?.type === 'expense') exp += trans[i]!.amount
    }
    return exp
  })

  const monthlyBalance = computed(() => totalIncome.value - totalExpense.value)

  const filteredTransactionsArray = computed(() => {
    if (!searchQuery.value.trim()) return activeTransactions.value

    const query = searchQuery.value.toLowerCase().trim()
    const result: UITransaction[] = []
    const trans = activeTransactions.value
    const catMap = categoryMap.value

    for (let i = 0, len = trans.length; i < len; i++) {
      const t = trans[i]!
      if (t._titleLower.includes(query)) {
        result.push(t)
        continue
      }

      const cat = catMap[t.category_id]
      if (cat && cat.name.toLowerCase().includes(query)) {
        result.push(t)
      }
    }

    return result
  })

  const groupedTransactions = computed(() => {
    const groups: Record<string, { total: number; items: UITransaction[] }> = {}
    const source = filteredTransactionsArray.value

    for (let i = 0, len = source.length; i < len; i++) {
      const t = source[i]!
      const dateKey = t._dateKey
      if (dateKey) {
        let group = groups[dateKey]
        if (!group) {
          group = { total: 0, items: [] }
          groups[dateKey] = group
        }
        group.items.push(t)
        group.total += t.type === 'income' ? t.amount : -t.amount
      }
    }

    return groups
  })

  // Actions
  async function fetchWallets() {
    const w = await walletRepo.getAll()
    wallets.value = w
    const map: Record<string, Wallet> = {}
    for (let i = 0, len = w.length; i < len; i++) {
      const item = w[i]!
      map[item.id] = item
    }
    walletMap.value = map
  }

  async function fetchCategories() {
    const c = await categoryRepo.getAll()
    categories.value = c
    const map: Record<string, Category> = {}
    for (let i = 0, len = c.length; i < len; i++) {
      const item = c[i]!
      map[item.id] = item
    }
    categoryMap.value = map
  }

  async function saveTransaction(transaction: Transaction) {
    // 1. Validação de Domínio (Previne "gohorse")
    if (transaction.amount < 0) {
      throw new Error('Amount must be positive')
    }

    // 2. Refinamento de Dados (Garante ID e User)
    const activeUserId = authStore.user?.id
    if (!activeUserId) throw new Error('User not authenticated')

    const enriched: Transaction = {
      ...transaction,
      id: transaction.id || crypto.randomUUID(),
      user_id: transaction.user_id || activeUserId,
      date: transaction.date || new Date().toISOString().slice(0, 10),
      sync_status: 'pending',
      deleted: false,
      client_updated_at: new Date().toISOString(),
      version: transaction.version || 1
    }

    // 3. ATUALIZAÇÃO OTIMISTA
    const index = transactions.value.findIndex((t) => t.id === enriched.id)
    const isNew = index === -1
    const newArray = [...transactions.value]
    if (!isNew) {
      newArray[index] = enriched
    } else {
      newArray.unshift(enriched)
    }
    transactions.value = newArray

    try {
      // 4. Persistência Local (Dexie)
      await transactionRepo.save(enriched)
      
      // 5. Audit Log (Automatizado)
      await activityLogService.logActivity({
        action: isNew ? 'Nova Transação' : 'Transação Atualizada',
        description: `R$ ${Math.abs(enriched.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} : ${enriched.title}`,
        type: 'success',
        user_id: activeUserId
      })

      // 6. Refetch para garantir integridade
      const date = new Date(enriched.date)
      await fetchTransactionsByMonth(date.getFullYear(), date.getMonth() + 1)
    } catch (err) {
      console.error('Erro ao salvar transação:', err)
      await fetchTransactionsByMonth(currentYear.value, currentMonth.value)
      throw err
    }
  }

  async function deleteTransaction(id: string) {
    // 1. ATUALIZAÇÃO OTIMISTA (Instantânea na Memória)
    const index = transactions.value.findIndex((t) => t.id === id)
    let deletedTitle = 'Desconhecida'
    if (index !== -1) {
      const target = transactions.value[index]!
      deletedTitle = target.title
      const newArray = [...transactions.value]
      newArray[index] = { ...target, deleted: true, sync_status: 'pending', client_updated_at: new Date().toISOString() }
      transactions.value = newArray
    }

    try {
      // 2. Persistência Local (Soft-Delete)
      await transactionRepo.delete(id)

      // 3. Audit Log
      if (authStore.user?.id) {
        await activityLogService.logActivity({
          action: 'Transação Removida',
          description: `Remoção da transação: ${deletedTitle}`,
          type: 'warning',
          user_id: authStore.user.id
        })
      }
    } catch (err) {
      console.error('Erro ao deletar transação:', err)
      await fetchTransactionsByMonth(currentYear.value, currentMonth.value)
      throw err
    }
  }

  // Top Categories Single Pass
  const topCategories = computed(() => {
    const catMap: Record<string, number> = {}
    const trans = activeTransactions.value

    for (let i = 0, len = trans.length; i < len; i++) {
      const t = trans[i]!
      if (t.type === 'expense') {
        catMap[t.category_id] = (catMap[t.category_id] || 0) + t.amount
      }
    }

    const expenseTotal = totalExpense.value
    if (expenseTotal === 0) return []

    return Object.entries(catMap)
      .map(([id, total]) => {
        const cat = categoryMap.value[id]
        return {
          id,
          name: cat?.name || 'Outros',
          color: cat?.color || '#9ca3af',
          total,
          percent: (total / expenseTotal) * 100,
        }
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  })

  return {
    transactions,
    wallets,
    categories,
    isLoading,
    searchQuery,
    categoryMap,
    walletMap,
    totalIncome,
    totalExpense,
    monthlyBalance,
    topCategories,
    groupedTransactions,
    fetchWallets,
    fetchCategories,
    fetchTransactionsByMonth,
    saveTransaction,
    deleteTransaction,
  }
})
