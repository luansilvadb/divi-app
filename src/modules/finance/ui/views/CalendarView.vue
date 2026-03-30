<template>
  <div class="calendar-view dashboard-view animate-fade-in">
    <!-- Background Decor -->
    <div class="dashboard-bg-decor" aria-hidden="true">
      <div class="glass-orb orb-primary"></div>
      <div class="glass-orb orb-secondary"></div>
    </div>

    <!-- Header Section -->
    <header class="dashboard-header">
      <div class="header-content">
        <h1 class="page-title">
          Calendário <span class="text-accent-main">Financeiro</span>
        </h1>
        <p class="page-subtitle">Visualize sua atividade diária e vencimentos</p>
      </div>
      <div class="header-actions calendar-nav">
        <BaseButton variant="secondary" class="nav-btn" @click="prevMonth" aria-label="Mês anterior">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </BaseButton>
        <div class="current-month-display">
          <span class="current-month">{{ monthName }}</span>
          <span class="current-year">{{ currentYear }}</span>
        </div>
        <BaseButton variant="secondary" class="nav-btn" @click="nextMonth" aria-label="Próximo mês">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </BaseButton>
      </div>
    </header>

    <div class="calendar-content-grid">
      <!-- Main Column: Calendar Interface -->
      <div class="main-column">
        <div class="calendar-card glass-card">
          <div class="weekdays">
            <div v-for="day in ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']" :key="day" class="weekday text-secondary">
              {{ day }}
            </div>
          </div>
          
          <div class="days-grid">
            <div 
              v-for="{ date, isCurrentMonth, dayNumber } in calendarDays" 
              :key="date.toISOString()"
              class="day-cell"
              :class="{ 
                'not-current': !isCurrentMonth, 
                'today': isToday(date),
                'selected': isSelected(date),
                'has-events': getTransactionsForDate(date).length > 0 
              }"
              @click="selectDate(date)"
            >
              <div class="day-number-wrapper">
                <span class="day-number">{{ dayNumber }}</span>
              </div>
              <div class="day-events">
                <div class="event-dots" v-if="getTransactionsForDate(date).length > 0">
                   <div 
                     v-for="(transaction, i) in getTransactionsForDate(date).slice(0, 3)" 
                     :key="transaction.id || i"
                     class="event-dot"
                     :class="transaction.type"
                   ></div>
                   <div class="event-more" v-if="getTransactionsForDate(date).length > 3">
                     +{{ getTransactionsForDate(date).length - 3 }}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Day details -->
      <aside class="side-column">
        <BaseCard class="day-details-card glass-card">
          <template #header>
            <div class="details-header">
              <span class="details-title">Atividade do Dia</span>
              <span class="details-date">{{ formatDateFull(selectedDate) }}</span>
            </div>
          </template>

          <div v-if="selectedDateTransactions.length === 0" class="empty-state">
            <div class="empty-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
            </div>
            <p>Nenhuma transação para este dia.</p>
          </div>
          
          <ul v-else class="transaction-list">
            <li v-for="t in selectedDateTransactions" :key="t.id || t.localId || Math.random()" class="transaction-item hover-translate">
              <div class="activity-icon-container" :class="t.type">
                <svg v-if="t.type === 'expense'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              </div>
              <div class="transaction-details">
                <span class="t-title text-truncate">{{ t.title }}</span>
                <span class="t-category text-secondary">{{ t.category_id || 'Geral' }}</span>
              </div>
              <span class="t-amount" :class="t.type">
                {{ t.type === 'expense' ? '-' : '+' }} {{ formatCurrency(t.amount) }}
              </span>
            </li>
          </ul>
        </BaseCard>

        <BaseCard class="summary-card glass-card" v-if="selectedDateTransactions.length > 0">
           <template #header>Resumo do Dia</template>
           <div class="summary-stats">
             <div class="summary-stat">
               <span class="stat-label">Entradas</span>
               <span class="stat-val text-success-main">+{{ formatCurrency(selectedDateIncome) }}</span>
             </div>
             <div class="summary-stat">
               <span class="stat-label">Saídas</span>
               <span class="stat-val text-error-main">-{{ formatCurrency(selectedDateExpense) }}</span>
             </div>
             <div class="summary-divider"></div>
             <div class="summary-stat total">
               <span class="stat-label">Saldo do Dia</span>
               <span class="stat-val" :class="selectedDateBalance >= 0 ? 'text-success-main' : 'text-error-main'">
                 {{ formatCurrency(selectedDateBalance) }}
               </span>
             </div>
           </div>
        </BaseCard>
      </aside>
    </div>
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

const selectDate = (date: Date) => {
  selectedDate.value = date
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

const selectedDateIncome = computed(() => {
  return selectedDateTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
})

const selectedDateExpense = computed(() => {
  return selectedDateTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
})

const selectedDateBalance = computed(() => selectedDateIncome.value - selectedDateExpense.value)

const isToday = (date: Date) => {
  const today = new Date()
  return date.getDate() === today.getDate() && 
         date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear()
}

const isSelected = (date: Date) => {
  return date.getDate() === selectedDate.value.getDate() && 
         date.getMonth() === selectedDate.value.getMonth() && 
         date.getFullYear() === selectedDate.value.getFullYear()
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const formatDateFull = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  }).format(date)
}
</script>

<style scoped>
/* ===== Core Layout (Matches DashboardView) ===== */
.dashboard-view {
  width: 100%;
  padding: 2rem 2.5rem;
  position: relative;
  box-sizing: border-box;
  overflow-x: hidden;
  min-height: 100vh;
}

/* Background Decorations */
.dashboard-bg-decor {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.glass-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.12;
}

