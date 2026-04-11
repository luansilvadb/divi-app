<template>
  <BaseCard
    class="bg-surface-0/40 dark:bg-surface-800/40 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group p-6 transition-all duration-300 hover:bg-surface-0/50 dark:bg-surface-800/50"
  >
    <!-- Decorative Glow -->
    <div
      class="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] pointer-events-none"
    ></div>

    <div class="flex items-center justify-between mb-8 relative z-10">
      <div class="flex items-center gap-4">
        <div
          class="w-10 h-10 rounded-xl bg-accent-main/10 flex items-center justify-center text-accent shadow-inner border border-accent-main/20"
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
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
        </div>
        <div>
          <h3
            class="text-lg font-black text-surface-800 dark:text-surface-50 tracking-tight leading-tight"
          >
            Maiores Gastos
          </h3>
          <p
            class="text-[0.65rem] font-black uppercase tracking-widest text-surface-600 dark:text-surface-200 opacity-40"
          >
            Distribuição por Categoria
          </p>
        </div>
      </div>

      <div class="text-right">
        <div
          class="text-xs font-black text-surface-800/60 dark:text-surface-50/60 tracking-widest uppercase"
        >
          Total Mensal
        </div>
        <div class="text-xl font-black text-error tracking-tighter">
          R$ {{ Math.abs(totalExpense).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
        </div>
      </div>
    </div>

    <!-- Bars Container -->
    <div class="flex flex-col gap-6 relative z-10">
      <div v-for="cat in topCategories" :key="cat.id" class="group/bar">
        <div class="flex justify-between items-end mb-2">
          <div class="flex items-center gap-3">
            <div
              class="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
              :style="{ color: cat.color }"
            ></div>
            <span
              class="text-[0.7rem] font-black uppercase tracking-[0.1em] text-surface-800/80 dark:text-surface-50/80 group-hover/bar:text-surface-800 dark:text-surface-50 transition-colors"
            >
              {{ cat.name }}
            </span>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-[0.8rem] font-black text-surface-800 dark:text-surface-50">
              R$ {{ Math.abs(cat.total).toLocaleString('pt-BR', { minimumFractionDigits: 0 }) }}
            </span>
            <span
              class="text-[0.6rem] font-black text-surface-600 dark:text-surface-200 opacity-40"
            >
              {{ cat.percent.toFixed(1) }}%
            </span>
          </div>
        </div>

        <!-- Progress Bar SVG -->
        <div
          class="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-surface-200/10"
        >
          <transition
            appear
            enter-active-class="transition-all duration-1000 ease-out"
            enter-from-class="w-0"
            enter-to-class="w-full"
          >
            <div
              class="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(0,0,0,0.1)]"
              :style="{
                width: cat.percent + '%',
                backgroundColor: cat.color,
                boxShadow: `0 0 10px ${cat.color}44`,
              }"
            >
              <!-- Gloss Effect -->
              <div class="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="topCategories.length === 0"
        class="py-12 flex flex-col items-center text-center gap-4 opacity-30"
      >
        <div class="text-4xl">📊</div>
        <p class="text-[0.65rem] font-black uppercase tracking-widest">
          Aguardando lançamentos para gerar o gráfico
        </p>
      </div>
    </div>

    <!-- Footer Action -->
    <div class="mt-8 pt-6 border-t border-surface-200/10 flex justify-center">
      <BaseButton
        variant="ghost"
        class="!text-[0.6rem] !font-black !uppercase !tracking-[0.2em] !text-surface-600/60 dark:text-surface-200/60 hover:!text-surface-800 dark:text-surface-50 transition-all"
        @click="$router.push('/transactions')"
      >
        Análise Detalhada
      </BaseButton>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'

const transactionStore = useTransactionStore()

const topCategories = computed(() => transactionStore.topCategories)
const totalExpense = computed(() => transactionStore.totalExpense)
</script>

<style scoped>
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}
</style>
