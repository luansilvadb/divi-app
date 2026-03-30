<template>
  <div class="view-wrapper animate-fade-in">
    <!-- Feature header -->
    <BaseViewHeader
      title="Dashboard Financeiro"
      highlight="Financeiro"
      subtitle="Bem-vindo de volta! Aqui está um resumo da sua saúde financeira."
    >
      <template #action>
        <BaseButton variant="primary" @click="showTransactionForm = true">
          Nova Transação
        </BaseButton>
      </template>
    </BaseViewHeader>

    <!-- Content Grid (Holy Grail) -->
    <div class="view-content-grid">
      <!-- MAIN COLUMN -->
      <main class="main-column">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BaseCard :is-loading="isLoading">
            <BaseSummaryItem
              label="Entradas (Mês)"
              :value="formatCurrency(totalIncome)"
              color="var(--color-success-main)"
              status="success"
            >
              <template #icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </template>
            </BaseSummaryItem>
          </BaseCard>

          <BaseCard :is-loading="isLoading">
            <BaseSummaryItem
              label="Saídas (Mês)"
              :value="formatCurrency(totalExpense)"
              color="var(--color-error-main)"
              status="error"
            >
              <template #icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </template>
            </BaseSummaryItem>
          </BaseCard>

          <BaseCard :is-loading="isLoading">
            <BaseSummaryItem
              label="Saldo Geral"
              :value="formatCurrency(store.totalBalance)"
              color="var(--color-primary-main)"
              status="info"
            >
              <template #icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </template>
            </BaseSummaryItem>
          </BaseCard>
        </div>

        <!-- Wallets Section -->
        <section>
          <div class="flex justify-between items-center mb-5">
            <h2 class="text-xl font-bold text-text-primary tracking-tight">Minhas Contas</h2>
            <BaseButton variant="ghost" class="text-sm font-bold" @click="$router.push('/wallets')">
              Ver todas →
            </BaseButton>
          </div>
          <AccountCarousel :wallets="store.wallets" />
        </section>

        <!-- Patrimonial Growth Chart -->
        <BaseCard>
          <template #header>
            <div class="flex justify-between items-center w-full">
              <span>Evolução Patrimonial</span>
              <div class="text-[0.7rem] uppercase font-black opacity-40 tracking-widest">
                Últimos 6 meses
              </div>
            </div>
          </template>
          <div class="h-[300px]">
            <PatrimonialChart :data="growthData" :labels="growthLabels" />
          </div>
        </BaseCard>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column">
        <!-- Quick Summary Panels (Loans/Debts) -->
        <SummaryPanels :overdueAmount="450.0" :overdueCount="2" :futureAmount="1200.0" />

        <!-- Recent Activity -->
        <BaseCard>
          <template #header>Transações Recentes</template>

          <div
            v-if="store.transactions.length === 0"
            class="flex flex-col items-center py-12 opacity-50 text-center"
          >
            <div class="text-4xl mb-4">☕</div>
            <p class="text-sm font-medium">Nenhuma transação este mês.</p>
          </div>

          <ul v-else class="list-none p-0 m-0">
            <li
              v-for="t in store.transactions.slice(0, 5)"
              :key="t.id || t.localId"
              class="flex items-center py-4 border-b border-black/5 dark:border-white/5 last:border-0"
            >
              <BaseIconBox
                :color="
                  t.type === 'expense' ? 'var(--color-error-main)' : 'var(--color-success-main)'
                "
                size="sm"
                class="mr-4"
              >
                <svg
                  v-if="t.type === 'expense'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </BaseIconBox>
              <div class="flex-1 min-w-0 flex flex-col">
                <span class="font-bold text-text-primary text-sm truncate tracking-tight">{{
                  t.title
                }}</span>
                <span
                  class="text-[0.7rem] text-text-disabled mt-0.5 uppercase tracking-widest font-black"
                  >{{ formatDate(t.date) }}</span
                >
              </div>
              <span
                :class="[
                  'font-extrabold text-sm ml-4 tracking-tight',
                  t.type === 'expense' ? 'text-error-main' : 'text-success-main',
                ]"
              >
                {{ t.type === 'expense' ? '-' : '+' }} {{ formatCurrency(t.amount) }}
              </span>
            </li>
          </ul>

          <template #footer>
            <BaseButton
              variant="ghost"
              class="w-full text-xs font-black uppercase tracking-widest"
              @click="$router.push('/transactions')"
            >
              Histórico completo →
            </BaseButton>
          </template>
        </BaseCard>

        <!-- Main Budget Progress -->
        <BaseCard>
          <template #header>Orçamento (50/30/20)</template>
          <div class="flex flex-col gap-6 pt-2">
            <!-- Example: Essential -->
            <div class="flex flex-col gap-2.5">
              <div class="flex justify-between text-[0.7rem] font-black uppercase tracking-widest">
                <span class="text-text-primary">Essenciais</span>
                <span class="text-text-disabled">65% consumido</span>
              </div>
              <BaseProgressBar :percentage="65" color="var(--color-warning-main)" />
              <div
                class="text-[0.7rem] text-text-disabled text-right font-black uppercase tracking-widest"
              >
                {{ formatCurrency(2450) }} de {{ formatCurrency(3750) }}
              </div>
            </div>

            <!-- Example: Lifestyle -->
            <div class="flex flex-col gap-2.5">
              <div class="flex justify-between text-[0.7rem] font-black uppercase tracking-widest">
                <span class="text-text-primary">Lazer</span>
                <span class="text-text-disabled">30% consumido</span>
              </div>
              <BaseProgressBar :percentage="30" color="var(--color-success-main)" />
              <div
                class="text-[0.7rem] text-text-disabled text-right font-black uppercase tracking-widest"
              >
                {{ formatCurrency(600) }} de {{ formatCurrency(2000) }}
              </div>
            </div>
          </div>
          <template #footer>
            <BaseButton
              variant="ghost"
              class="w-full text-xs font-black uppercase tracking-widest"
              @click="$router.push('/budgets')"
            >
              Configurar limites →
            </BaseButton>
          </template>
        </BaseCard>
      </aside>
    </div>

    <!-- Modals -->
    <TransactionForm
      v-if="showTransactionForm"
      @close="showTransactionForm = false"
      @saved="refreshData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useFinanceStore } from '../../application/stores/financeStore'
import { formatCurrency, formatDate } from '@/shared/utils/formatters'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import BaseViewHeader from '@/shared/components/organisms/BaseViewHeader.vue'
import AccountCarousel from '../components/AccountCarousel.vue'
import PatrimonialChart from '../components/PatrimonialChart.vue'
import SummaryPanels from '../components/SummaryPanels.vue'
import TransactionForm from '../components/TransactionForm.vue'

const store = useFinanceStore()
const showTransactionForm = ref(false)
const isLoading = ref(true)

// Mock chart data - Will be integrated with a dedicated AnalyticsService later
const growthData = [15000, 16200, 15800, 17500, 18900, 20100]
const growthLabels = ['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar']

const totalIncome = computed(() => {
  return store.transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
})

const totalExpense = computed(() => {
  return store.transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
})

onMounted(async () => {
  await refreshData()
})

async function refreshData() {
  isLoading.value = true
  const now = new Date()
  try {
    await Promise.all([
      store.fetchWallets(),
      store.fetchCategories(),
      store.fetchTransactionsByMonth(now.getFullYear(), now.getMonth() + 1),
      store.fetchLoans(),
      store.fetchSubscriptions(),
    ])
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* No extra styles needed - standard classes are handled globally */
</style>
