<template>
  <StandardPageLayout
    title="Análise de Performance"
    highlight="Análise"
    subtitle="Descubra para onde seu dinheiro está indo com insights baseados em seus dados."
  >
    <template #action>
      <div class="flex items-center justify-end w-full lg:min-w-[420px]">
        <BaseMonthSwitcher :month="currentMonth" @prev="prevMonth" @next="nextMonth" />
      </div>
    </template>

    <div class="view-content-grid">
      <!-- MAIN COLUMN: Analytics Charts -->
      <main class="main-column">
        <!-- Distribution by Category -->
        <BaseCard class="hover-glow">
          <template #header>Distribuição por Categoria</template>
          <div class="flex flex-col gap-8 pt-4">
            <div v-for="cat in categorySummary" :key="cat.name" class="flex flex-col gap-3">
              <div class="flex justify-between items-end">
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: cat.color }"></div>
                  <span
                    class="text-[10px] font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-50"
                    >{{ cat.name }}</span
                  >
                </div>
                <div class="flex items-baseline gap-2">
                  <span class="text-sm font-black text-zinc-800 dark:text-zinc-50">{{
                    formatCurrency(cat.value)
                  }}</span>
                  <span class="text-[10px] font-bold text-zinc-400"
                    >{{ cat.percentage }}%</span
                  >
                </div>
              </div>
              <BaseProgressBar :percentage="cat.percentage" :color="cat.color" />
            </div>
          </div>
        </BaseCard>

        <!-- Cash Flow History -->
        <BaseCard class="hover-glow">
          <template #header>Fluxo de Caixa (Histórico)</template>
          <div class="pt-6">
            <div class="flex items-end justify-around h-48 px-4 gap-4">
              <div
                v-for="(item, i) in flowData"
                :key="i"
                class="flex-1 flex flex-col items-center gap-3 h-full"
              >
                <div class="w-full flex gap-1 items-end justify-center h-full pb-2">
                  <div
                    class="w-4 bg-violet-500/20 rounded-t-lg transition-all duration-700 hover:bg-violet-500/40"
                    :style="{ height: `${item.income}%` }"
                  ></div>
                  <div
                    class="w-4 bg-red-500/20 rounded-t-lg transition-all duration-700 hover:bg-red-500/40"
                    :style="{ height: `${item.expense}%` }"
                  ></div>
                </div>
                <span
                  class="text-[9px] font-black uppercase tracking-widest text-zinc-400"
                  >{{ item.label }}</span
                >
              </div>
            </div>
            <!-- Flow Legend -->
            <div
              class="flex items-center justify-center gap-8 border-t border-zinc-100 dark:border-zinc-800 pt-6 mt-4"
            >
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-violet-500/40"></div>
                <span
                  class="text-[9px] font-black uppercase tracking-widest text-zinc-400"
                  >Entradas</span
                >
              </div>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-red-500/40"></div>
                <span
                  class="text-[9px] font-black uppercase tracking-widest text-zinc-400"
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
        <BaseCard class="hover-glow">
          <div class="flex items-center gap-4 mb-4">
            <BaseIconBox color="#8b5cf6" size="sm">
              <i class="i-lucide-wallet text-lg"></i>
            </BaseIconBox>
            <span
              class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
              >Média Diária</span
            >
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="text-3xl font-black text-zinc-800 dark:text-zinc-50 tracking-tighter">
              {{ formatCurrency(dailyAverage) }}
            </h3>
            <div class="flex items-center gap-1.5 text-emerald-500">
              <i class="i-lucide-trending-down text-sm"></i>
              <span class="text-[10px] font-black uppercase tracking-widest"
                >5% menor que o mês anterior</span
              >
            </div>
          </div>
        </BaseCard>

        <!-- Max Expense -->
        <BaseCard class="hover-glow">
          <div class="flex items-center gap-4 mb-4">
            <BaseIconBox color="#f59e0b" size="sm">
              <i class="i-lucide-alert-circle text-lg"></i>
            </BaseIconBox>
            <span
              class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
              >Maior Gasto Único</span
            >
          </div>
          <div class="flex flex-col gap-1">
            <h3 class="text-3xl font-black text-zinc-800 dark:text-zinc-50 tracking-tighter">
              {{ formatCurrency(maxExpense) }}
            </h3>
            <p
              class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
            >
              Supermercado em 15/03
            </p>
          </div>
        </BaseCard>

        <!-- Potential Savings -->
        <BaseCard class="hover-glow">
          <div class="flex items-center gap-4 mb-4">
            <BaseIconBox color="#10b981" size="sm">
              <i class="i-lucide-piggy-bank text-lg"></i>
            </BaseIconBox>
            <span
              class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
              >Economia Potencial</span
            >
          </div>
          <div class="flex flex-col gap-1">
            <h3 class="text-3xl font-black text-emerald-500 tracking-tighter">
              {{ formatCurrency(potentialSavings) }}
            </h3>
            <p
              class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
            >
              Se reduzir lazer em 20%
            </p>
          </div>
        </BaseCard>
      </aside>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import BaseMonthSwitcher from '@/shared/components/molecules/BaseMonthSwitcher.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'

const activeDate = ref(new Date())

const currentMonth = computed(() => {
  return activeDate.value.toLocaleString('pt-BR', { month: 'long' }).toUpperCase()
})

function prevMonth() {
  activeDate.value = new Date(activeDate.value.getFullYear(), activeDate.value.getMonth() - 1, 1)
}

function nextMonth() {
  activeDate.value = new Date(activeDate.value.getFullYear(), activeDate.value.getMonth() + 1, 1)
}

// Mock analytics data
const dailyAverage = ref(115.0)
const maxExpense = ref(420.5)
const potentialSavings = ref(690.0)

const categorySummary = [
  { name: 'Moradia', value: 1380, percentage: 40, color: '#8b5cf6' },
  { name: 'Alimentação', value: 1035, percentage: 30, color: '#3b82f6' },
  { name: 'Transporte', value: 517.5, percentage: 15, color: '#10b981' },
  { name: 'Lazer', value: 345, percentage: 10, color: '#f59e0b' },
  { name: 'Outros', value: 172.5, percentage: 5, color: '#a1a1aa' },
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
