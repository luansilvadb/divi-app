<template>
  <StandardPageLayout
    title="Calendário Financeiro"
    highlight="Calendário"
    subtitle="Visualize seus compromissos e transações em uma linha do tempo mensal."
  >
    <template #action>
      <BaseMonthSwitcher :month="monthName" @prev="prevMonth" @next="nextMonth" />
    </template>

    <div class="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
      <!-- MAIN COLUMN: Calendar -->
      <main>
        <NCard>
          <!-- Weekdays Header -->
          <div class="grid grid-cols-7 mb-3">
            <div
              v-for="day in ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']"
              :key="day"
              class="text-center"
            >
              <NText depth="3" class="text-[10px] uppercase tracking-widest font-bold">{{ day }}</NText>
            </div>
          </div>

          <!-- Days Grid -->
          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="day in calendarDays"
              :key="day.date.toISOString()"
              class="relative aspect-square rounded-xl p-1.5 border border-transparent transition-all duration-150 ease-out flex flex-col items-center cursor-pointer"
              :class="[
                day.isCurrentMonth
                  ? 'hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                  : 'opacity-20 cursor-default',
                isSelected(day.date)
                  ? 'ring-2 ring-violet-500/40 border-violet-500/20 bg-[rgba(0,122,255,0.05)]'
                  : '',
              ]"
              @click="day.isCurrentMonth && selectDate(day.date)"
            >
              <NTag
                v-if="isToday(day.date)"
                type="primary"
                size="small"
                round
                :bordered="false"
                class="!px-2"
              >
                {{ day.dayNumber }}
              </NTag>
              <NText v-else strong class="text-sm">{{ day.dayNumber }}</NText>

              <!-- Event Dots -->
              <div class="mt-auto flex gap-0.5 flex-wrap justify-center max-w-full overflow-hidden pb-0.5">
                <div
                  v-for="(t, i) in getTransactionsForDate(day.date).slice(0, 3)"
                  :key="t.id || i"
                  class="w-1.5 h-1.5 rounded-full"
                  :class="t.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'"
                ></div>
                <NText
                  v-if="getTransactionsForDate(day.date).length > 3"
                  depth="3"
                  class="text-[7px]"
                >
                  +{{ getTransactionsForDate(day.date).length - 3 }}
                </NText>
              </div>
            </div>
          </div>
        </NCard>
      </main>

      <!-- SIDEBAR COLUMN: Day Details -->
      <aside class="side-column">
        <NSpace vertical :size="16">
          <NCard>
            <template #header>
              <NSpace vertical :size="2">
                <NText strong>Atividade do Dia</NText>
                <NText depth="3" class="text-xs">{{ formatDateFull(selectedDate) }}</NText>
              </NSpace>
            </template>

            <NEmpty
              v-if="selectedDateTransactions.length === 0"
              description="Nenhuma transação"
              class="py-12"
            >
              <template #icon>
                <i class="i-lucide-calendar-x text-3xl"></i>
              </template>
            </NEmpty>

            <NList v-else hoverable :show-divider="false">
              <NListItem v-for="t in selectedDateTransactions" :key="t.id || t.localId">
                <template #prefix>
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center"
                    :class="t.type === 'expense' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'"
                  >
                    <i :class="t.type === 'expense' ? 'i-lucide-arrow-down' : 'i-lucide-arrow-up'" class="text-sm"></i>
                  </div>
                </template>
                <NSpace vertical :size="0">
                  <NText strong class="text-sm">{{ t.title }}</NText>
                  <NText depth="3" class="text-[10px] uppercase tracking-widest">
                    {{ store.categoryMap[t.category_id]?.name || 'Geral' }}
                  </NText>
                </NSpace>
                <template #suffix>
                  <NText
                    strong
                    class="text-sm tabular-nums"
                    :type="t.type === 'expense' ? 'error' : 'success'"
                  >
                    {{ formatCurrency(t.amount) }}
                  </NText>
                </template>
              </NListItem>
            </NList>
          </NCard>

          <!-- Day Summary -->
          <NCard v-if="selectedDateTransactions.length > 0">
            <template #header><NText strong>Resumo do Dia</NText></template>
            <NSpace vertical :size="16">
              <NStatistic label="Entradas">
                <NText type="success" strong>{{ formatCurrency(selectedDateIncome) }}</NText>
              </NStatistic>

              <NStatistic label="Saídas">
                <NText type="error" strong>{{ formatCurrency(selectedDateExpense) }}</NText>
              </NStatistic>

              <NDivider class="!my-0" />

              <NCard embedded size="small" class="text-center">
                <NText depth="3" class="text-xs uppercase tracking-widest block mb-2">Saldo do Dia</NText>
                <NText
                  strong
                  class="text-2xl tabular-nums"
                  :type="selectedDateBalance >= 0 ? 'primary' : 'error'"
                >
                  {{ formatCurrency(Math.abs(selectedDateBalance)) }}
                </NText>
              </NCard>
            </NSpace>
          </NCard>
        </NSpace>
      </aside>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  NCard,
  NSpace,
  NText,
  NTag,
  NEmpty,
  NList,
  NListItem,
  NStatistic,
  NDivider,
} from 'naive-ui'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { formatCurrency } from '@/shared/utils/formatters'
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
    .reduce((sum, t) => sum + BigInt(t.amount), 0n),
)
const selectedDateExpense = computed(() =>
  selectedDateTransactions.value
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + BigInt(t.amount), 0n),
)
const selectedDateBalance = computed(() => Number(selectedDateIncome.value - selectedDateExpense.value) / 100)

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
