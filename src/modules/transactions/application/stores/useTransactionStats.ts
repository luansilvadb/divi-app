import { computed, type Ref } from 'vue'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import type { Category } from '@/shared/domain/entities/Category'

type UITransaction = any

export function useTransactionStats(
  transactions: Ref<Transaction[]>,
  categoryMap: Ref<Record<string, Category>> | (() => Ref<Record<string, Category>>),
) {
  const categoryMapRef = computed(() => (typeof categoryMap === 'function' ? categoryMap() : categoryMap))

  const activeTransactions = computed(() => {
    return (transactions.value as UITransaction[]).filter((t) => !t.deleted)
  })

  const totalIncome = computed(() => {
    let inc = 0n
    const trans = activeTransactions.value
    for (let i = 0, len = trans.length; i < len; i++) {
      if (trans[i]?.type === 'income') inc += BigInt(trans[i]!.amount)
    }
    return Number(inc) / 100
  })

  const totalExpense = computed(() => {
    let exp = 0n
    const trans = activeTransactions.value
    for (let i = 0, len = trans.length; i < len; i++) {
      if (trans[i]?.type === 'expense') exp += BigInt(trans[i]!.amount)
    }
    return Number(exp) / 100
  })

  const monthlyBalance = computed(() => totalIncome.value - totalExpense.value)

  const topCategories = computed(() => {
    const catMap: Record<string, bigint> = {}
    const trans = activeTransactions.value

    for (let i = 0, len = trans.length; i < len; i++) {
      const t = trans[i]!
      if (t.type === 'expense') {
        catMap[t.category_id] = (catMap[t.category_id] || 0n) + BigInt(t.amount)
      }
    }

    const expenseTotalNum = totalExpense.value
    if (expenseTotalNum === 0) return []

    const mapValue = (categoryMapRef as unknown as { value: Record<string, Category> }).value
    return Object.entries(catMap)
      .map(([id, totalBig]) => {
        const cat = mapValue[id]
        const total = Number(totalBig) / 100
        return {
          id,
          name: cat?.name || 'Outros',
          color: cat?.color || '#9ca3af',
          total,
          percent: (total / expenseTotalNum) * 100,
        }
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  })

  return {
    activeTransactions,
    totalIncome,
    totalExpense,
    monthlyBalance,
    topCategories,
  }
}
