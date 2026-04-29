<template>
  <StandardPageLayout
    title="Dashboard"
    highlight="Dashboard"
    subtitle=""
  >
    <div class="flex flex-col gap-6 pb-4">

      <!-- ── HERO SUMMARY ─────────────────────────────────── -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <!-- Net Worth (destaque) -->
        <div
          class="relative overflow-hidden rounded-[var(--radius-2xl)] flex flex-col justify-between p-7 col-span-1 md:col-span-1 bg-primary text-white min-h-[160px] shadow-lg shadow-primary/15 border border-white/5 cursor-default"
          id="dashboard-networth-card"
        >
          <!-- Premium Animated Mesh -->
          <div class="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
            <div class="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-mesh-slow bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.15)_0%,transparent_50%)]"></div>
          </div>

          <div class="relative z-10 flex items-start justify-between">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.15em] text-white/70">{{ messages.MSG_I_NET_WORTH }}</p>
            </div>
            <div class="w-9 h-9 rounded-full flex items-center justify-center bg-white/15 backdrop-blur-sm border border-white/10">
              <i class="i-lucide-landmark text-base text-white"></i>
            </div>
          </div>
          <div class="relative z-10">
            <p class="text-3xl font-black tracking-tight tabular-nums mt-1 leading-none">
              {{ formatCurrency(dashboardStore.totalBalance) }}
            </p>
            <p class="text-[11px] mt-2 text-white/60 font-medium">{{ messages.MSG_I_NET_WORTH_DESC }}</p>
          </div>
        </div>

        <!-- Receitas -->
        <div
          class="rounded-[var(--radius-2xl)] flex flex-col justify-between p-7 overflow-hidden bg-surface-primary border border-separator min-h-[160px] shadow-md shadow-zinc-200/50 dark:shadow-none cursor-default"
          id="dashboard-income-card"
        >
          <div class="flex items-start justify-between">
            <p class="text-[10px] font-bold uppercase tracking-[0.15em] text-tertiary">{{ messages.MSG_I_INCOME }}</p>
            <div class="w-8 h-8 rounded-full flex items-center justify-center bg-success/10">
              <i class="i-lucide-trending-up text-sm text-success"></i>
            </div>
          </div>
          <div>
            <p class="text-2xl font-bold tracking-tight tabular-nums mt-1 text-label">
              {{ formatCurrency(transactionStore.totalIncome) }}
            </p>
            <div class="flex items-center gap-1.5 mt-2.5">
              <div class="flex items-center justify-center px-1.5 py-0.5 rounded bg-success/10 text-success text-[10px] font-bold">
                +12%
              </div>
              <span class="text-[10px] font-medium text-tertiary">{{ messages.MSG_I_VS_LAST_MONTH }}</span>
            </div>
          </div>
        </div>

        <!-- Despesas -->
        <div
          class="rounded-[var(--radius-2xl)] flex flex-col justify-between p-7 overflow-hidden bg-surface-primary border border-separator min-h-[160px] shadow-md shadow-zinc-200/50 dark:shadow-none cursor-default"
          id="dashboard-expense-card"
        >
          <div class="flex items-start justify-between">
            <p class="text-[10px] font-bold uppercase tracking-[0.15em] text-tertiary">{{ messages.MSG_I_EXPENSE }}</p>
            <div class="w-8 h-8 rounded-full flex items-center justify-center bg-error/10">
              <i class="i-lucide-trending-down text-sm text-error"></i>
            </div>
          </div>
          <div>
            <p class="text-2xl font-bold tracking-tight tabular-nums mt-1 text-label">
              {{ formatCurrency(transactionStore.totalExpense) }}
            </p>
            <!-- IBudget usage bar -->
            <div class="mt-4">
              <div class="flex items-center justify-between mb-1.5 px-0.5">
                <span class="text-[10px] font-medium text-tertiary">{{ messages.MSG_I_BUDGET_USAGE }}</span>
                <span class="text-[10px] font-bold text-secondary">65%</span>
              </div>
              <div class="h-1.5 rounded-full overflow-hidden bg-surface-secondary">
                <div class="h-full rounded-full transition-all duration-500 ease-out w-[65%] bg-error/80"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── CONTAS ──────────────────────────────────────── -->
      <section id="dashboard-accounts-section">
        <div class="flex items-center justify-between mb-4 px-0.5">
          <div>
            <h2 class="text-[17px] font-semibold tracking-tight text-label">{{ messages.MSG_I_MY_ACCOUNTS }}</h2>
            <p class="text-[12px] mt-0.5 text-tertiary">{{ messages.MSG_I_REAL_TIME_ASSETS }}</p>
          </div>
        </div>
        <AccountGrid
          :wallets="dashboardStore.wallets"
          :stats-map="walletstatsMap"
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
                <h3 class="text-[13px] font-semibold text-label">{{ messages.MSG_I_PATRIMONIAL_EVOLUTION }}</h3>
                <p class="text-[11px] mt-0.5 text-tertiary">{{ messages.MSG_I_CONSOLIDATED_HISTORY }}</p>
              </div>
              <!-- Range Segmented Control -->
              <div class="flex p-1 rounded-lg bg-surface-secondary border border-separator">
                <button
                  v-for="r in [{ key: '6m', label: messages.MSG_I_MONTHS_6 }, { key: '1y', label: messages.MSG_I_YEAR_1 }]"
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

          <!-- Recent transactions Feed -->
          <div
            class="rounded-xl overflow-hidden bg-surface-primary border border-separator transition-colors duration-150 ease-out"
            id="dashboard-recent-transactions"
          >
            <div
              class="px-6 py-4 flex items-center justify-between border-b border-separator bg-surface-secondary"
            >
              <h3 class="text-[13px] font-semibold text-label">{{ messages.MSG_I_RECENT_ACTIVITIES }}</h3>

              <!-- Filter Segmented Control -->
              <div class="flex p-1 rounded-lg bg-surface-secondary border border-separator">
                <button
                  v-for="opt in ITransactionFilterOptions"
                  :key="opt.value"
                  @click="ITransactionFilter = opt.value"
                  class="px-3 py-1 rounded-md text-[11px] font-medium transition-all duration-150 ease-out"
                  :class="ITransactionFilter === opt.value ? 'bg-surface-primary text-primary shadow-sm' : 'text-tertiary'"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <!-- Feed List -->
            <div class="divide-y divide-separator">
              <div
                v-for="t in filteredtransactions"
                :key="t.id"
                class="flex items-center gap-3 px-5 py-3.5 transition-colors duration-150 cursor-pointer group hover:bg-surface-secondary"
              >
                <!-- ICategory Icon -->
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
                    {{ transactionStore.IWalletMap[t.wallet_id]?.name || 'Conta' }}
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
                v-if="filteredtransactions.length === 0"
                class="flex flex-col items-center justify-center py-16 gap-3 text-tertiary"
              >
                <i class="i-lucide-list-x text-2xl opacity-40"></i>
                <p class="text-[12px] font-medium opacity-60">{{ messages.MSG_I_NO_ACTIVITY }}</p>
              </div>
            </div>

            <!-- View All -->
            <div class="px-5 py-3.5 border-t border-separator">
              <button
                @click="$router.push('/transactions')"
                class="text-[12px] font-medium transition-colors duration-200 w-full text-center text-primary"
              >
                {{ messages.MSG_I_VIEW_ALL_HISTORY }}
              </button>
            </div>
          </div>
        </section>

        <!-- RIGHT: ICategory Breakdown (sticky) -->
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
import { messages } from '@/shared/messages/catalog'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import AccountGrid from '@/shared/components/organisms/AccountGrid.vue'
import PatrimonialChart from '@/shared/components/organisms/PatrimonialChart.vue'
import CategoryBars from '../components/CategoryBars.vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IAssetLoader } from '@/shared/domain/ports/IAssetLoader'
import type { ITransactionRepository } from '@/modules/transactions/core/ports/ITransactionRepository'
import type { ITransaction } from '@/modules/transactions/core/entities/ITransaction'

