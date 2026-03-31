<template>
  <StandardPageLayout
    title="Calendário Financeiro"
    highlight="Calendário"
    subtitle="Visualize seus compromissos e transações em uma linha do tempo mensal."
  >
    <template #action>
      <!-- Month Navigation -->
      <div
        class="flex items-center bg-bg-main dark:bg-black/20 p-1.5 rounded-2xl border border-black/5 dark:border-white/5"
      >
        <button
          class="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-white/10 text-text-secondary transition-all active:scale-95"
          @click="prevMonth"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="px-6 flex flex-col items-center min-w-[140px]">
          <span
            class="text-[10px] font-black uppercase tracking-widest text-text-disabled leading-none mb-1"
            >{{ calendarStore.currentDate.getFullYear() }}</span
          >
          <span
            class="text-sm font-black text-text-primary tracking-tight leading-none uppercase"
            >{{ calendarStore.monthName }}</span
          >
        </div>
        <button
          class="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-white/10 text-text-secondary transition-all active:scale-95"
          @click="nextMonth"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </template>

    <!-- Content Grid (Holy Grail) -->
    <div class="view-content-grid">
      <!-- MAIN COLUMN: Calendar -->
      <main class="main-column">
        <div class="glass-card p-6 shadow-sm overflow-hidden">
          <!-- Weekdays Header -->
          <div class="grid grid-cols-7 mb-4">
            <div
              v-for="day in ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']"
              :key="day"
              class="text-center text-[10px] font-black uppercase tracking-widest text-text-disabled py-2"
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
                  ? 'bg-white/40 dark:bg-black/10 hover:bg-white dark:hover:bg-white/10 hover:border-black/5 dark:hover:border-white/10'
                  : 'opacity-20 cursor-default',
                calendarStore.isSelected(day.date)
                  ? 'ring-2 ring-primary-main/40 border-primary-main/20 bg-white/80 dark:bg-white/5'
                  : '',
              ]"
              @click="day.isCurrentMonth && calendarStore.selectDate(day.date)"
            >
              <span
                class="text-sm font-black w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                :class="
                  calendarStore.isToday(day.date)
                    ? 'bg-primary-main text-white shadow-lg shadow-primary-main/20'
                    : 'text-text-primary'
                "
              >
                {{ day.dayNumber }}
              </span>

              <!-- Event Dots -->
              <div
                class="mt-auto flex gap-1 flex-wrap justify-center max-w-full overflow-hidden pb-1"
              >
                <div
                  v-for="(t, i) in calendarStore.getTransactionsForDate(day.date).slice(0, 3)"
                  :key="t.id || i"
                  class="w-1.5 h-1.5 rounded-full shadow-sm"
                  :class="t.type === 'income' ? 'bg-success-main' : 'bg-error-main'"
                ></div>
                <span
                  v-if="calendarStore.getTransactionsForDate(day.date).length > 3"
                  class="text-[8px] font-black text-text-disabled"
                >
                  +{{ calendarStore.getTransactionsForDate(day.date).length - 3 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- SIDEBAR COLUMN: Day Details -->
      <aside class="side-column">
        <BaseCard>
          <template #header>
            <div class="flex flex-col gap-1">
              <span class="text-text-primary">Atividade do Dia</span>
              <span class="text-[10px] font-black uppercase tracking-widest text-text-disabled">{{
                formatDateFull(calendarStore.selectedDate)
              }}</span>
            </div>
          </template>

          <div
            v-if="calendarStore.selectedDateTransactions.length === 0"
            class="flex flex-col items-center justify-center py-16 opacity-40 text-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mb-4"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span class="text-[10px] font-black uppercase tracking-widest">Nenhuma transação</span>
          </div>

          <ul v-else class="list-none p-0 m-0 flex flex-col gap-2 pt-2">
            <li
              v-for="t in calendarStore.selectedDateTransactions"
              :key="t.id || t.localId"
              class="flex items-center gap-4 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <BaseIconBox
                :color="
                  t.type === 'expense' ? 'var(--color-error-main)' : 'var(--color-success-main)'
                "
                size="sm"
              >
                <svg
                  v-if="t.type === 'expense'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </BaseIconBox>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-sm text-text-primary truncate">{{ t.title }}</div>
                <div class="text-[10px] font-black uppercase tracking-widest text-text-disabled">
                  {{ t.category_id || 'Geral' }}
                </div>
              </div>
              <span
                class="font-black text-sm tracking-tight"
                :class="t.type === 'expense' ? 'text-error-main' : 'text-success-main'"
              >
                {{ t.type === 'expense' ? '-' : '+' }} {{ formatCurrency(t.amount) }}
              </span>
            </li>
          </ul>
        </BaseCard>

        <!-- Day Summary -->
        <BaseCard v-if="calendarStore.selectedDateTransactions.length > 0">
          <template #header>Resumo do Dia</template>
          <div class="flex flex-col gap-6 pt-2">
            <BaseSummaryItem
              label="Entradas"
              :value="formatCurrency(calendarStore.selectedDateIncome)"
              color="var(--color-success-main)"
              status="success"
            />
            <BaseSummaryItem
              label="Saídas"
              :value="formatCurrency(calendarStore.selectedDateExpense)"
              color="var(--color-error-main)"
              status="error"
            />

            <div class="h-px bg-black/5 dark:bg-white/5"></div>

            <div
              class="w-full p-4 rounded-2xl bg-bg-main dark:bg-black/20 flex flex-col items-center text-center"
            >
              <span class="text-[10px] font-black uppercase tracking-widest text-text-disabled mb-1"
                >Saldo do Dia</span
              >
              <div
                class="text-2xl font-black tracking-tight"
                :class="calendarStore.selectedDateBalance >= 0 ? 'text-primary-main' : 'text-error-main'"
              >
                {{ formatCurrency(calendarStore.selectedDateBalance) }}
              </div>
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { useCalendarStore } from '@/modules/calendar/application/stores/calendarStore'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'

const transactionStore = useTransactionStore()
const calendarStore = useCalendarStore()

onMounted(async () => {
  await fetchMonthData()
})

const fetchMonthData = async () => {
  await transactionStore.fetchTransactionsByMonth(
    calendarStore.currentYear,
    calendarStore.currentMonth + 1
  )
}

const prevMonth = async () => {
  calendarStore.prevMonth()
  await fetchMonthData()
}

const nextMonth = async () => {
  calendarStore.nextMonth()
  await fetchMonthData()
}

const calendarDays = computed(() => {
  const firstDayOfMonth = new Date(calendarStore.currentYear, calendarStore.currentMonth, 1)
  const lastDayOfMonth = new Date(calendarStore.currentYear, calendarStore.currentMonth + 1, 0)
  const days = []

  const startPadding = firstDayOfMonth.getDay()
  for (let i = startPadding - 1; i >= 0; i--) {
    const d = new Date(calendarStore.currentYear, calendarStore.currentMonth, -i)
    days.push({ date: d, isCurrentMonth: false, dayNumber: d.getDate() })
  }

  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const d = new Date(calendarStore.currentYear, calendarStore.currentMonth, i)
    days.push({ date: d, isCurrentMonth: true, dayNumber: i })
  }

  const endPadding = 42 - days.length
  for (let i = 1; i <= endPadding; i++) {
    const d = new Date(calendarStore.currentYear, calendarStore.currentMonth + 1, i)
    days.push({ date: d, isCurrentMonth: false, dayNumber: d.getDate() })
  }

  return days
})

const formatDateFull = (date: Date) => {
  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}
</script>
