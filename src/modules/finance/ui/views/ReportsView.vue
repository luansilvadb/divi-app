<template>
  <div class="view-wrapper animate-fade-in relative min-h-screen">
    <!-- Feature header -->
    <BaseViewHeader
      title="Relatórios Financeiros"
      highlight="Financeiros"
      subtitle="Analise seus dados e tome melhores decisões para o seu futuro."
    >
      <template #action>
        <div
          class="flex items-center bg-bg-main dark:bg-black/20 p-1 rounded-2xl border border-black/5 dark:border-white/5"
        >
          <button
            v-for="filter in ['Mês', 'Trimestre', 'Ano']"
            :key="filter"
            class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
            :class="
              activeFilter === filter
                ? 'bg-primary-main text-white shadow-lg'
                : 'text-text-disabled hover:bg-white dark:hover:bg-white/10'
            "
            @click="activeFilter = filter"
          >
            {{ filter }}
          </button>
        </div>
      </template>
    </BaseViewHeader>

    <div class="view-content-grid">
      <!-- MAIN COLUMN: Reports & Charts -->
      <main class="main-column">
        <!-- Distribution Chart -->
        <BaseCard>
          <template #header>
            <div class="flex justify-between items-center w-full">
              <span>Distribuição por Categoria</span>
              <div class="text-[0.7rem] uppercase font-black opacity-40 tracking-widest">
                {{ activeFilter }}
              </div>
            </div>
          </template>

          <div class="flex flex-col lg:flex-row gap-12 py-4">
            <!-- Donut Chart Area -->
            <div class="flex-1 flex flex-col items-center justify-center min-h-[300px] relative">
              <div
                class="w-64 h-64 rounded-full border-[20px] border-black/5 dark:border-white/5 relative flex flex-col items-center justify-center shadow-inner"
              >
                <div
                  class="absolute inset-0 rounded-full border-[20px] border-primary-main border-t-transparent border-r-transparent -rotate-45"
                ></div>
                <span
                  class="text-[10px] font-black uppercase tracking-widest text-text-disabled mb-1"
                  >Gasto Total</span
                >
                <span class="text-3xl font-black text-error-main tracking-tighter">{{
                  formatCurrency(totalExpenses)
                }}</span>
              </div>
            </div>

            <!-- Legend Area -->
            <div class="flex-1 flex flex-col gap-6">
              <div v-for="cat in categorySummary" :key="cat.name" class="flex flex-col gap-2.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-2.5 h-2.5 rounded-full shadow-sm"
                      :style="{ backgroundColor: cat.color }"
                    ></div>
                    <span
                      class="text-[11px] font-black uppercase tracking-widest text-text-primary"
                      >{{ cat.name }}</span
                    >
                  </div>
                  <div class="flex items-center gap-4">
                    <span class="text-[11px] font-black text-text-disabled tracking-tight"
                      >{{ cat.percentage }}%</span
                    >
                    <span class="text-[11px] font-black text-text-primary tracking-tight">{{
                      formatCurrency(cat.value)
                    }}</span>
                  </div>
                </div>
                <BaseProgressBar :percentage="cat.percentage" :color="cat.color" />
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Cash Flow Comparison -->
        <BaseCard class="mt-8">
          <template #header>Fluxo de Caixa Mensal</template>
          <div class="h-[300px] flex flex-col justify-end gap-8 pt-4">
            <div class="flex items-end justify-around h-48 px-4 gap-4">
              <div
                v-for="(item, i) in flowData"
                :key="i"
                class="flex-1 flex flex-col items-center gap-3"
              >
                <div class="w-full flex gap-1 items-end justify-center h-full">
                  <div
                    class="w-4 bg-primary-main/20 rounded-t-lg transition-all duration-700 hover:bg-primary-main/40"
                    :style="{ height: `${item.income}%` }"
                  ></div>
                  <div
                    class="w-4 bg-error-main/20 rounded-t-lg transition-all duration-700 hover:bg-error-main/40"
                    :style="{ height: `${item.expense}%` }"
                  ></div>
                </div>
                <span class="text-[10px] font-black uppercase tracking-widest text-text-disabled">{{
                  item.label
                }}</span>
              </div>
            </div>
            <!-- Flow Legend -->
            <div class="flex justify-center gap-8 border-t border-black/5 dark:border-white/5 pt-6">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-primary-main/40"></div>
                <span class="text-[10px] font-black uppercase tracking-widest text-text-disabled"
                  >Entradas</span
                >
              </div>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-error-main/40"></div>
                <span class="text-[10px] font-black uppercase tracking-widest text-text-disabled"
                  >Saídas</span
                >
              </div>
            </div>
          </div>
        </BaseCard>
      </main>

      <!-- SIDEBAR COLUMN: Metrics -->
      <aside class="side-column">
        <!-- Daily Average -->
        <BaseCard clickable>
          <div class="flex items-center gap-4 mb-4">
            <BaseIconBox color="var(--color-primary-main)" size="sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                width="18"
                height="18"
              >
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
              </svg>
            </BaseIconBox>
            <span class="text-[10px] font-black uppercase tracking-widest text-text-disabled"
              >Média Diária</span
            >
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="text-3xl font-black text-text-primary tracking-tighter">
              {{ formatCurrency(dailyAverage) }}
            </h3>
            <div class="flex items-center gap-1.5 text-success-main">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                width="14"
                height="14"
              >
                <path d="M23 6l-9.5 9.5-5-5L1 18"></path>
                <path d="M17 6h6v6"></path>
              </svg>
              <span class="text-[10px] font-black uppercase tracking-widest"
                >5% menor que o mês anterior</span
              >
            </div>
          </div>
        </BaseCard>

        <!-- Max Expense -->
        <BaseCard clickable>
          <div class="flex items-center gap-4 mb-4">
            <BaseIconBox color="var(--color-warning-main)" size="sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                width="18"
                height="18"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </BaseIconBox>
            <span class="text-[10px] font-black uppercase tracking-widest text-text-disabled"
              >Maior Gasto Único</span
            >
          </div>
          <div class="flex flex-col gap-1">
            <h3 class="text-3xl font-black text-text-primary tracking-tighter">
              {{ formatCurrency(maxExpense) }}
            </h3>
            <p class="text-[10px] font-black uppercase tracking-widest text-text-disabled">
              Supermercado em 15/03
            </p>
          </div>
        </BaseCard>

        <!-- Potential Savings -->
        <BaseCard clickable>
          <div class="flex items-center gap-4 mb-4">
            <BaseIconBox color="var(--color-success-main)" size="sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                width="18"
                height="18"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </BaseIconBox>
            <span class="text-[10px] font-black uppercase tracking-widest text-text-disabled"
              >Economia Potencial</span
            >
          </div>
          <div class="flex flex-col gap-1">
            <h3 class="text-3xl font-black text-success-main tracking-tighter">
              {{ formatCurrency(potentialSavings) }}
            </h3>
            <p class="text-[10px] font-black uppercase tracking-widest text-text-disabled">
              Se reduzir lazer em 20%
            </p>
          </div>
        </BaseCard>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import BaseViewHeader from '@/shared/components/organisms/BaseViewHeader.vue'

const activeFilter = ref('Mês')

// Mock analytics data
const totalExpenses = ref(3450.0)
const dailyAverage = ref(115.0)
const maxExpense = ref(420.5)
const potentialSavings = ref(690.0)

const categorySummary = [
  { name: 'Moradia', value: 1380, percentage: 40, color: 'var(--color-primary-main)' },
  { name: 'Alimentação', value: 1035, percentage: 30, color: 'var(--color-secondary-main)' },
  { name: 'Transporte', value: 517.5, percentage: 15, color: 'var(--color-accent-main)' },
  { name: 'Lazer', value: 345, percentage: 10, color: 'var(--color-warning-main)' },
  { name: 'Outros', value: 172.5, percentage: 5, color: 'var(--color-text-disabled)' },
]

const flowData = [
  { label: 'Out', income: 70, expense: 60 },
  { label: 'Nov', income: 85, expense: 55 },
  { label: 'Dez', income: 65, expense: 90 },
  { label: 'Jan', income: 90, expense: 45 },
  { label: 'Fev', income: 80, expense: 50 },
  { label: 'Mar', income: 75, expense: 65 },
]
</script>

<style scoped>
/* Scoped styles removed */
</style>
