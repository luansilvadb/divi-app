<template>
  <StandardPageLayout
    title="Análise de Performance"
    highlight="Análise"
    subtitle="Descubra para onde seu dinheiro está indo com insights baseados em seus dados."
  >
    <template #action>
      <BaseMonthSwitcher :month="currentMonth" @prev="prevMonth" @next="nextMonth" />
    </template>

    <div class="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
      <!-- MAIN COLUMN: Analytics Charts -->
      <NSpace vertical :size="16">
        <!-- Distribution by ICategory -->
        <NCard>
          <template #header><NText strong>Distribuição por Categoria</NText></template>
          <NSpace vertical :size="20" class="pt-2">
            <div v-for="cat in categorySummary" :key="cat.name">
              <NSpace justify="space-between" align="end" class="mb-2">
                <NSpace align="center" :size="8">
                  <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: cat.color }"></div>
                  <NText strong class="text-xs uppercase tracking-wider">{{ cat.name }}</NText>
                </NSpace>
                <NSpace :size="8" align="baseline">
                  <NText strong class="text-sm tabular-nums">{{ formatCurrency(cat.value) }}</NText>
                  <NText depth="3" class="text-xs tabular-nums">{{ cat.percentage }}%</NText>
                </NSpace>
              </NSpace>
              <NProgress
                type="line"
                :percentage="cat.percentage"
                :show-indicator="false"
                :color="cat.color"
                :height="5"
              />
            </div>
          </NSpace>
        </NCard>

        <!-- Cash Flow History -->
        <NCard>
          <template #header><NText strong>Fluxo de Caixa (Histórico)</NText></template>
          <div class="pt-4">
            <div class="flex items-end justify-around h-48 px-4 gap-3">
              <div
                v-for="(item, i) in flowData"
                :key="i"
                class="flex-1 flex flex-col items-center gap-2 h-full"
              >
                <div class="w-full flex gap-1 items-end justify-center h-full pb-2">
                  <div
                    class="w-4 bg-[rgba(0,122,255,0.15)] rounded-t-lg transition-all duration-150 ease-out hover:bg-[rgba(0,122,255,0.32)]"
                    :style="{ height: `${item.income}%` }"
                  ></div>
                  <div
                    class="w-4 bg-red-500/20 rounded-t-lg transition-all duration-150 ease-out hover:bg-red-500/40"
                    :style="{ height: `${item.expense}%` }"
                  ></div>
                </div>
                <NText depth="3" class="text-[9px] uppercase tracking-widest font-bold">{{ item.label }}</NText>
              </div>
            </div>
            <NDivider />
            <NSpace justify="center" :size="24">
              <NSpace align="center" :size="6">
                <div class="w-2 h-2 rounded-full bg-[rgba(0,122,255,0.32)]"></div>
                <NText depth="3" class="text-[9px] uppercase tracking-widest font-bold">Entradas</NText>
              </NSpace>
              <NSpace align="center" :size="6">
                <div class="w-2 h-2 rounded-full bg-red-500/40"></div>
                <NText depth="3" class="text-[9px] uppercase tracking-widest font-bold">Saídas</NText>
              </NSpace>
            </NSpace>
          </div>
        </NCard>
      </NSpace>

      <!-- SIDEBAR COLUMN: Metrics -->
      <NSpace vertical :size="16">
        <!-- Daily Average -->
        <NCard hoverable>
          <NSpace align="center" :size="12" class="mb-3">
            <div class="w-9 h-9 rounded-xl bg-[rgba(0,122,255,0.08)] flex items-center justify-center text-[#007AFF]">
              <i class="i-lucide-IWallet text-lg"></i>
            </div>
            <NText depth="3" class="text-xs uppercase tracking-widest font-bold">Média Diária</NText>
          </NSpace>
          <NStatistic tabular-nums>
            <NNumberAnimation :from="0" :to="dailyAverage" :precision="2" show-separator />
            <template #prefix><NText depth="3">R$</NText></template>
          </NStatistic>
          <NSpace align="center" :size="4" class="mt-2">
            <NTag type="success" size="small" round :bordered="false">
              <template #icon><i class="i-lucide-trending-down text-xs"></i></template>
              -5%
            </NTag>
            <NText depth="3" class="text-xs">menor que o mês anterior</NText>
          </NSpace>
        </NCard>

        <!-- Max Expense -->
        <NCard hoverable>
          <NSpace align="center" :size="12" class="mb-3">
            <div class="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <i class="i-lucide-alert-circle text-lg"></i>
            </div>
            <NText depth="3" class="text-xs uppercase tracking-widest font-bold">Maior Gasto Único</NText>
          </NSpace>
          <NStatistic tabular-nums>
            <NNumberAnimation :from="0" :to="maxExpense" :precision="2" show-separator />
            <template #prefix><NText depth="3">R$</NText></template>
          </NStatistic>
          <NText depth="3" class="text-xs block mt-2">Supermercado em 15/03</NText>
        </NCard>

        <!-- Potential Savings -->
        <NCard hoverable>
          <NSpace align="center" :size="12" class="mb-3">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <i class="i-lucide-piggy-bank text-lg"></i>
            </div>
            <NText depth="3" class="text-xs uppercase tracking-widest font-bold">Economia Potencial</NText>
          </NSpace>
          <NStatistic tabular-nums>
            <NText type="success" strong class="text-2xl">
              <NNumberAnimation :from="0" :to="potentialSavings" :precision="2" show-separator />
            </NText>
            <template #prefix><NText depth="3">R$</NText></template>
          </NStatistic>
          <NText depth="3" class="text-xs block mt-2">Se reduzir lazer em 20%</NText>
        </NCard>
      </NSpace>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  NCard,
  NSpace,
  NText,
  NTag,
  NProgress,
  NStatistic,
  NNumberAnimation,
  NDivider,
} from 'naive-ui'
import { formatCurrency } from '@/shared/utils/formatters'
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
