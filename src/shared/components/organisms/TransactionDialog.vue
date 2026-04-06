<template>
  <template v-if="isMobile">
    <Drawer
      :visible="show"
      @update:visible="handleClose"
      position="bottom"
      :modal="true"
      :dismissableMask="true"
      :closable="false"
      class="!w-full !h-auto border-t border-white/5 rounded-t-[2rem] overflow-hidden !bg-surface-main"
      :ptOptions="{ mergeProps: true }"
      :pt="{
        mask: { class: '!z-[200]' },
        header: { class: '!p-0' },
        content: { class: '!p-0 overflow-y-auto !bg-surface-main' },
        pcCloseButton: { root: { class: '!hidden' } },
        closeButton: { class: '!hidden' }
      }"
    >
      <template #header>
        <div class="relative w-full overflow-hidden border-b border-black/5 dark:border-white/5 bg-surface-main">
          <!-- Premium Strategic Overlay -->
          <div class="absolute inset-0 bg-primary-main/[0.04] pointer-events-none"></div>

          <div class="flex flex-col w-full relative z-10 px-6 py-5">
            <!-- Strategic Drag Handle -->
            <div class="w-10 h-1 bg-black/10 dark:bg-white/10 rounded-full mb-4 mx-auto opacity-40"></div>

            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <h2 class="text-xl font-black text-text-primary tracking-tight leading-none mb-1">
                  {{ transaction ? 'Editar Lançamento' : 'Novo Lançamento' }}
                </h2>
                <p class="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-text-secondary opacity-60">
                  REGISTRO FINANCEIRO
                </p>
              </div>

              <!-- More Integrated/Subtle Custom Close Button -->
              <BaseButton
                variant="ghost"
                @click="$emit('close')"
                :pt="{
                  root: {
                    class: 'w-10 h-10 !rounded-full !p-0 text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-95'
                  }
                }"
              >
                <i class="pi pi-times text-xl"></i>
              </BaseButton>
            </div>
          </div>
        </div>
      </template>

      <div class="h-full max-h-[85vh] overflow-y-auto pb-safe bg-surface-main dark:bg-[#131824]">
        <TransactionFormContent :initial-data="transaction" @close="$emit('close')" @saved="handleSaved" />
      </div>
    </Drawer>
  </template>

  <template v-else>
    <Dialog
      :visible="show"
      @update:visible="handleClose"
      :modal="true"
      :dismissableMask="true"
      :closable="false"
      class="w-full max-w-xl border border-white/5 overflow-hidden"
      :ptOptions="{ mergeProps: true }"
      :pt="{
        mask: { class: '!z-[50]' },
        header: { class: '!p-0' },
        content: { class: '!p-0' }
      }"
    >
      <template #header>
        <div class="absolute inset-0 bg-gradient-to-br from-primary-main/10 via-transparent to-transparent pointer-events-none transition-opacity"></div>
        <div class="flex items-center justify-between w-full relative z-10 bg-primary-main/10 p-5 sm:p-7 border-b border-light/5 dark:border-white/5">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-primary-main/20 flex items-center justify-center text-primary-main shadow-inner border border-primary-main/20 shrink-0">
              <i class="pi pi-plus text-xl"></i>
            </div>
            <div>
              <h2 class="text-2xl font-black text-text-primary tracking-tight leading-tight">
                {{ transaction ? 'Editar Transação' : 'Nova Transação' }}
              </h2>
              <p class="text-[0.65rem] mt-1 font-black uppercase tracking-[0.2em] text-text-secondary opacity-40">
                Adicione um novo lançamento manual
              </p>
            </div>
          </div>
          <BaseButton
            variant="ghost"
            @click="$emit('close')"
            :pt="{ root: { class: 'w-10 h-10 !rounded-xl !p-0 bg-black/5 dark:bg-white/5 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 group shrink-0' } }"
          >
            <i class="pi pi-times text-lg"></i>
          </BaseButton>
        </div>
      </template>

      <div class="h-full pb-safe bg-surface-main dark:bg-[#131824]">
        <TransactionFormContent :initial-data="transaction" @close="$emit('close')" @saved="handleSaved" />
      </div>
    </Dialog>
  </template>
</template>

<script setup lang="ts">
import { useIsMobile } from '@/shared/composables/useIsMobile'
import Dialog from 'primevue/dialog'
import Drawer from 'primevue/drawer'
import BaseButton from '../atoms/BaseButton.vue'
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
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}
</style>
