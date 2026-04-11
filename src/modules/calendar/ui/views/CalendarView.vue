<template>
  <StandardPageLayout
    title="Calendário Financeiro"
    highlight="Calendário"
    subtitle="Visualize seus compromissos e transações em uma linha do tempo mensal."
  >
    <template #action>
      <BaseMonthSwitcher :month="monthName" @prev="prevMonth" @next="nextMonth" />
    </template>

    <div class="view-content-grid">
      <!-- MAIN COLUMN: Calendar -->
      <main class="main-column">
        <div class="glass-card p-6 shadow-sm overflow-hidden bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
          <!-- Weekdays Header -->
          <div class="grid grid-cols-7 mb-4">
            <div
              v-for="day in ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']"
              :key="day"
              class="text-center text-[10px] font-black uppercase tracking-widest text-zinc-400 py-2"
            >
              {{ day }}
            </div>
          </div>

          <!-- Days Grid -->
          <div class="grid grid-cols-7 gap-3">
            <div
              v-for="day in calendarDays"
              :key="day.date.toISOString()"
              class="relative aspect-square rounded-2xl p-2 border border-transparent transition-all duration-300 flex flex-col items-center cursor-pointer group"
              :class="[
                day.isCurrentMonth
                  ? 'bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                  : 'opacity-20 cursor-default',
                isSelected(day.date)
                  ? 'ring-2 ring-violet-500/40 border-violet-500/20 bg-white dark:bg-zinc-800 shadow-lg'
                  : '',
              ]"
              @click="day.isCurrentMonth && selectDate(day.date)"
            >
              <span
                class="text-sm font-black w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300"
                :class="
                  isToday(day.date)
                    ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20 scale-110'
                    : 'text-zinc-800 dark:text-zinc-50'
                "
              >
                {{ day.dayNumber }}
              </span>

              <!-- Event Dots -->
              <div
                class="mt-auto flex gap-1 flex-wrap justify-center max-w-full overflow-hidden pb-1"
              >
                <div
                  v-for="(t, i) in getTransactionsForDate(day.date).slice(0, 3)"
                  :key="t.id || i"
                  class="w-1.5 h-1.5 rounded-full shadow-sm"
                  :class="t.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'"
                ></div>
                <span
                  v-if="getTransactionsForDate(day.date).length > 3"
                  class="text-[8px] font-black text-zinc-400"
                >
                  +{{ getTransactionsForDate(day.date).length - 3 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- SIDEBAR COLUMN: Day Details -->
      <aside class="side-column">
        <BaseCard class="hover-glow">
          <template #header>
            <div class="flex flex-col gap-1">
              <span class="text-zinc-800 dark:text-zinc-50">Atividade do Dia</span>
              <span
                class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                >{{ formatDateFull(selectedDate) }}</span
              >
            </div>
          </template>

          <div
            v-if="selectedDateTransactions.length === 0"
            class="flex flex-col items-center justify-center py-16 opacity-40 text-center"
          >
            <i class="i-lucide-calendar-x text-4xl text-zinc-400 mb-4"></i>
            <span class="text-[10px] font-black uppercase tracking-widest">Nenhuma transação</span>
          </div>

          <ul v-else class="list-none p-0 m-0 flex flex-col gap-2 pt-2">
            <li
              v-for="t in selectedDateTransactions"
              :key="t.id || t.localId"
              class="flex items-center gap-4 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            >
              <BaseIconBox
                :color="t.type === 'expense' ? '#ef4444' : '#10b981'"
                size="sm"
              >
                <i :class="t.type === 'expense' ? 'i-lucide-arrow-down' : 'i-lucide-arrow-up'" class="text-sm"></i>
              </BaseIconBox>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-sm text-zinc-800 dark:text-zinc-50 truncate">
                  {{ t.title }}
                </div>
                <div
                  class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                >
                  {{ store.categoryMap[t.category_id]?.name || 'Geral' }}
                </div>
              </div>
              <span
                class="font-black text-sm tracking-tighter"
                :class="t.type === 'expense' ? 'text-red-500' : 'text-emerald-500'"
              >
                {{ formatCurrency(t.amount) }}
              </span>
            </li>
          </ul>
        </BaseCard>

        <!-- Day Summary -->
        <BaseCard v-if="selectedDateTransactions.length > 0" class="hover-glow">
          <template #header>Resumo do Dia</template>
          <div class="flex flex-col gap-6 pt-2">
            <BaseSummaryItem
              label="Entradas"
              :value="formatCurrency(selectedDateIncome)"
              color="#10b981"
              status="success"
            >
              <template #icon><i class="i-lucide-arrow-up-circle"></i></template>
            </BaseSummaryItem>
            <BaseSummaryItem
              label="Saídas"
              :value="formatCurrency(selectedDateExpense)"
              color="#ef4444"
              status="error"
            >
              <template #icon><i class="i-lucide-arrow-down-circle"></i></template>
            </BaseSummaryItem>

            <div class="h-px bg-zinc-100 dark:bg-zinc-800/50"></div>

            <div
              class="w-full p-5 rounded-3xl bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center text-center shadow-inner border border-zinc-200 dark:border-zinc-800"
            >
              <span
                class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2"
                >Saldo do Dia</span
              >
              <div
                class="text-3xl font-black tracking-tighter"
                :class="selectedDateBalance >= 0 ? 'text-violet-500' : 'text-red-500'"
              >
                {{ formatCurrency(Math.abs(selectedDateBalance)) }}
              </div>
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import BaseMonthSwitcher from '@/shared/components/molecules/BaseMonthSwitcher.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'

const store = useTransactionStore()

const currentDate = ref(new Date())
const selectedDate = ref(new Date())

const currentMonth = computed(() => currentDate.value.getMonth())
const currentYear = computed(() => currentDate.value.getFullYear())

const monthName = computed(() => {
  return currentDate.value.toLocaleString('pt-BR', { month: 'long' }).replace(/^\w/, (c) => c.toUpperCase())
})

onMounted(async () => {
  if (Object.keys(store.categoryMap).length === 0) await store.fetchCategories()
  await fetchMonthData()
})

const fetchMonthData = async () => {
  await store.fetchTransactionsByMonth(currentYear.value, currentMonth.value + 1)
}

const prevMonth = async () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
  await fetchMonthData()
}

const nextMonth = async () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
  await fetchMonthData()
}

