<template>
  <!-- Mobile Drawer -->
  <template v-if="isMobile">
    <NDrawer
      :show="show"
      @update:show="handleClose"
      placement="bottom"
      resizable
      :default-height="600"
      class="!rounded-t-[2rem]"
    >
      <div class="flex flex-col h-full">
        <!-- Drawer Handle & Header -->
        <div class="pt-3 pb-6 px-6">
          <div class="w-12 h-1.5 bg-quaternary rounded-full mx-auto mb-6 opacity-40"></div>
          <div class="flex flex-col">
            <h2 class="text-xl font-black tracking-tight leading-none mb-1">
              {{ budget ? 'Editar Orçamento' : 'Novo Orçamento' }}
            </h2>
            <p class="text-[10px] font-bold uppercase tracking-[0.15em] text-tertiary">Planejamento Financeiro</p>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto pb-safe">
          <BudgetFormContent :initial-data="budget" @close="$emit('close')" @saved="handleSaved" />
        </div>
      </div>
    </NDrawer>
  </template>

  <!-- Desktop Modal -->
  <template v-else>
    <NModal
      :show="show"
      @update:show="handleClose"
      preset="card"
      :closable="false"
      class="!max-w-xl !rounded-[2rem] shadow-lg"
      :header-style="{ padding: '0' }"
      :content-style="{ padding: '0' }"
    >
      <template #header>
        <div class="relative w-full">
          <div class="px-6 pt-6 pb-6 flex items-start justify-between">
            <!-- Header Content -->
            <div class="flex flex-col gap-1">
              <h2 class="text-[#1d1d1f] dark:text-white font-sf-display font-semibold text-[24px] leading-[1.3] tracking-[-0.02em]">
                {{ budget ? 'Editar Orçamento' : 'Novo Orçamento' }}
              </h2>
              <p class="text-[#6e6e73] dark:text-[#8e8e93] text-[17px] font-sf-text font-normal leading-[1.5]">
                {{ budget ? 'Ajuste sua meta de gastos mensal' : 'Defina um limite de gastos para este mês' }}
              </p>
            </div>

            <!-- Close Button - Apple Style -->
            <button
              class="w-9 h-9 rounded-full flex items-center justify-center text-[#6e6e73] dark:text-[#8e8e93] hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] hover:text-[#1d1d1f] dark:hover:text-white active:scale-95 transition-all duration-150"
              @click="$emit('close')"
            >
              <i class="i-lucide-x text-xl"></i>
            </button>
          </div>
        </div>
      </template>

      <div class="px-2 pb-2">
        <BudgetFormContent :initial-data="budget" @close="$emit('close')" @saved="handleSaved" />
      </div>
    </NModal>
  </template>
</template>

<script setup lang="ts">
import { NModal, NDrawer } from 'naive-ui'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import BudgetFormContent from './BudgetFormContent.vue'
import type { IBudget } from '@/modules/budgets/core/entities/IBudget'

defineProps<{
  show: boolean
  budget?: IBudget | null
}>()

const emit = defineEmits(['close', 'saved'])
const isMobile = useIsMobile()

function handleClose(value: boolean) {
  if (!value) emit('close')
}

function handleSaved() {
  emit('saved')
  emit('close')
}
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 1.5rem);
}
</style>
