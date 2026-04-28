<template>
  <StandardPageLayout
    title="Dashboard"
    highlight="Dashboard"
    subtitle=""
  >
    <div class="flex flex-col gap-6 pb-4">

      <!-- ── HERO SUMMARY ─────────────────────────────────── -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Net Worth (destaque) -->
        <div
          class="relative overflow-hidden rounded-xl flex flex-col justify-between p-6 col-span-1 md:col-span-1 bg-primary text-white min-h-[148px] transition-colors duration-normal"
          id="dashboard-networth-card"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-widest text-white/60">Patrimônio Total</p>
            </div>
            <div class="w-8 h-8 rounded-full flex items-center justify-center bg-white/15">
              <i class="i-lucide-landmark text-sm text-white"></i>
            </div>
          </div>
          <div>
            <p class="text-3xl font-bold tracking-tight tabular-nums mt-2">
              {{ formatCurrency(dashboardStore.totalBalance) }}
            </p>
            <p class="text-[11px] mt-1 text-white/50">Consolidado de todas as contas</p>
          </div>
        </div>

        <!-- Receitas -->
        <div
          class="rounded-xl flex flex-col justify-between p-6 overflow-hidden bg-surface-primary border border-separator min-h-[148px] transition-colors duration-normal"
          id="dashboard-income-card"
        >
          <div class="flex items-start justify-between">
            <p class="text-[11px] font-semibold uppercase tracking-widest text-tertiary">Receitas</p>
            <div class="w-7 h-7 rounded-full flex items-center justify-center bg-success/10">
              <i class="i-lucide-trending-up text-xs text-success"></i>
            </div>
          </div>
          <div>
            <p class="text-2xl font-bold tracking-tight tabular-nums mt-2 text-label">
              {{ formatCurrency(transactionStore.totalIncome) }}
            </p>
            <div class="flex items-center gap-1.5 mt-2">
              <span class="text-[11px] font-semibold text-success">+12%</span>
              <span class="text-[11px] text-tertiary">vs. mês passado</span>
            </div>
          </div>
        </div>

        <!-- Despesas -->
        <div
          class="rounded-xl flex flex-col justify-between p-6 overflow-hidden bg-surface-primary border border-separator min-h-[148px] transition-colors duration-normal"
          id="dashboard-expense-card"
        >
          <div class="flex items-start justify-between">
            <p class="text-[11px] font-semibold uppercase tracking-widest text-tertiary">Despesas</p>
            <div class="w-7 h-7 rounded-full flex items-center justify-center bg-error/10">
              <i class="i-lucide-trending-down text-xs text-error"></i>
            </div>
          </div>
          <div>
            <p class="text-2xl font-bold tracking-tight tabular-nums mt-2 text-label">
              {{ formatCurrency(transactionStore.totalExpense) }}
            </p>
            <!-- Budget usage bar -->
            <div class="mt-3">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[10px] text-tertiary">Uso do orçamento</span>
                <span class="text-[10px] font-semibold text-secondary">65%</span>
              </div>
              <div class="h-1 rounded-full overflow-hidden bg-surface-secondary">
                <div class="h-full rounded-full transition-all duration-150 ease-out w-[65%] bg-error"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── CONTAS ──────────────────────────────────────── -->
      <section id="dashboard-accounts-section">
        <div class="flex items-center justify-between mb-4 px-0.5">
          <div>
            <h2 class="text-[17px] font-semibold tracking-tight text-label">Minhas Contas</h2>
            <p class="text-[12px] mt-0.5 text-tertiary">Ativos em tempo real</p>
          </div>
        </div>
        <AccountGrid
          :wallets="dashboardStore.wallets"
          :stats-map="walletStatsMap"
          @saved="dashboardStore.fetchDashboardData()"
        />
      </section>

      <!-- ── ATIVIDADE + CATEGORIAS ──────────────────────── -->
      <div class="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

        <!-- LEFT: Evolução Patrimonial -->
        <section class="flex flex-col gap-6 min-w-0">

          <!-- Chart card -->
          <div
            class="rounded-xl overflow-hidden bg-surface-primary border border-separator transition-colors duration-normal"
            id="dashboard-chart-card"
          >
            <div
              class="px-6 py-4 flex items-center justify-between border-b border-separator bg-surface-secondary"
            >
              <div>
                <h3 class="text-[13px] font-semibold text-label">Evolução Patrimonial</h3>
                <p class="text-[11px] mt-0.5 text-tertiary">Histórico de saldo consolidado</p>
              </div>
              <!-- Range Segmented Control -->
              <div class="flex p-1 rounded-lg bg-surface-secondary border border-separator">
                <button
                  v-for="r in [{ key: '6m', label: '6 Meses' }, { key: '1y', label: '1 Ano' }]"
                  :key="r.key"
                  @click="chartRange = r.key"
                  class="px-3.5 py-1 rounded-md text-[11px] font-semibold transition-all duration-150 ease-out"
                  :class="chartRange === r.key ? 'bg-surface-primary text-primary shadow-sm' : 'text-tertiary'"
                >
                  {{ r.label }}
                </button>
              </div>
            </div>
            <div class="p-6">
              <div class="h-[280px] w-full">
                <PatrimonialChart :data="growthData" :labels="growthLabels" />
              </div>
            </div>
          </div>

          <!-- Recent Transactions Feed -->
          <div
            class="rounded-xl overflow-hidden bg-surface-primary border border-separator transition-colors duration-150 ease-out"
            id="dashboard-recent-transactions"
          >
            <div
              class="px-6 py-4 flex items-center justify-between border-b border-separator bg-surface-secondary"
            >
              <h3 class="text-[13px] font-semibold text-label">Atividades Recentes</h3>

              <!-- Filter Segmented Control -->
              <div class="flex p-1 rounded-lg bg-surface-secondary border border-separator">
                <button
                  v-for="opt in transactionFilterOptions"
                  :key="opt.value"
                  @click="transactionFilter = opt.value"
                  class="px-3 py-1 rounded-md text-[11px] font-medium transition-all duration-150 ease-out"
                  :class="transactionFilter === opt.value ? 'bg-surface-primary text-primary shadow-sm' : 'text-tertiary'"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <!-- Feed List -->
            <div class="divide-y divide-separator">
              <div
                v-for="t in filteredTransactions"
                :key="t.id"
                class="flex items-center gap-3 px-5 py-3.5 transition-colors duration-150 cursor-pointer group hover:bg-surface-secondary"
              >
                <!-- Category Icon -->
                <div
                  class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden bg-surface-secondary border border-separator"
                >
                  <div
                    class="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full"
                    :style="{ background: transactionStore.categoryMap[t.category_id]?.color || 'var(--color-primary)' }"
                  ></div>
                  <img
                    v-if="transactionStore.categoryMap[t.category_id]?.icon"
                    :src="getCategoryIcon(t.category_id)"
                    class="w-4 h-4 grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all"
                  />
                  <i v-else class="i-lucide-receipt text-sm text-tertiary"></i>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <p class="text-[13px] font-medium truncate text-label">{{ t.title || 'Atividade' }}</p>
                  <p class="text-[11px] truncate mt-0.5 text-tertiary">
                    {{ transactionStore.walletMap[t.wallet_id]?.name || 'Conta' }}
                  </p>
                </div>

                <!-- Amount -->
                <div class="text-right shrink-0">
                  <p
                    class="text-[13px] font-semibold tabular-nums"
                    :class="t.type === 'expense' ? 'text-error' : 'text-success'"
                  >
                    {{ t.type === 'expense' ? '−' : '+' }} R$ {{ (Math.abs(Number(t.amount)) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
                  </p>
                </div>
              </div>

              <!-- Empty state -->
              <div
                v-if="filteredTransactions.length === 0"
                class="flex flex-col items-center justify-center py-16 gap-3 text-tertiary"
              >
                <i class="i-lucide-list-x text-2xl opacity-40"></i>
                <p class="text-[12px] font-medium opacity-60">Nenhuma atividade encontrada</p>
              </div>
            </div>

            <!-- View All -->
            <div class="px-5 py-3.5 border-t border-separator">
              <button
                @click="$router.push('/transactions')"
                class="text-[12px] font-medium transition-colors duration-200 w-full text-center text-primary"
              >
                Ver todo o histórico
              </button>
            </div>
          </div>
        </section>

        <!-- RIGHT: Category Breakdown (sticky) -->
        <div class="xl:sticky xl:top-8 h-fit">
          <CategoryBars />
        </div>
      </div>

    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useObservable } from '@vueuse/rxjs'
import { useDashboardStore } from '@/modules/dashboard/application/stores/dashboardStore'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import AccountGrid from '@/shared/components/organisms/AccountGrid.vue'
import PatrimonialChart from '@/shared/components/organisms/PatrimonialChart.vue'
import CategoryBars from '../components/CategoryBars.vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IAssetLoader } from '@/shared/domain/contracts/IAssetLoader'
import type { ITransactionRepository } from '@/shared/domain/contracts/ITransactionRepository'
import type { Transaction } from '@/shared/domain/entities/Transaction'

const dashboardStore = useDashboardStore()
const transactionStore = useTransactionStore()
const assetLoader = container.resolve<IAssetLoader>(DI_TOKENS.AssetLoader)
const transactionRepo = container.resolve<ITransactionRepository>(DI_TOKENS.TransactionRepository)

const chartRange = ref('6m')
const transactionFilter = ref('all')
const transactionFilterOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Receitas', value: 'income' },
  { label: 'Despesas', value: 'expense' },
]

const liveTransactions = useObservable(transactionRepo.watchAll()) as { value: Transaction[] | undefined }

const filteredTransactions = computed(() => {
  const t = liveTransactions.value || []
  if (transactionFilter.value === 'all') return t.slice(0, 15)
  return t.filter((item) => item.type === transactionFilter.value).slice(0, 15)
})

const walletStatsMap = computed(() => {
  const stats: Record<string, any> = {}
  const transactions = transactionStore.activeTransactions || []

  transactions.forEach((t) => {
    if (!stats[t.wallet_id]) {
      stats[t.wallet_id] = { income: 0n, expense: 0n, totalCount: 0, trend: 0 }
    }
    const s = stats[t.wallet_id]
    s.totalCount++
    if (t.type === 'income') s.income += BigInt(t.amount)
    else s.expense += BigInt(t.amount)
  })

  for (const id in stats) {
    const s = stats[id]
    const inc = Number(s.income) / 100
    const exp = Number(s.expense) / 100
    const vol = inc + exp
    s.income = inc
    s.expense = exp
    s.trend = vol > 0 ? ((inc - exp) / vol) * 100 : 0
  }
  return stats
})

function getCategoryIcon(id: string) { return assetLoader.sanitize(transactionStore.categoryMap[id]?.icon) }
function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

const growthData = [42000, 43500, 41000, 44800, 46200, 48500]
const growthLabels = ['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar']

onMounted(async () => {
  await Promise.all([
    dashboardStore.fetchDashboardData(),
    transactionStore.fetchTransactionsByMonth(new Date().getFullYear(), new Date().getMonth() + 1),
  ])
})
</script>

<style scoped>
.divide-y > * + * {
  border-top: 1px solid var(--surface-separator);
}
</style>