const selectDate = (date: Date) => {
  selectedDate.value = date
}

const calendarDays = computed(() => {
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1)
  const lastDayOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0)
  const days = []

  const startPadding = firstDayOfMonth.getDay()
  for (let i = startPadding - 1; i >= 0; i--) {
    const d = new Date(currentYear.value, currentMonth.value, -i)
    days.push({ date: d, isCurrentMonth: false, dayNumber: d.getDate() })
  }

  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const d = new Date(currentYear.value, currentMonth.value, i)
    days.push({ d: d, date: d, isCurrentMonth: true, dayNumber: i })
  }

  const endPadding = 42 - days.length
  for (let i = 1; i <= endPadding; i++) {
    const d = new Date(currentYear.value, currentMonth.value + 1, i)
    days.push({ date: d, isCurrentMonth: false, dayNumber: d.getDate() })
  }

  return days
})

const getTransactionsForDate = (date: Date) => {
  return store.transactions.filter((t) => {
    const tDate = new Date(t.date)
    return (
      tDate.getDate() === date.getDate() &&
      tDate.getMonth() === date.getMonth() &&
      tDate.getFullYear() === date.getFullYear()
    )
  })
}

const selectedDateTransactions = computed(() => getTransactionsForDate(selectedDate.value))
const selectedDateIncome = computed(() =>
  selectedDateTransactions.value
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0),
)
const selectedDateExpense = computed(() =>
  selectedDateTransactions.value
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0),
)
const selectedDateBalance = computed(() => selectedDateIncome.value - selectedDateExpense.value)

const isToday = (date: Date) => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

const isSelected = (date: Date) => {
  return (
    date.getDate() === selectedDate.value.getDate() &&
    date.getMonth() === selectedDate.value.getMonth() &&
    date.getFullYear() === selectedDate.value.getFullYear()
  )
}

const formatDateFull = (date: Date) => {
  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}
</script>
