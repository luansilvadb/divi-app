<template>
  <StandardPageLayout
    title="Dashboard"
    highlight="Financeiro"
    subtitle="Bem-vindo de volta! Aqui está um resumo da sua saúde financeira."
  >
    <!-- Initialization Error Banner (Incognito Mode) -->
    <div
      v-if="dashboardStore.initializationError"
      class="mb-8 p-4 rounded-2xl bg-error-main/10 border border-error-main/20 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500"
    >
      <div class="w-10 h-10 rounded-xl bg-error-main/10 flex items-center justify-center text-error-main shrink-0 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <div class="flex-1">
        <h4 class="text-[0.65rem] font-black uppercase tracking-widest text-error-main mb-1">Limitação de Sistema Detectada</h4>
        <p class="text-xs font-bold text-text-primary/70 leading-relaxed">
          O modo anônimo pode limitar algumas funcionalidades locais. Recomendamos o uso do modo padrão para uma experiência completa e persistente.
        </p>
      </div>
      <BaseButton variant="ghost" class="!px-4 !py-2 text-[0.6rem] font-black uppercase tracking-widest text-error-main hover:bg-error-main/10" @click="dashboardStore.initializationError = false">
        Entendi
      </BaseButton>
    </div>

    <!-- Content Grid -->
    <div
      class="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_400px] gap-6 lg:gap-10 items-stretch"
    >
      <!-- MAIN COLUMN -->
      <main class="flex flex-col gap-8 flex-1">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- INCOME CARD -->
          <BaseCard
            padding="none"
            class="overflow-hidden border border-black/5 dark:border-white/5 bg-surface-main shadow-2xl flex flex-col group transition-all duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
          >
            <!-- Header Area (Harmonized Brand Glow) -->
            <div class="p-6 relative">
              <div
                class="absolute inset-0 bg-gradient-to-br from-success-main/5 to-transparent pointer-events-none"
              ></div>
              <div class="flex justify-between items-start relative z-10">
                <div>
                  <h4
                    class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-success-main/80 mb-2"
                  >
                    Entradas (Mês)
                  </h4>
                  <div
                    class="text-3xl font-black text-text-primary tracking-tighter flex items-baseline gap-1"
                  >
                    <span class="text-lg opacity-50 font-bold">R$</span>
                    {{
                      transactionStore.totalIncome.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })
                    }}
                  </div>
                </div>
                <div
                  class="w-12 h-12 rounded-2xl bg-success-main/10 flex items-center justify-center text-success-main shadow-inner border border-success-main/20"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M7 10l5 5 5-5z" class="rotate-180 origin-center" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Progress Section (Integrated) -->
            <div class="px-6 pb-6 pt-2 flex flex-col gap-4 relative">
              <div
                class="h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent mb-2"
              ></div>

              <div
                class="flex items-center justify-between text-[0.6rem] font-black uppercase tracking-widest text-text-secondary/60"
              >
                <span>Início do Mês</span>
                <span>Projeção</span>
              </div>

              <div
                class="relative h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5"
              >
                <div
                  class="absolute left-0 top-0 h-full bg-gradient-to-r from-success-main/60 to-success-main transition-all duration-1000 shadow-[0_0_15px_rgba(5,150,105,0.3)]"
                  :style="{ width: '75%' }"
                ></div>
              </div>

              <div class="flex items-center gap-2 mt-1">
                <span class="flex-none p-1 rounded bg-success-main/10 text-success-main">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m5 12 7-7 7 7" />
                    <path d="M12 19V5" />
                  </svg>
                </span>
                <p class="text-[0.62rem] font-bold text-text-secondary/80 uppercase tracking-tight">
                  <span class="text-success-main">+12%</span> em relação ao mês anterior
                </p>
              </div>
            </div>
          </BaseCard>

          <!-- EXPENSE CARD -->
          <BaseCard
            padding="none"
            class="overflow-hidden border border-black/5 dark:border-white/5 bg-surface-main shadow-2xl flex flex-col group transition-all duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
          >
            <!-- Header Area (Harmonized Brand Glow) -->
            <div class="p-6 relative">
              <div
                class="absolute inset-0 bg-gradient-to-br from-error-main/5 to-transparent pointer-events-none"
              ></div>
              <div class="flex justify-between items-start relative z-10">
                <div>
                  <h4
                    class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-error-main/80 mb-2"
                  >
                    Saídas (Mês)
                  </h4>
                  <div
                    class="text-3xl font-black text-text-primary tracking-tighter flex items-baseline gap-1"
                  >
                    <span class="text-lg opacity-50 font-bold">R$</span>
                    {{
                      transactionStore.totalExpense.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })
                    }}
                  </div>
                </div>
                <div
                  class="w-12 h-12 rounded-2xl bg-error-main/10 flex items-center justify-center text-error-main shadow-inner border border-error-main/20"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Progress Section (Integrated) -->
            <div class="px-6 pb-6 pt-2 flex flex-col gap-4 relative">
              <div
                class="h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent mb-2"
              ></div>

              <div
                class="flex items-center justify-between text-[0.6rem] font-black uppercase tracking-widest text-text-secondary/60"
              >
                <span>Gasto Real</span>
                <span>Meta Mensal</span>
              </div>

              <div
                class="relative h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5"
              >
                <div
                  class="absolute left-0 top-0 h-full bg-gradient-to-r from-error-main/60 to-error-main transition-all duration-1000 shadow-[0_0_15px_rgba(225,29,72,0.3)]"
                  :style="{ width: '42%' }"
                ></div>
              </div>

              <div class="flex items-center gap-2 mt-1">
                <span class="flex-none p-1 rounded bg-error-main/10 text-error-main">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m19 12-7 7-7-7" />
                    <path d="M12 5v14" />
                  </svg>
                </span>
                <p class="text-[0.62rem] font-bold text-text-secondary/80 uppercase tracking-tight">
                  Economize <span class="text-error-main">R$ 45,00/dia</span> para manter a meta
                </p>
              </div>
            </div>
          </BaseCard>

          <!-- BALANCE CARD -->
          <BaseCard
            padding="none"
            class="overflow-hidden border border-black/5 dark:border-white/5 bg-surface-main shadow-2xl flex flex-col group transition-all duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
          >
            <!-- Header Area (Harmonized Brand Glow) -->
            <div class="p-6 relative">
              <div
                class="absolute inset-0 bg-gradient-to-br from-primary-main/10 to-transparent pointer-events-none"
              ></div>
              <div class="flex justify-between items-start relative z-10">
                <div>
                  <h4
                    class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary-main mb-2"
                  >
                    Saldo Geral
                  </h4>
                  <div
                    class="text-3xl font-black text-text-primary tracking-tighter flex items-baseline gap-1"
                  >
                    <span class="text-lg opacity-50 font-bold">R$</span>
                    {{
                      dashboardStore.totalBalance.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })
                    }}
                  </div>
                </div>
                <div
                  class="w-12 h-12 rounded-2xl bg-primary-main/10 flex items-center justify-center text-primary-main shadow-inner border border-primary-main/20"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Progress Section (Integrated) -->
            <div class="px-6 pb-6 pt-2 flex flex-col gap-4 relative">
              <div
                class="h-px bg-gradient-to-r from-black/5 via-black/[0.02] to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent mb-2"
              ></div>

              <div
                class="flex items-center justify-between text-[0.6rem] font-black uppercase tracking-widest text-text-secondary/60"
              >
                <span>Liquidez</span>
                <span>Objetivo Anual</span>
              </div>

              <div
                class="relative h-2.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden border border-black/5 dark:border-white/5"
              >
                <div
                  class="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-main/60 to-primary-main transition-all duration-1000 shadow-[0_0_15px_rgba(61,90,128,0.3)]"
                  :style="{ width: '88%' }"
                ></div>
              </div>

              <div class="flex items-center gap-2 mt-1">
                <span class="flex-none p-1 rounded bg-accent-main/10 text-accent-main">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
                <p class="text-[0.62rem] font-bold text-text-secondary/80 uppercase tracking-tight">
                  <span class="text-accent-main">Parabéns!</span> Caminho certo para a meta
                </p>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Accounts (Carousel) -->
        <section
          class="flex flex-col gap-6"
        >
          <div class="flex items-center justify-between px-2">
            <h2 class="text-xl font-black text-text-primary tracking-tight flex items-center gap-3">
              <span class="w-1.5 h-6 bg-accent-main rounded-full"></span>
              Minhas Contas
            </h2>
            <BaseButton variant="ghost" class="!text-[0.7rem] !font-black !uppercase !tracking-[0.2em] !text-accent-main !p-0 hover:!text-text-primary transition-all flex items-center gap-2 group" @click="$router.push('/wallets')">
              Ver Todas
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="transition-all duration-300 transform group-hover:translate-x-1"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </BaseButton>
          </div>
          <AccountCarousel :wallets="dashboardStore.wallets" />
        </section>

        <!-- Chart Section -->
        <BaseCard
          class="flex-1 bg-surface-main border border-black/5 dark:border-white/5 shadow-2xl relative overflow-hidden group !p-4 h-full transition-all duration-300"
          h-full
        >
          <!-- Decorative Glow -->
          <div
            class="absolute -bottom-20 w-64 h-64 bg-primary-main/5 blur-[100px] pointer-events-none"
          ></div>

          <template #header>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full relative z-10 px-2 gap-4">
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-xl bg-primary-main/10 flex items-center justify-center text-primary-main shadow-inner"
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
              <SelectButton v-model="chartRange" :options="chartRangeOptions" optionLabel="label" optionValue="value" class="w-full sm:w-auto text-[0.6rem] font-black uppercase tracking-widest" />
            </div>
          </template>

          <div class="h-[300px] sm:h-[400px] w-full pt-6 relative z-10">
            <PatrimonialChart :data="growthData" :labels="growthLabels" />
          </div>
        </BaseCard>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside
        class="flex flex-col gap-6 h-full"
      >
        <!-- Recent Activity -->
        <BaseCard
          h-full
          padding="none"
          class="bg-surface-main border border-black/5 dark:border-white/5 shadow-2xl relative overflow-hidden group flex flex-col"
        >
          <!-- Segmented Control (Pill Design) -->
          <div class="px-6 pt-6 pb-2 flex-none">
            <div
              class="w-full bg-black/20 dark:bg-white/5 p-1 rounded-2xl flex border border-black/5 dark:border-white/5 transition-all duration-500"
            >
              <button
                v-for="opt in transactionFilterOptions"
                :key="opt.value"
                class="flex-1 py-2.5 rounded-xl text-[0.65rem] font-black uppercase tracking-[0.15em] transition-all duration-300 relative"
                :class="
                  transactionFilter === opt.value
                    ? 'bg-black/40 dark:bg-white/10 text-text-primary shadow-lg ring-1 ring-white/5'
                    : 'text-text-secondary/40 hover:text-text-secondary/60'
                "
                @click="transactionFilter = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <div
            v-if="filteredTransactions.length === 0"
            class="flex flex-col items-center justify-center flex-1 py-10 px-6 text-center"
          >
            <div class="text-5xl mb-6 grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">✨</div>
            <h3 class="text-sm font-black text-text-primary uppercase tracking-widest mb-2">Nenhuma transação registrada</h3>

            <p class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40 mb-8 leading-relaxed">
              Sua jornada financeira começa com o primeiro lançamento. <br>Que tal começar agora?
            </p>
            <BaseButton
              variant="primary"
              class="group/btn relative overflow-hidden !rounded-xl !px-8 !py-3 shadow-2xl hover:shadow-primary-main/20 transition-all duration-300"
              @click="simulateAddTransaction"
            >
              <span class="relative z-10 flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-widest">
                Começar
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-300 group-hover/btn:translate-x-1"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </span>
            </BaseButton>
          </div>

          <div v-else class="flex flex-col px-4 pb-6 space-y-2 relative z-10 flex-1">
            <div
              v-for="t in filteredTransactions"
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
              <BaseButton variant="ghost" class="w-full text-xs border border-black/5 dark:border-white/5" @click="$router.push('/transactions')">Ver todas as transações</BaseButton>
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
const chartRange = ref('6m')
const chartRangeOptions = [
  { label: 'Últimos 6 meses', value: '6m' },
  { label: 'Anual', value: '1y' }
]