:is(.dark) .glass-orb {
  opacity: 0.15;
}

.orb-primary {
  width: 500px;
  height: 500px;
  background: var(--color-primary-main);
  top: -150px;
  right: -100px;
  animation: float-orb 20s ease-in-out infinite alternate;
}

.orb-secondary {
  width: 400px;
  height: 400px;
  background: var(--color-secondary-main);
  bottom: -100px;
  left: -50px;
  animation: float-orb 25s ease-in-out infinite alternate-reverse;
}

@keyframes float-orb {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-30px, 40px) scale(1.05); }
}

/* Header Styles */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  gap: 1.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--color-text-secondary);
  font-size: 1rem;
}

/* Layout Grid */
.calendar-content-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  width: 100%;
}

.main-column {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.side-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 0;
}

/* ===== Glass Card Common ===== */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  border-radius: 1.25rem;
}

:is(.dark) .glass-card {
  background: rgba(30, 41, 59, 0.45);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
}

/* ===== Calendar Header Nav ===== */
.calendar-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.6);
  padding: 0.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  box-shadow: 0 2px 12px rgba(0,0,0,0.03);
}

:is(.dark) .calendar-nav {
  background: rgba(30, 41, 59, 0.5);
  border-color: rgba(255, 255, 255, 0.06);
}

.current-month-display {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  min-width: 140px;
  justify-content: center;
}

.current-month {
  font-size: 1.15rem;
  font-weight: 700;
  text-transform: capitalize;
  color: var(--color-text-primary);
}

.current-year {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.nav-btn {
  border-radius: 0.75rem !important;
  width: 36px;
  height: 36px;
  padding: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ===== Calendar Grid ===== */
.calendar-card {
  padding: 1.5rem;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 1rem;
}

.weekday {
  text-align: center;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.5rem;
  color: var(--color-text-secondary);
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.day-cell {
  position: relative;
  aspect-ratio: 1;
  border-radius: 1rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

:is(.dark) .day-cell {
  background: rgba(15, 23, 42, 0.3);
}

.day-cell:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: rgba(255, 255, 255, 0.6);
}

:is(.dark) .day-cell:hover {
  background: rgba(30, 41, 59, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
}

.day-cell.not-current {
  opacity: 0.4;
}

.day-number-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-bottom: auto;
}

.day-number {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text-primary);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

/* Today State */
.day-cell.today .day-number {
  background: linear-gradient(135deg, var(--color-primary-main), var(--color-secondary-main));
  color: white;
  box-shadow: 0 2px 8px rgba(var(--color-primary-main-rgb), 0.3);
}

/* Selected State */
.day-cell.selected {
  background: var(--color-surface-main);
  border-color: var(--color-primary-main);
  box-shadow: 0 0 0 1px var(--color-primary-main), 0 4px 12px rgba(var(--color-primary-main-rgb), 0.1);
}

:is(.dark) .day-cell.selected {
  background: rgba(30, 41, 59, 0.9);
}

/* Events Indicators */
.day-events {
  margin-top: 0.5rem;
}

.event-dots {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  align-items: center;
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.event-dot.income { background: var(--color-success-main); }
.event-dot.expense { background: var(--color-error-main); }

.event-more {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  line-height: 1;
}

/* ===== Side Column Details ===== */
.details-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.details-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.details-date {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  text-transform: capitalize;
}

.empty-state {
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: var(--color-text-disabled);
  gap: 1rem;
}

.empty-icon-wrapper {
  color: var(--color-text-disabled);
  opacity: 0.5;
  background: rgba(0, 0, 0, 0.03);
  padding: 1.25rem;
  border-radius: 50%;
}

:is(.dark) .empty-icon-wrapper {
  background: rgba(255, 255, 255, 0.03);
}

.transaction-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 0.875rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

:is(.dark) .transaction-item {
  background: rgba(15, 23, 42, 0.3);
  border-color: rgba(255, 255, 255, 0.03);
}

.hover-translate:hover {
  transform: translateX(4px);
  background: var(--color-surface-main);
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  border-color: rgba(var(--color-primary-main-rgb), 0.2);
}

.activity-icon-container {
  width: 36px;
  height: 36px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.activity-icon-container.income { background: rgba(16, 185, 129, 0.1); color: var(--color-success-main); }
.activity-icon-container.expense { background: rgba(239, 68, 68, 0.1); color: var(--color-error-main); }

.transaction-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.t-title {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.9375rem;
}

.t-category {
  font-size: 0.75rem;
}

.t-amount {
  font-weight: 700;
  font-size: 0.9375rem;
  margin-left: 0.5rem;
  white-space: nowrap;
}

/* ===== Summary Card ===== */
.summary-card {
  margin-top: 1.5rem;
}

.summary-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.stat-val {
  font-weight: 600;
  font-size: 0.9375rem;
}

.summary-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border-main), transparent);
  margin: 0.25rem 0;
}

.summary-stat.total .stat-label {
  font-weight: 600;
  color: var(--color-text-primary);
}

.summary-stat.total .stat-val {
  font-size: 1.125rem;
  font-weight: 700;
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Responsive */
@media (max-width: 1200px) {
  .calendar-content-grid {
    grid-template-columns: 1fr 320px;
  }
}

@media (max-width: 992px) {
  .calendar-content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-view {
    padding: 1.5rem 1rem;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .calendar-nav {
    width: 100%;
    justify-content: space-between;
  }
  
  .days-grid {
    gap: 4px;
  }
  
  .day-cell {
    padding: 0.25rem;
  }
  
  .day-number {
    width: 24px;
    height: 24px;
    font-size: 0.875rem;
  }
}
</style>