const dashboardStore = useDashboardStore()
const transactionStore = useTransactionStore()
const assetLoader = container.resolve<IAssetLoader>(DI_TOKENS.IAssetLoader)
const ITransactionRepo = container.resolve<ITransactionRepository>(DI_TOKENS.ITransactionRepository)

const chartRange = ref('6m')
const ITransactionFilter = ref('all')
const ITransactionFilterOptions = [
  { label: messages.MSG_I_ALL, value: 'all' },
  { label: messages.MSG_I_INCOME, value: 'income' },
  { label: messages.MSG_I_EXPENSE, value: 'expense' },
]

const livetransactions = useObservable(ITransactionRepo.watchAll()) as { value: ITransaction[] | undefined }

const filteredtransactions = computed(() => {
  const t = livetransactions.value || []
  if (ITransactionFilter.value === 'all') return t.slice(0, 15)
  return t.filter((item) => item.type === ITransactionFilter.value).slice(0, 15)
})

const walletstatsMap = computed(() => {
  const stats: Record<string, any> = {}
  const transactions = transactionStore.activetransactions || []

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
    transactionStore.fetchtransactionsByMonth(new Date().getFullYear(), new Date().getMonth() + 1),
  ])
})
</script>

<style scoped>
@keyframes mesh-slow {
  0% { transform: translate(-5%, -5%) rotate(0deg); }
  50% { transform: translate(5%, 5%) rotate(5deg); }
  100% { transform: translate(-5%, -5%) rotate(0deg); }
}

.animate-mesh-slow {
  animation: mesh-slow 15s ease-in-out infinite;
}

.divide-y > * + * {
  border-top: 1px solid var(--surface-separator);
}
</style>

