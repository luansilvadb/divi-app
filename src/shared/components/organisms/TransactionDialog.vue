<template>
  <component
    :is="isMobile ? Drawer : Dialog"
    :visible="show"
    @update:visible="handleClose"
    :position="isMobile ? 'bottom' : undefined"
    :modal="true"
    :dismissableMask="true"
    :closable="false"
    :showHeader="false"
    :class="[
      '!bg-transparent !border-none !shadow-none w-full',
      isMobile ? '!h-auto' : 'max-w-xl p-4 sm:p-6'
    ]"
    :pt="isMobile ? bottomSheetPt : modalPt"
  >
    <template v-if="!isMobile">
      <BaseCard
        class="w-full shadow-[0_30px_70px_rgba(0,0,0,0.6)] border border-white/5 !bg-surface-main overflow-hidden flex flex-col relative"
        padding="none"
      >
        <!-- Header Area -->
        <div class="bg-primary-main/10 p-7 border-b border-white/5 relative">
          <div class="absolute inset-0 bg-gradient-to-br from-primary-main/10 via-transparent to-transparent pointer-events-none"></div>
          <div class="flex items-center justify-between relative z-10">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-primary-main/20 flex items-center justify-center text-primary-main shadow-inner border border-primary-main/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14" /><path d="M12 5v14" />
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-black text-text-primary tracking-tight leading-tight">
                  {{ transaction ? 'Editar Transação' : 'Nova Transação' }}
                </h2>
                <p class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40">
                  Adicione um novo lançamento manual
                </p>
              </div>
            </div>
            <button @click="$emit('close')" class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all border border-white/5 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:rotate-90 transition-transform duration-300">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Body Area -->
        <TransactionFormContent :initial-data="transaction" @close="$emit('close')" @saved="handleSaved" />
      </BaseCard>
    </template>
    <template v-else>
      <!-- Header Area (Premium Split) -->
      <div
        class="bg-primary-main/10 p-4 border-b border-black/5 dark:border-white/5 relative bg-surface-main dark:bg-surface-main text-text-primary rounded-t-[1.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.4)]"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary-main/10 via-transparent to-transparent pointer-events-none rounded-t-[1.5rem]"
        ></div>
        <div class="flex flex-col items-center mb-4">
          <!-- Drag Handle for Visual Cue -->
          <div class="w-12 h-1.5 bg-white/10 rounded-full mb-2 shrink-0"></div>
        </div>
        <div class="flex items-center justify-between relative z-10">
          <div class="flex items-center gap-4">
            <div
              class="w-9 h-9 rounded-2xl bg-primary-main/20 flex items-center justify-center text-primary-main shadow-inner border border-primary-main/20"
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
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-black text-text-primary tracking-tight leading-tight">
                {{ transaction ? 'Editar Transação' : 'Nova Transação' }}
              </h2>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-black/10 dark:hover:bg-white/10 transition-all border border-black/5 dark:border-white/5 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="group-hover:rotate-90 transition-transform duration-300"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Body Area -->
      <div class="bg-surface-main dark:bg-surface-main text-text-primary h-full pb-safe">
        <TransactionFormContent
          :initial-data="transaction"
          @close="$emit('close')"
          @saved="handleSaved"
        />
      </div>
    </template>
  </component>
</template>

<script setup lang="ts">
import { useIsMobile } from '@/shared/composables/useIsMobile'
import Dialog from 'primevue/dialog'
import Drawer from 'primevue/drawer'
import BaseCard from '../atoms/BaseCard.vue'
import TransactionFormContent from './TransactionFormContent.vue'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import { useOverlayPt } from '@/shared/composables/usePrimeOverlay'

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

const { modalPt, bottomSheetPt } = useOverlayPt()
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}
</style>
