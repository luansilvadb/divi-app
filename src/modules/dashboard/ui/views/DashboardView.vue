<template>
  <StandardPageLayout
    title="Dashboard"
    highlight="Financeiro"
    subtitle="Aqui está o panorama da sua prosperidade hoje."
  >
    <!-- Content Layout -->
    <div class="flex flex-col gap-8">
      <!-- Accounts Section -->
      <section>
        <div class="flex items-center justify-between mb-6 px-2">
          <div class="flex flex-col">
            <h2 class="text-[20px] font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">Minhas Contas</h2>
            <p class="text-[11px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Ativos em tempo real</p>
          </div>
          <div class="h-[1px] flex-1 bg-zinc-100 dark:bg-zinc-800/50 mx-6 opacity-30"></div>
        </div>

        <AccountGrid
          :wallets="dashboardStore.wallets"
          :stats-map="walletStatsMap"
          @saved="dashboardStore.fetchDashboardData()"
        />
      </section>

      <!-- Main Activity Matrix -->
      <div class="grid grid-cols-1 xl:grid-cols-[1fr_360px] 2xl:grid-cols-[1fr_400px] gap-8">

        <!-- LEFT: Insights & Charts -->
        <div class="flex flex-col gap-8 min-w-0">
          <!-- Key Metrics Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- INCOME -->
            <div class="bg-white dark:bg-[#0d1117] border border-zinc-200/50 dark:border-white/[0.04] rounded-[32px] overflow-hidden flex flex-col h-full shadow-sm shadow-zinc-200/20 dark:shadow-none">
              <div class="p-4 bg-slate-100/70 dark:bg-white/[0.06] border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
                <span class="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Receitas</span>
                <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
              </div>
              <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p class="text-[9px] font-black text-emerald-500 uppercase tracking-tighter mb-1">Receitas</p>
                  <span class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tighter tabular-nums">
                    {{ formatCurrency(transactionStore.totalIncome) }}
                  </span>
                </div>
                <div class="mt-4 pt-4 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between">
                  <span class="text-[10px] font-medium text-zinc-400 lowercase">vs. mês passado</span>
                  <span class="text-[11px] font-bold text-emerald-500">+12%</span>
                </div>
              </div>
            </div>

            <!-- EXPENSE -->
            <div class="bg-white dark:bg-[#0d1117] border border-zinc-200/50 dark:border-white/[0.04] rounded-[32px] overflow-hidden flex flex-col h-full shadow-sm shadow-zinc-200/20 dark:shadow-none">
              <div class="p-4 bg-slate-100/70 dark:bg-white/[0.06] border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
                <span class="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Despesas</span>
                <div class="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
              </div>
              <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p class="text-[9px] font-black text-red-500 uppercase tracking-tighter mb-1">Saídas</p>
                  <span class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tighter tabular-nums">
                    {{ formatCurrency(transactionStore.totalExpense) }}
                  </span>
                </div>
                <div class="mt-4 pt-4 border-t border-zinc-100 dark:border-white/5">
                   <div class="flex items-center justify-between mb-2">
                     <span class="text-[10px] font-medium text-zinc-400 lowercase">uso do orçamento</span>
                     <span class="text-[10px] font-bold text-zinc-900 dark:text-zinc-100">65%</span>
                   </div>
                   <div class="h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                     <div class="h-full bg-red-500" style="width: 65%"></div>
                   </div>
                </div>
              </div>
            </div>

            <!-- NET FLOW / HEALTH -->
            <div class="bg-white dark:bg-[#0d1117] border border-zinc-200/50 dark:border-white/[0.04] rounded-[32px] overflow-hidden flex flex-col h-full shadow-sm shadow-zinc-200/20 dark:shadow-none">
              <div class="p-4 bg-slate-100/70 dark:bg-white/[0.06] border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
                <span class="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Patrimônio Líquido</span>
                <div class="w-2 h-2 rounded-full bg-[#5F41FB] shadow-[0_0_8px_rgba(95,65,251,0.4)]"></div>
              </div>
              <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p class="text-[9px] font-black text-[#5F41FB] uppercase tracking-tighter mb-1">Total</p>
                  <span class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tighter tabular-nums">
                    {{ formatCurrency(dashboardStore.totalBalance) }}
                  </span>
                </div>
                <p class="text-[11px] font-medium text-zinc-400 mt-4 leading-tight">
                   Consolidação total de todos os ativos sincronizados.
                </p>
              </div>
            </div>
          </div>

          <!-- Chart Area -->
          <div class="bg-white dark:bg-[#0d1117] border border-zinc-200/50 dark:border-white/[0.04] rounded-[32px] overflow-hidden">
            <div class="p-6 border-b border-zinc-100 dark:border-white/5 bg-slate-100/70 dark:bg-white/[0.06] flex items-center justify-between overflow-x-auto gap-4 scrollbar-none">
              <div class="shrink-0">
                <h3 class="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 tracking-widest uppercase">Evolução Patrimonial</h3>
              </div>
              <div class="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0">
                <button
                  v-for="r in ['6m', '1y']"
                  :key="r"
                  @click="chartRange = r"
                  class="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all"
                  :class="chartRange === r ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-600'"
                >
                  {{ r === '6m' ? 'Semestral' : 'Anual' }}
                </button>
              </div>
            </div>
            <div class="p-8">
              <div class="h-[350px] w-full">
                <PatrimonialChart :data="growthData" :labels="growthLabels" />
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Live Feed (Sticky for better large screen UX) -->
        <div class="xl:sticky xl:top-8 h-fit">
          <div class="bg-white dark:bg-[#0d1117] border border-zinc-200/50 dark:border-white/[0.04] rounded-[42px] overflow-hidden flex flex-col h-full shadow-sm shadow-zinc-200/20 dark:shadow-none">
            <div class="p-6 border-b border-zinc-100 dark:border-white/5 bg-slate-100/70 dark:bg-white/[0.06]">
              <h3 class="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 tracking-widest uppercase mb-4">Atividades Recentes</h3>
              <div class="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                <button
                  v-for="opt in transactionFilterOptions"
                  :key="opt.value"
                  @click="transactionFilter = opt.value"
                  class="flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-tight transition-all"
                  :class="transactionFilter === opt.value ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-950 dark:text-white' : 'text-zinc-400'"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <!-- Feed Content -->
            <div class="flex-1 overflow-y-auto p-4 space-y-2 max-h-[780px] scrollbar-thin">
              <div
                v-for="t in filteredTransactions"
                :key="t.id"
                class="group flex items-center gap-3 p-2.5 rounded-2xl hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-all cursor-pointer"
              >
                <div class="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center shrink-0 border border-zinc-200/50 dark:border-white/5 relative">
                  <div class="absolute left-0 top-2 bottom-2 w-1 rounded-r-full" :style="{ background: transactionStore.categoryMap[t.category_id]?.color }"></div>
                  <img v-if="transactionStore.categoryMap[t.category_id]?.icon" :src="getCategoryIcon(t.category_id)" class="w-4 h-4 grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all" />
                  <i v-else class="i-lucide-activity text-zinc-300"></i>
                </div>

                <div class="flex-1 min-w-0">
                  <p class="text-[12px] font-semibold text-zinc-900 dark:text-zinc-100 truncate tracking-tight">{{ t.title || 'Atividade' }}</p>
                  <p class="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter mt-0.5 truncate">
                    {{ transactionStore.walletMap[t.wallet_id]?.name || 'Conta' }}
                  </p>
                </div>

                <div class="text-right shrink-0">
                  <p class="text-[12px] font-bold tabular-nums" :class="t.type === 'expense' ? 'text-red-500' : 'text-emerald-500'">
                    {{ t.type === 'expense' ? '-' : '+' }} R$ {{ Math.abs(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 0 }) }}
                  </p>
                </div>
              </div>

              <div v-if="filteredTransactions.length === 0" class="flex flex-col items-center justify-center py-20 opacity-10">
                <i class="i-lucide-wind text-4xl mb-2"></i>
                <span class="text-[10px] font-bold uppercase tracking-[0.4em]">Silence</span>
              </div>
            </div>

            <div class="p-4 border-t border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02] text-center">
              <button @click="$router.push('/transactions')" class="text-[10px] font-bold text-zinc-400 hover:text-primary uppercase tracking-[0.1em] transition-all">
                Ver Todo Histórico
              </button>
            </div>
        </div>
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
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IAssetLoader } from '@/shared/domain/contracts/IAssetLoader'
import type { TransactionRepositoryPort } from '@/modules/transactions/application/TransactionRepositoryPort'
import type { Transaction } from '@/shared/domain/entities/Transaction'

