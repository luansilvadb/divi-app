import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'

export const useCalendarStore = defineStore('calendar', () => {
  const transactionStore = useTransactionStore()

  const currentDate = ref(new Date())
  const selectedDate = ref(new Date())

  const currentMonth = computed(() => currentDate.value.getMonth())
  const currentYear = computed(() => currentDate.value.getFullYear())

  const monthName = computed(() => {
    return currentDate.value.toLocaleString('pt-BR', { month: 'long' })
  })

  // Group transactions by date string (YYYY-MM-DD) for O(1) lookup in the calendar grid
  const transactionsByDate = computed(() => {
    const map = new Map<string, typeof transactionStore.transactions[0][]>()

    for (let i = 0, len = transactionStore.transactions.length; i < len; i++) {
      const t = transactionStore.transactions[i]!
      // Try to use precalculated _dateKey, fallback to string slicing
      const dateKey = (t as typeof transactionStore.transactions[0] & { _dateKey?: string })._dateKey || t.date.substring(0, 10)

      const existing = map.get(dateKey)
      if (existing) {
        existing.push(t)
      } else {
        map.set(dateKey, [t])
      }
    }

    return map
  })

  const getTransactionsForDate = (date: Date) => {
    // Format date to local YYYY-MM-DD to match transactions _dateKey
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateKey = `${year}-${month}-${day}`

    return transactionsByDate.value.get(dateKey) || []
  }

  const selectedDateTransactions = computed(() => getTransactionsForDate(selectedDate.value))

  // Single pass calculation for O(N) instead of O(2N)
  const selectedDateTotals = computed(() => {
    let income = 0
    let expense = 0
    const txs = selectedDateTransactions.value

    for (let i = 0, len = txs.length; i < len; i++) {
      const t = txs[i]!
      if (t.type === 'income') {
        income += t.amount
      } else if (t.type === 'expense') {
        expense += t.amount
      }
    }

    return { income, expense, balance: income - expense }
  })

  const selectedDateIncome = computed(() => selectedDateTotals.value.income)
  const selectedDateExpense = computed(() => selectedDateTotals.value.expense)
  const selectedDateBalance = computed(() => selectedDateTotals.value.balance)

  // Actions
  function selectDate(date: Date) {
    selectedDate.value = date
  }

  function setMonth(year: number, month: number) {
    currentDate.value = new Date(year, month, 1)
  }

  function prevMonth() {
    setMonth(currentYear.value, currentMonth.value - 1)
  }

  function nextMonth() {
    setMonth(currentYear.value, currentMonth.value + 1)
  }

  // Helpers
  function isToday(date: Date) {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  function isSelected(date: Date) {
    return (
      date.getDate() === selectedDate.value.getDate() &&
      date.getMonth() === selectedDate.value.getMonth() &&
      date.getFullYear() === selectedDate.value.getFullYear()
    )
  }

  return {
    currentDate,
    selectedDate,
    currentMonth,
    currentYear,
    monthName,
    selectedDateTransactions,
    selectedDateIncome,
    selectedDateExpense,
    selectedDateBalance,
    selectDate,
    prevMonth,
    nextMonth,
    getTransactionsForDate,
    isToday,
    isSelected
  }
})
