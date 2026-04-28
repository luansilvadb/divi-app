<template>
  <div
    class="rounded-xl overflow-hidden bg-surface-primary border border-separator transition-colors duration-normal"
    id="dashboard-category-bars"
  >
    <!-- Header -->
    <div
      class="px-6 py-4 flex items-center justify-between border-b border-separator bg-surface-secondary"
    >
      <div>
        <h3 class="text-[13px] font-semibold text-label">Maiores Gastos</h3>
        <p class="text-[11px] mt-0.5 text-tertiary">Por categoria este mês</p>
      </div>
      <span class="text-[13px] font-semibold tabular-nums text-error">
        R$ {{ Math.abs(totalExpense).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
      </span>
    </div>

    <!-- Bars List -->
    <div class="p-5 flex flex-col gap-5">
      <div v-for="cat in topCategories" :key="cat.id">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2 min-w-0">
            <div
              class="w-2 h-2 rounded-full shrink-0"
              :style="{ background: cat.color }"
            ></div>
            <span
              class="text-[12px] font-medium truncate text-label"
            >{{ cat.name }}</span>
          </div>
          <div class="flex items-baseline gap-1.5 shrink-0 pl-3">
            <span class="text-[12px] font-semibold tabular-nums text-label">
              R$ {{ Math.abs(cat.total).toLocaleString('pt-BR', { minimumFractionDigits: 0 }) }}
            </span>
            <span class="text-[11px] text-tertiary">{{ cat.percent.toFixed(0) }}%</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="relative h-1.5 w-full rounded-full overflow-hidden bg-surface-secondary">
          <div
            class="absolute left-0 top-0 h-full rounded-full transition-all duration-150 ease-out"
            :style="{ width: cat.percent + '%', background: cat.color }"
          ></div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="topCategories.length === 0"
        class="py-10 flex flex-col items-center text-center gap-3 text-tertiary"
      >
        <i class="i-lucide-bar-chart-3 text-2xl opacity-30"></i>
        <p class="text-[12px] opacity-60">Nenhum lançamento este mês</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-5 py-3.5 border-t border-separator">
      <button
        @click="$router.push('/transactions')"
        class="text-[12px] font-medium transition-colors duration-200 w-full text-center text-primary"
      >
        Ver análise detalhada
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usetransactionstore } from '@/modules/transactions/application/stores/transactionstore'

const $router = useRouter()
const transactionstore = usetransactionstore()

const topCategories = computed(() => transactionstore.topCategories)
const totalExpense = computed(() => transactionstore.totalExpense)
</script>
