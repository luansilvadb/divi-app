<template>
  <div class="calendar-view">
    <header class="view-header">
      <div class="title-section">
        <h1>Calendário Financeiro</h1>
        <p class="subtitle">Visualize sua atividade diária e vencimentos</p>
      </div>
      <div class="calendar-nav">
        <BaseButton variant="secondary" @click="prevMonth">&lt;</BaseButton>
        <span class="current-month">{{ monthName }} {{ currentYear }}</span>
        <BaseButton variant="secondary" @click="nextMonth">&gt;</BaseButton>
      </div>
    </header>

    <div class="calendar-grid">
      <div class="weekdays">
        <div v-for="day in ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']" :key="day" class="weekday">
          {{ day }}
        </div>
      </div>
      
      <div class="days-grid">
        <div 
          v-for="{ date, isCurrentMonth, dayNumber } in calendarDays" 
          :key="date.toISOString()"
          class="day-cell"
          :class="{ 'not-current': !isCurrentMonth, 'today': isToday(date) }"
        >
          <span class="day-number">{{ dayNumber }}</span>
          <div class="day-events">
            <div 
              v-for="transaction in getTransactionsForDate(date)" 
              :key="transaction.id"
              class="event-dot"
              :class="transaction.type"
              :title="transaction.title"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <aside class="day-details" v-if="selectedDateTransactions.length > 0">
      <BaseCard>
        <template #header>Atividade em {{ formatDate(selectedDate) }}</template>
        <div class="transaction-list">
          <div v-for="t in selectedDateTransactions" :key="t.id" class="transaction-item">
            <span class="t-title">{{ t.title }}</span>
            <span class="t-amount" :class="t.type">{{ formatCurrency(t.amount) }}</span>
          </div>
        </div>
      </BaseCard>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFinanceStore } from '../../application/stores/financeStore'
import { storeToRefs } from 'pinia'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'

const financeStore = useFinanceStore()
const { transactions } = storeToRefs(financeStore)

const currentDate = ref(new Date())
const selectedDate = ref(new Date())

const currentMonth = computed(() => currentDate.value.getMonth())
const currentYear = computed(() => currentDate.value.getFullYear())

const monthName = computed(() => {
  return new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(currentDate.value)
})

onMounted(async () => {
  await fetchMonthData()
})

const fetchMonthData = async () => {
  await financeStore.fetchTransactionsByMonth(currentYear.value, currentMonth.value + 1)
}

const prevMonth = async () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
  await fetchMonthData()
}

const nextMonth = async () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
  await fetchMonthData()
}

const calendarDays = computed(() => {
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1)
  const lastDayOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0)
  
  const days = []
  
  // Padding for start of month
  const startPadding = firstDayOfMonth.getDay()
  for (let i = startPadding - 1; i >= 0; i--) {
    const d = new Date(currentYear.value, currentMonth.value, -i)
    days.push({ date: d, isCurrentMonth: false, dayNumber: d.getDate() })
  }
  
  // Current month days
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const d = new Date(currentYear.value, currentMonth.value, i)
    days.push({ date: d, isCurrentMonth: true, dayNumber: i })
  }
  
  // Padding for end of month
  const endPadding = 42 - days.length
  for (let i = 1; i <= endPadding; i++) {
    const d = new Date(currentYear.value, currentMonth.value + 1, i)
    days.push({ date: d, isCurrentMonth: false, dayNumber: d.getDate() })
  }
  
  return days
})

const getTransactionsForDate = (date: Date) => {
  return transactions.value.filter(t => {
    const tDate = new Date(t.date)
    return tDate.getDate() === date.getDate() && 
           tDate.getMonth() === date.getMonth() && 
           tDate.getFullYear() === date.getFullYear()
  })
}

const selectedDateTransactions = computed(() => getTransactionsForDate(selectedDate.value))

const isToday = (date: Date) => {
  const today = new Date()
  return date.getDate() === today.getDate() && 
         date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear()
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('pt-BR')
}
</script>

<style scoped>
.calendar-view {
  max-width: 1000px;
  margin: 0 auto;
}
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.current-month {
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: capitalize;
  min-width: 150px;
  text-align: center;
}
.calendar-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.calendar-grid {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
}
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}
.weekday {
  padding: 1rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
}
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 120px);
}
.day-cell {
  border-right: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  transition: background 0.2s;
}
.day-cell:nth-child(7n) {
  border-right: none;
}
.day-cell.not-current {
  background: #fdfdfd;
}
.day-cell.not-current .day-number {
  color: #d1d5db;
}
.day-cell.today {
  background: #f0fdf4;
}
.day-cell.today .day-number {
  background: #10b981;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.day-number {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}
.day-events {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.event-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.event-dot.income { background: #10b981; }
.event-dot.expense { background: #ef4444; }

.day-details {
  margin-top: 2rem;
}
.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.transaction-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}
.t-amount.income { color: #10b981; font-weight: 600; }
.t-amount.expense { color: #ef4444; font-weight: 600; }
</style>
