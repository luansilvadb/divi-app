<template>
  <!-- Mobile Drawer -->
  <template v-if="isMobile">
    <NDrawer
      :show="show"
      @update:show="handleClose"
      placement="bottom"
      resizable
      :default-height="600"
      class="!rounded-t-[2.5rem] !bg-zinc-50 dark:!bg-zinc-950"
    >
      <div class="flex flex-col h-full">
        <!-- Drawer Handle & Header -->
        <div class="pt-3 pb-6 px-6 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div class="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-6 opacity-40"></div>
          <div class="flex flex-col">
            <h2 class="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none mb-1">
              {{ budget ? 'Editar Orçamento' : 'Novo Orçamento' }}
            </h2>
            <p class="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">Planejamento Financeiro</p>
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
      class="!max-w-xl !rounded-[2rem] !bg-zinc-50 dark:!bg-zinc-950 !border-none shadow-2xl"
      :header-style="{ padding: '0' }"
      :content-style="{ padding: '0' }"
    >
      <template #header>
        <div class="relative w-full">
          <!-- Subtle Background Accent -->
          <div class="absolute -top-20 -left-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="p-8 pb-5 flex items-center justify-between relative z-10">
            <!-- Header Labels (Luxury Display Style with CTA) -->
            <div class="flex flex-col gap-1.5">
              <NText 
                class="text-3xl md:text-4xl font-[900] tracking-tighter text-zinc-950 dark:text-zinc-50 !leading-[1.1]"
              >
                {{ budget ? 'Editar Orçamento' : 'Novo Orçamento' }}
              </NText>
              
              <NText 
                depth="3" 
                class="text-[11px] font-bold uppercase tracking-[0.1em] opacity-80 pl-0.5"
              >
                {{ budget ? 'Ajuste sua meta de gastos mensal' : 'Defina um limite de gastos para este mês' }}
              </NText>
            </div>

            <!-- Custom Close Button -->
            <NButton 
              quaternary 
              circle 
              size="large"
              class="!text-zinc-400 hover:!text-zinc-900 dark:hover:!text-zinc-50 hover:!bg-zinc-200/50 dark:hover:!bg-zinc-800/50 transition-all"
              @click="$emit('close')"
            >
              <template #icon>
                <i class="i-lucide-x text-2xl"></i>
              </template>
            </NButton>
          </div>

          <!-- Razor-thin Separator -->
          <div class="mx-8 h-[1px] bg-zinc-200/60 dark:bg-zinc-800/60"></div>
        </div>
      </template>

      <div class="px-2 pb-2">
        <BudgetFormContent :initial-data="budget" @close="$emit('close')" @saved="handleSaved" />
      </div>
    </NModal>
  </template>
</template>

<script setup lang="ts">
import { NModal, NDrawer, NButton, NText } from 'naive-ui'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import BudgetFormContent from './BudgetFormContent.vue'
import type { Budget } from '@/shared/domain/entities/Budget'

defineProps<{
  show: boolean
  budget?: Budget | null
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
