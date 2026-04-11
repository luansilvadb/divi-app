<template>
  <template v-if="isMobile">
    <NDrawer
      :show="show"
      @update:show="handleClose"
      placement="bottom"
      :height="'auto'"
      class="!rounded-t-[2.5rem] !bg-zinc-50 dark:!bg-zinc-950 overflow-hidden"
    >
      <div class="flex flex-col h-full">
        <!-- Drawer Header -->
        <div class="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
          <div class="w-10 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-4 opacity-50"></div>
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-xl font-black text-zinc-800 dark:text-zinc-50 tracking-tight leading-none mb-1">
                {{ transaction ? 'Editar Lançamento' : 'Novo Lançamento' }}
              </span>
              <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Registro Financeiro</span>
            </div>
            <NButton quaternary circle @click="$emit('close')">
              <template #icon><i class="i-lucide-x text-xl"></i></template>
            </NButton>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto pb-safe">
          <TransactionFormContent
            :initial-data="transaction"
            @close="$emit('close')"
            @saved="handleSaved"
          />
        </div>
      </div>
    </NDrawer>
  </template>

  <template v-else>
    <NModal
      :show="show"
      @update:show="handleClose"
      preset="card"
      class="!max-w-xl !rounded-[2rem] !bg-zinc-50 dark:!bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl"
      :segmented="{ content: 'soft', footer: 'soft' }"
      :header-style="{ padding: '0' }"
      :content-style="{ padding: '0' }"
    >
      <template #header>
        <div class="p-8 border-b border-zinc-200 dark:border-zinc-800 bg-violet-500/5 w-full">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-violet-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
                <i class="i-lucide-plus text-2xl"></i>
              </div>
              <div class="flex flex-col">
                <span class="text-2xl font-black text-zinc-800 dark:text-zinc-50 tracking-tight leading-none">
                  {{ transaction ? 'Editar Transação' : 'Nova Transação' }}
                </span>
                <span class="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mt-1">Lançamento Manual</span>
              </div>
            </div>
            <NButton quaternary circle size="large" @click="$emit('close')">
              <template #icon><i class="i-lucide-x text-xl"></i></template>
            </NButton>
          </div>
        </div>
      </template>

      <div class="p-2">
        <TransactionFormContent
          :initial-data="transaction"
          @close="$emit('close')"
          @saved="handleSaved"
        />
      </div>
    </NModal>
  </template>
</template>

<script setup lang="ts">
import { NModal, NDrawer, NButton } from 'naive-ui'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import TransactionFormContent from './TransactionFormContent.vue'
import type { Transaction } from '@/shared/domain/entities/Transaction'

defineProps<{
  show: boolean
  transaction?: Transaction | null
}>()

const emit = defineEmits(['close', 'saved'])
const isMobile = useIsMobile()

function handleClose(value: boolean) {
  if (!value) {
    emit('close')
  }
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
