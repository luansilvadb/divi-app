<template>
  <StandardPageLayout title="Dashboard" :is-loading="dashboardStore.isLoading">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full pb-32 lg:pb-0">
      <!-- MAIN COLUMN (CAROUSEL + CHART) -->
      <main
        class="lg:col-span-2 flex flex-col gap-6"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 600 } }"
      >
        <!-- Accounts Carousel -->
        <AccountCarousel
          :wallets="dashboardStore.wallets"
          :is-loading="dashboardStore.isLoading"
        />

        <!-- Growth Chart -->
        <BaseCard
          class="bg-surface-main border border-black/5 dark:border-white/5 shadow-2xl relative overflow-hidden group"
          :padding="isMobile ? 'none' : 'default'"
        >
          <template #header>
            <div class="flex items-center justify-between w-full relative z-10">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-2xl bg-primary-main/10 flex items-center justify-center text-primary-main shadow-inner"
                >
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
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-black text-text-primary tracking-tight leading-tight">
                    Evolução Patrimonial
                  </h3>
                  <p
                    class="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary opacity-40"
                  >
                    Projeção Baseada em Lançamentos
                  </p>
                </div>
              </div>
              <div class="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-xl">
                <button
                  class="px-4 py-1.5 text-[0.6rem] font-black uppercase tracking-widest rounded-lg bg-white dark:bg-white/10 text-text-primary dark:text-white shadow-lg transition-all"
                >
                  Últimos 6 meses
                </button>
                <button
                  class="px-4 py-1.5 text-[0.6rem] font-black uppercase tracking-widest text-text-secondary opacity-40 hover:opacity-100 transition-all"
                >
                  Anual
                </button>
              </div>
            </div>
          </template>

          <div
            class="w-full relative z-10"
            :class="[isMobile ? 'h-[500px] pt-2' : 'h-[400px] pt-6']"
          >
            <PatrimonialChart :data="growthData" :labels="growthLabels" />
          </div>
        </BaseCard>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside
        class="flex flex-col gap-6 h-full"
        v-motion
        :initial="{ opacity: 0, x: 20 }"
        :enter="{ opacity: 1, x: 0, transition: { delay: 800 } }"
      >
        <!-- Recent Activity -->
        <BaseCard
          h-full
          padding="none"
          class="bg-surface-main border border-black/5 dark:border-white/5 shadow-2xl relative overflow-hidden group flex flex-col"
        >
          <!-- Filters / Tabs -->
          <div class="px-6 pt-6 pb-4 flex-none">
            <div class="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl">
              <button
                class="flex-1 py-1.5 text-[0.65rem] font-black uppercase tracking-widest rounded-lg bg-white dark:bg-white/10 text-text-primary shadow-lg transition-all"
              >
                Todos
              </button>
              <button
                class="flex-1 py-1.5 text-[0.65rem] font-black uppercase tracking-widest text-text-secondary opacity-40 hover:opacity-100 transition-all"
              >
                Despesa
              </button>
              <button
                class="flex-1 py-1.5 text-[0.65rem] font-black uppercase tracking-widest text-text-secondary opacity-40 hover:opacity-100 transition-all"
              >
                Renda
              </button>
            </div>
          </div>

          <div
            v-if="transactionStore.transactions.length === 0"
            class="flex flex-col items-center justify-center flex-1 opacity-50 text-center"
          >
            <div class="text-4xl mb-4">☕</div>
            <p class="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary">
              Sem movimentações
            </p>
          </div>

          <div v-else class="flex flex-col px-4 pb-6 space-y-2 relative z-10 flex-1">
            <div
              v-for="t in transactionStore.transactions.slice(0, 25)"
              :key="t.id || t.localId"
              class="flex items-center p-3 rounded-2xl transition-all duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] group border border-transparent hover:border-black/5 dark:hover:border-white/5 shadow-sm hover:shadow-md"
            >
              <!-- Leading Icon Container -->
              <div class="relative mr-4 flex-none">
                <div
                  class="w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-lg overflow-hidden border border-black/5 dark:border-white/5 bg-surface-main"
                  :style="{
                    borderLeftColor:
                      transactionStore.categoryMap[t.category_id]?.color || 'transparent',
                  }"
                >
                  <img
                    v-if="transactionStore.categoryMap[t.category_id]?.icon"
                    :src="getCategoryIcon(t.category_id)"
                    class="w-6 h-6 object-contain"
                    @error="handleImageError"
                  />
                  <div v-else class="text-lg">💰</div>
                </div>
              </div>

              <!-- Content Area -->
              <div class="flex-1 min-w-0">
                <div
                  class="text-[0.95rem] font-black text-text-primary tracking-tight truncate leading-tight mb-1.5"
                >
                  {{ t.title || 'Sem título' }}
                </div>

                <!-- Badges Row -->
                <div class="flex items-center gap-1.5">
                  <span
                    class="text-[0.6rem] font-black uppercase text-text-secondary opacity-60 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded shadow-sm"
                  >
                    {{ transactionStore.walletMap[t.wallet_id]?.name || 'Nubank' }}
                  </span>
                  <span
                    class="flex items-center gap-1 text-[0.6rem] font-black uppercase bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded shadow-sm border border-black/5 dark:border-white/5"
                    :style="{
                      color:
                        transactionStore.categoryMap[t.category_id]?.color ||
                        'var(--color-text-secondary)',
                    }"
                  >
                    <span
                      class="w-1.2 h-1.2 rounded-full"
                      :style="{
                        backgroundColor:
                          transactionStore.categoryMap[t.category_id]?.color || 'currentColor',
                      }"
                    ></span>
                    {{ transactionStore.categoryMap[t.category_id]?.name || 'Geral' }}
                  </span>
                </div>
              </div>

              <!-- Trailing Area -->
              <div class="text-right ml-4 flex-none">
                <div
                  class="flex items-center justify-end gap-1 text-[1rem] font-black tracking-tighter"
                  :class="t.type === 'expense' ? 'text-error-main' : 'text-success-main'"
                >
                  <svg
                    v-if="t.type === 'expense'"
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="rotate-180"
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                  {{ t.type === 'expense' ? '-' : '+' }} R$ {{ t.amount.toLocaleString('pt-BR') }}
                </div>
              </div>
            </div>

            <!-- Footer Button - Pushed to bottom -->
            <div class="flex justify-center mt-auto pt-8 pb-4 flex-none">
              <button
                class="px-8 py-2.5 rounded-full bg-surface-main/40 hover:bg-surface-main/60 text-[0.65rem] font-black uppercase tracking-widest text-text-secondary transition-all border border-black/5 dark:border-white/5 shadow-xl hover:text-text-primary"
                @click="$router.push('/transactions')"
              >
                Ver todas as transações
              </button>
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboardStore } from '../../application/stores/dashboardStore'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import AccountCarousel from '@/shared/components/organisms/AccountCarousel.vue'
import PatrimonialChart from '@/shared/components/organisms/PatrimonialChart.vue'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IAssetLoader } from '@/shared/domain/contracts/IAssetLoader'

const assetLoader = container.resolve<IAssetLoader>(DI_TOKENS.AssetLoader)
const dashboardStore = useDashboardStore()
const transactionStore = useTransactionStore()
const isMobile = useIsMobile()

function getCategoryIcon(categoryId: string) {
  const cat = transactionStore.categoryMap[categoryId]
  return assetLoader.sanitize(cat?.icon)
}

function handleImageError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src = assetLoader.getFallback('category')
}

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
</script>
