import re

with open('src/modules/calendar/ui/views/CalendarView.vue', 'r') as f:
    content = f.read()

# Replace <script setup lang="ts"> ... </script> entirely

script_content = """<script setup lang="ts">
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
</script>"""

# Replace script part
content = re.sub(r'<script setup lang="ts">.*?</script>', script_content, content, flags=re.DOTALL)

# Now, we also need to update variable references in the template
replacements = {
    'monthName': 'calendarStore.monthName',
    'currentYear': 'calendarStore.currentYear',
    'isSelected(day.date)': 'calendarStore.isSelected(day.date)',
    'selectDate(day.date)': 'calendarStore.selectDate(day.date)',
    'isToday(day.date)': 'calendarStore.isToday(day.date)',
    'getTransactionsForDate(day.date)': 'calendarStore.getTransactionsForDate(day.date)',
    'selectedDateTransactions': 'calendarStore.selectedDateTransactions',
    'formatDateFull(selectedDate)': 'formatDateFull(calendarStore.selectedDate)',
    'selectedDateIncome': 'calendarStore.selectedDateIncome',
    'selectedDateExpense': 'calendarStore.selectedDateExpense',
    'selectedDateBalance': 'calendarStore.selectedDateBalance'
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open('src/modules/calendar/ui/views/CalendarView.vue', 'w') as f:
    f.write(content)