const transactionFilter = ref('all')
const transactionFilterOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Despesa', value: 'expense' },
  { label: 'Renda', value: 'income' }
]

import { useDashboardStore } from '@/modules/dashboard/application/stores/dashboardStore'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { computed, onMounted, ref } from 'vue'
import { v7 as uuidv7 } from 'uuid'
import { useObservable } from '@vueuse/rxjs'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import AccountCarousel from '@/shared/components/organisms/AccountCarousel.vue'
import PatrimonialChart from '@/shared/components/organisms/PatrimonialChart.vue'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import SelectButton from 'primevue/selectbutton'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IAssetLoader } from '@/shared/domain/contracts/IAssetLoader'
import type { TransactionRepositoryPort } from '@/modules/transactions/application/TransactionRepositoryPort'

const assetLoader = container.resolve<IAssetLoader>(DI_TOKENS.AssetLoader)
const transactionRepo = container.resolve<TransactionRepositoryPort>(DI_TOKENS.TransactionRepository)
const dashboardStore = useDashboardStore()
const transactionStore = useTransactionStore()

// Reactive binding to Dexie via useObservable
const liveTransactions = useObservable(transactionRepo.watchAll() as any)

const filteredTransactions = computed(() => {
  const transactions = liveTransactions.value || []
  if (transactionFilter.value === 'all') return transactions.slice(0, 25)
  return transactions
    .filter((t: any) => t.type === transactionFilter.value)
    .slice(0, 25)
})

async function simulateAddTransaction() {
  const now = new Date()
  await transactionStore.saveTransaction({
    id: uuidv7(),
    user_id: 'default-user',
    title: 'Transação Inicial ✨',
    amount: 100,
    type: 'income',
    category_id: 'default-cat',
    wallet_id: 'default-wallet',
    date: now.toISOString(),
    deleted: false,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
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
