<template>
  <StandardPageLayout
    title="Dashboard"
    highlight="Financeiro"
    subtitle="Bem-vindo de volta! Aqui está um resumo da sua saúde financeira."
  >
    <template #action>
      <BaseButton
        variant="primary"
        class="!hidden md:!flex !rounded-2xl !px-6 !py-3 shadow-xl shadow-violet-500/20 hover:scale-105 transition-all duration-500 group/quick"
        @click="showQuickEntry = true"
      >
        <template #icon>
          <i class="i-lucide-plus text-lg transition-transform duration-500 group-hover/quick:rotate-90"></i>
        </template>
        <span class="text-[10px] font-bold uppercase tracking-widest ml-2">Entrada Rápida</span>
      </BaseButton>
    </template>

    <!-- Initialization Error Banner -->
    <div
      v-if="dashboardStore.initializationError"
      class="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 animate-fade-in"
    >
      <div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
        <i class="i-lucide-alert-circle text-xl"></i>
      </div>
      <div class="flex-1">
        <h4 class="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-1">
          Limitação de Sistema Detectada
        </h4>
        <p class="text-xs font-bold text-zinc-600 dark:text-zinc-400 leading-relaxed">
          O modo anônimo pode limitar algumas funcionalidades locais. Recomendamos o uso do modo
          padrão para uma experiência completa.
        </p>
      </div>
      <NButton quaternary circle @click="dashboardStore.initializationError = false">
        <template #icon><i class="i-lucide-x text-red-500"></i></template>
      </NButton>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_400px] gap-8">
      <!-- MAIN COLUMN -->
      <main class="flex flex-col gap-8">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- INCOME CARD -->
          <BaseCard padding="none" class="hover-glow">
            <div class="p-6">
              <h4 class="text-[10px] font-bold uppercase tracking-widest text-emerald-500 opacity-80 mb-2">Entradas (Mês)</h4>
              <div class="text-3xl font-black text-zinc-800 dark:text-zinc-50 tracking-tighter flex items-baseline gap-1">
                <span class="text-lg opacity-40 font-bold">R$</span>
                {{ transactionStore.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
              </div>
            </div>
            <div class="px-6 pb-6 pt-2 flex flex-col gap-4">
              <NProgress type="line" :percentage="75" :show-indicator="false" color="#10b981" :height="8" class="!rounded-full" />
              <div class="flex items-center gap-2">
                <i class="i-lucide-trending-up text-emerald-500 text-sm"></i>
                <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
                  <span class="text-emerald-500">+12%</span> em relação ao mês anterior
                </p>
              </div>
            </div>
          </BaseCard>

          <!-- EXPENSE CARD -->
          <BaseCard padding="none" class="hover-glow">
            <div class="p-6">
              <h4 class="text-[10px] font-bold uppercase tracking-widest text-red-500 opacity-80 mb-2">Saídas (Mês)</h4>
              <div class="text-3xl font-black text-zinc-800 dark:text-zinc-50 tracking-tighter flex items-baseline gap-1">
                <span class="text-lg opacity-40 font-bold">R$</span>
                {{ transactionStore.totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
              </div>
            </div>
            <div class="px-6 pb-6 pt-2 flex flex-col gap-4">
              <NProgress type="line" :percentage="42" :show-indicator="false" color="#ef4444" :height="8" class="!rounded-full" />
              <div class="flex items-center gap-2">
                <i class="i-lucide-trending-down text-red-500 text-sm"></i>
                <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
                  Economize <span class="text-red-500">R$ 45,00/dia</span> para a meta
                </p>
              </div>
            </div>
          </BaseCard>

          <!-- BALANCE CARD -->
          <BaseCard padding="none" class="hover-glow">
            <div class="p-6">
              <h4 class="text-[10px] font-bold uppercase tracking-widest text-violet-500 opacity-80 mb-2">Saldo Geral</h4>
              <div class="text-3xl font-black text-zinc-800 dark:text-zinc-50 tracking-tighter flex items-baseline gap-1">
                <span class="text-lg opacity-40 font-bold">R$</span>
                {{ Math.abs(dashboardStore.totalBalance).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
              </div>
            </div>
            <div class="px-6 pb-6 pt-2 flex flex-col gap-4">
              <NProgress type="line" :percentage="88" :show-indicator="false" color="#8b5cf6" :height="8" class="!rounded-full" />
              <div class="flex items-center gap-2">
                <i class="i-lucide-award text-violet-500 text-sm"></i>
                <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
                  <span class="text-violet-500">Parabéns!</span> No caminho certo
                </p>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Accounts -->
        <section class="flex flex-col gap-6">
          <div class="flex items-center justify-between px-2">
            <h2 class="text-xl font-black text-zinc-800 dark:text-zinc-50 tracking-tight flex items-center gap-3">
              <span class="w-1.5 h-6 bg-violet-500 rounded-full"></span>
              Minhas Contas
            </h2>
            <NButton quaternary size="small" @click="$router.push('/wallets')" class="!text-[10px] font-black uppercase tracking-widest text-violet-500">
              Ver Todas <i class="i-lucide-chevron-right ml-1"></i>
            </NButton>
          </div>
          <AccountCarousel :wallets="dashboardStore.wallets" />
        </section>

        <!-- Chart Section -->
        <BaseCard class="flex-1 !p-6 hover-glow overflow-hidden relative" h-full>
          <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-violet-500/5 blur-[100px] pointer-events-none"></div>
          
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mb-8 gap-4 relative z-10">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 shadow-inner">
                <i class="i-lucide-line-chart text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-black text-zinc-800 dark:text-zinc-50 tracking-tight leading-tight">Evolução Patrimonial</h3>
                <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 opacity-60">Projeção de Lançamentos</p>
              </div>
            </div>
            
            <NRadioGroup v-model:value="chartRange" size="small" class="!bg-zinc-100 dark:!bg-zinc-900 !p-1 !rounded-xl border border-zinc-200 dark:border-zinc-800">
              <NRadioButton value="6m" class="!rounded-lg !border-none !bg-transparent text-[10px] font-bold uppercase">6 Meses</NRadioButton>
              <NRadioButton value="1y" class="!rounded-lg !border-none !bg-transparent text-[10px] font-bold uppercase">Anual</NRadioButton>
            </NRadioGroup>
          </div>

          <div class="h-[300px] sm:h-[400px] w-full relative z-10">
            <PatrimonialChart :data="growthData" :labels="growthLabels" />
          </div>
        </BaseCard>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="flex flex-col gap-6">
        <BaseCard h-full padding="none" class="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md hover-glow flex flex-col">
          <div class="p-6 flex-none">
            <div class="w-full bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-2xl flex border border-zinc-200 dark:border-zinc-800">
              <button
                v-for="opt in transactionFilterOptions"
                :key="opt.value"
                class="flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border-none"
                :class="transactionFilter === opt.value ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-md' : 'text-zinc-400 hover:text-zinc-600'"
                @click="transactionFilter = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <div v-if="filteredTransactions.length === 0" class="flex flex-col items-center justify-center flex-1 py-12 px-6 text-center">
            <div class="text-5xl mb-6 opacity-20">✨</div>
            <h3 class="text-xs font-black text-zinc-800 dark:text-zinc-50 uppercase tracking-widest mb-2">Sem transações</h3>
            <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-8 opacity-60">Comece seu controle hoje!</p>
            <BaseButton variant="primary" class="!rounded-xl !px-8" @click="simulateAddTransaction">Começar</BaseButton>
          </div>

          <div v-else class="flex flex-col px-4 pb-6 space-y-2 flex-1">
            <div v-for="t in filteredTransactions" :key="t.id" class="flex items-center p-3 rounded-2xl transition-all duration-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 group border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
              <div class="mr-4 flex-none">
                <div class="w-11 h-11 rounded-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                     :style="{ borderLeft: `3px solid ${transactionStore.categoryMap[t.category_id]?.color || '#a1a1aa'}` }">
                  <img v-if="transactionStore.categoryMap[t.category_id]?.icon" :src="getCategoryIcon(t.category_id)" class="w-6 h-6 object-contain" @error="handleImageError" />
                  <i v-else class="i-lucide-banknote text-lg text-zinc-400"></i>
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="text-sm font-bold text-zinc-800 dark:text-zinc-50 truncate leading-tight mb-1">{{ t.title || 'Sem título' }}</div>
                <div class="flex items-center gap-2 opacity-60">
                  <span class="text-[9px] font-bold uppercase tracking-widest">{{ transactionStore.walletMap[t.wallet_id]?.name || 'Conta' }}</span>
                  <span class="w-1 h-1 rounded-full bg-zinc-400"></span>
                  <span class="text-[9px] font-bold uppercase tracking-widest" :style="{ color: transactionStore.categoryMap[t.category_id]?.color }">
                    {{ transactionStore.categoryMap[t.category_id]?.name || 'Geral' }}
                  </span>
                </div>
              </div>

              <div class="text-right ml-4 flex-none">
                <div class="text-sm font-black tracking-tighter" :class="t.type === 'expense' ? 'text-red-500' : 'text-emerald-500'">
                  {{ t.type === 'expense' ? '-' : '+' }} R$ {{ Math.abs(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
                </div>
              </div>
            </div>

            <div class="mt-auto pt-8 flex justify-center">
              <NButton quaternary @click="$router.push('/transactions')" class="!text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Ver todo o histórico
              </NButton>
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>

    <QuickEntryModal v-model:visible="showQuickEntry" />
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { v7 as uuidv7 } from 'uuid'
import { useObservable } from '@vueuse/rxjs'
import { NButton, NProgress, NRadioGroup, NRadioButton } from 'naive-ui'
import { useDashboardStore } from '@/modules/dashboard/application/stores/dashboardStore'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import AccountCarousel from '@/shared/components/organisms/AccountCarousel.vue'
import PatrimonialChart from '@/shared/components/organisms/PatrimonialChart.vue'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import QuickEntryModal from '@/modules/transactions/ui/components/QuickEntryModal.vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IAssetLoader } from '@/shared/domain/contracts/IAssetLoader'
import type { TransactionRepositoryPort } from '@/modules/transactions/application/TransactionRepositoryPort'
import type { Transaction } from '@/shared/domain/entities/Transaction'

const dashboardStore = useDashboardStore()
const transactionStore = useTransactionStore()
const assetLoader = container.resolve<IAssetLoader>(DI_TOKENS.AssetLoader)
const transactionRepo = container.resolve<TransactionRepositoryPort>(DI_TOKENS.TransactionRepository)

const showQuickEntry = ref(false)
const chartRange = ref('6m')
const transactionFilter = ref('all')

const transactionFilterOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Saídas', value: 'expense' },
  { label: 'Entradas', value: 'income' },
]

const liveTransactions = useObservable(transactionRepo.watchAll()) as { value: Transaction[] | undefined }

const filteredTransactions = computed(() => {
  const transactions = liveTransactions.value || []
  if (transactionFilter.value === 'all') return transactions.slice(0, 15)
  return transactions.filter((t: Transaction) => t.type === transactionFilter.value).slice(0, 15)
})

async function simulateAddTransaction() {
  await transactionStore.saveTransaction({
    id: uuidv7(),
    user_id: 'default-user',
    title: 'Lançamento Inicial ✨',
    amount: 100,
    type: 'income',
    category_id: 'default-cat',
    wallet_id: 'default-wallet',
    date: new Date().toISOString(),
    sync_status: 'pending',
    deleted: false,
    client_updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    version: 1,
  })
}

function getCategoryIcon(categoryId: string) {
  const cat = transactionStore.categoryMap[categoryId]
  return assetLoader.sanitize(cat?.icon)
}

function handleImageError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src = assetLoader.getFallback('category')
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