const dashboardStore = useDashboardStore()
const transactionStore = useTransactionStore()
const assetLoader = container.resolve<IAssetLoader>(DI_TOKENS.AssetLoader)
const transactionRepo = container.resolve<TransactionRepositoryPort>(DI_TOKENS.TransactionRepository)

const premiumCardClasses = "bg-white dark:bg-[#111622] border border-zinc-100 dark:border-white/[0.04] rounded-[42px] p-7 transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_30px_70px_rgba(0,0,0,0.3)] hover:-translate-y-0.5"

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
  const catMap = transactionStore.categoryMap || {}

  transactions.forEach((t) => {
    if (!stats[t.wallet_id]) {
      stats[t.wallet_id] = { income: 0, expense: 0, totalCount: 0, trend: 0 }
    }
    const s = stats[t.wallet_id]
    s.totalCount++
    if (t.type === 'income') s.income += t.amount
    else s.expense += t.amount
  })

  for (const id in stats) {
    const s = stats[id]
    const vol = s.income + s.expense
    s.trend = vol > 0 ? ((s.income - s.expense) / vol) * 100 : 0
  }
  return stats
})

function getCategoryIcon(id: string) { return assetLoader.sanitize(transactionStore.categoryMap[id]?.icon) }
function formatCurrency(v: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v) }

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
.scrollbar-thin::-webkit-scrollbar { width: 4px; }
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgb(228 228 231); /* zinc-200 */
  border-radius: 9999px;
}
:deep(.dark) .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgb(39 39 42); /* zinc-800 */
}
</style>
