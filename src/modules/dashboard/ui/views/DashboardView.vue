<template>
  <StandardPageLayout
    title="Dashboard Financeiro"
    highlight="Financeiro"
    subtitle="Bem-vindo de volta! Aqui está um resumo da sua saúde financeira."
  >
    <template #action>
      <BaseButton variant="primary" @click="showTransactionForm = true">
        Nova Transação
      </BaseButton>
    </template>

    <!-- Content Grid (Holy Grail) -->
    <div class="view-content-grid">
      <!-- MAIN COLUMN -->
      <main class="main-column">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BaseCard :is-loading="isLoading">
            <BaseSummaryItem
              label="Entradas (Mês)"
              :value="formatCurrency(transactionStore.totalIncome)"
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
                  stroke-width="2.5"
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
              :value="formatCurrency(transactionStore.totalExpense)"
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
                  stroke-width="2.5"
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
              :value="formatCurrency(dashboardStore.totalBalance)"
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
                  stroke-width="2.5"
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
          <AccountCarousel :wallets="dashboardStore.wallets" />
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
            v-if="transactionStore.transactions.length === 0"
            class="flex flex-col items-center py-12 opacity-50 text-center"
          >
            <div class="text-4xl mb-4">☕</div>
            <p class="text-sm font-medium">Nenhuma transação este mês.</p>
          </div>

          <ul v-else class="list-none p-0 m-0">
            <li
              v-for="t in transactionStore.transactions.slice(0, 5)"
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
                <div class="text-sm font-bold text-text-primary truncate">{{ t.title }}</div>
                <div class="text-[10px] font-black uppercase tracking-widest text-text-disabled">
                  {{ formatDate(t.date) }}
                </div>
              </div>
              <div
                class="text-sm font-black tracking-tight ml-4"
                :class="t.type === 'expense' ? 'text-text-primary' : 'text-success-main'"
              >
                {{ formatCurrency(t.amount) }}
              </div>
            </li>
          </ul>

          <BaseButton
            variant="ghost"
            class="w-full text-[10px] uppercase font-black tracking-widest mt-4"
            @click="$router.push('/transactions')"
          >
            Ver extrato completo →
          </BaseButton>
        </BaseCard>
      </aside>
    </div>

    <!-- Modals -->
    <TransactionForm
      v-if="showTransactionForm"
      @close="showTransactionForm = false"
      @saved="refreshDashboard"
    />
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useDashboardStore } from '../../application/stores/dashboardStore'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import AccountCarousel from '@/shared/components/organisms/AccountCarousel.vue'
import PatrimonialChart from '@/shared/components/organisms/PatrimonialChart.vue'
import SummaryPanels from '@/shared/components/organisms/SummaryPanels.vue'
import TransactionForm from '@/shared/components/organisms/TransactionForm.vue'

const dashboardStore = useDashboardStore()
const transactionStore = useTransactionStore()
const showTransactionForm = ref(false)

const isLoading = computed(() => dashboardStore.isLoading || transactionStore.isLoading)

// Mock Growth Data
const growthData = [42000, 43500, 41000, 44800, 46200, 48500]
const growthLabels = ['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar']

onMounted(async () => {
  await refreshDashboard()
})

async function refreshDashboard() {
  const now = new Date()
  await Promise.all([
    dashboardStore.fetchDashboardData(),
    transactionStore.fetchTransactionsByMonth(now.getFullYear(), now.getMonth() + 1),
  ])
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}
</script>
