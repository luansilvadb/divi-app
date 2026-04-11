<template>
  <component
    :is="isMobile ? Drawer : Dialog"
    :visible="show"
    @update:visible="$emit('cancel')"
    :position="isMobile ? 'bottom' : undefined"
    :modal="true"
    :dismissableMask="true"
    :closable="false"
    :showHeader="false"
    :class="[
      '!bg-transparent !border-none !shadow-none',
      isMobile ? '!h-auto' : 'w-[95%] max-w-[400px]',
    ]"
    :pt="isMobile ? bottomSheetPt : modalPt"
  >
    <template v-if="!isMobile">
      <BaseCard
        class="w-full apple-material-thick shadow-apple-high border border-surface-200/10 overflow-hidden flex flex-col relative"
        padding="none"
      >
        <div class="p-8 text-center flex flex-col items-center">
          <div
            class="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error mb-6 border border-error-main/20 shadow-inner"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </div>

          <h3 class="text-xl font-black text-surface-800 dark:text-surface-50 tracking-tight mb-2">
            {{ title || 'Tem certeza?' }}
          </h3>
          <p
            class="text-sm font-medium text-surface-600 dark:text-surface-200 leading-relaxed opacity-70"
          >
            {{
              message ||
              'Esta ação não poderá ser desfeita e os dados serão removidos permanentemente.'
            }}
          </p>
        </div>

        <div class="flex border-t border-surface-200/10">
          <button
            type="button"
            class="flex-1 py-5 font-black uppercase text-[0.7rem] tracking-widest text-surface-600 dark:text-surface-200 hover:bg-white/5 transition-all border-r border-surface-200/10"
            @click="$emit('cancel')"
          >
            {{ cancelText || 'Cancelar' }}
          </button>
          <button
            type="button"
            class="flex-1 py-5 font-black uppercase text-[0.7rem] tracking-[0.15em] text-error hover:bg-error/10 transition-all flex items-center justify-center gap-2 group"
            @click="$emit('confirm')"
          >
            {{ confirmText || 'Excluir' }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="group-hover:translate-x-0.5 transition-transform"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </BaseCard>
    </template>
    <template v-else>
      <div
        class="apple-material-thick rounded-t-[2rem] p-8 text-center flex flex-col items-center shadow-[0_-10px_40px_rgba(0,0,0,0.4)]"
      >
        <!-- Drag Handle for Visual Cue -->
        <div class="w-12 h-1.5 bg-white/10 rounded-full mb-8 shrink-0"></div>

        <!-- Icon/Warning -->
        <div
          class="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error mb-6 border border-error-main/20 shadow-inner"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </div>

        <h3 class="text-xl font-black text-surface-800 dark:text-surface-50 tracking-tight mb-2">
          {{ title || 'Tem certeza?' }}
        </h3>
        <p
          class="text-sm font-medium text-surface-600 dark:text-surface-200 leading-relaxed opacity-70 mb-8"
        >
          {{
            message ||
            'Esta ação não poderá ser desfeita e os dados serão removidos permanentemente.'
          }}
        </p>

        <!-- Action Buttons -->
        <div class="w-full space-y-3 pb-safe">
          <BaseButton
            variant="danger"
            class="w-full !py-4 font-black uppercase text-[0.7rem] tracking-[0.15em]"
            @click="$emit('confirm')"
          >
            {{ confirmText || 'Excluir' }}
          </BaseButton>
          <BaseButton
            variant="ghost"
            class="w-full !py-4 font-black uppercase text-[0.7rem] tracking-widest opacity-40 hover:opacity-100"
            @click="$emit('cancel')"
          >
            {{ cancelText || 'Cancelar' }}
          </BaseButton>
        </div>
      </div>
    </template>
  </component>
</template>

<script setup lang="ts">
import { useIsMobile } from '@/shared/composables/useIsMobile'
import Dialog from 'primevue/dialog'
import Drawer from 'primevue/drawer'
import BaseCard from '../atoms/BaseCard.vue'
import BaseButton from '../atoms/BaseButton.vue'
import { useOverlayPt } from '@/shared/composables/usePrimeOverlay'

defineProps<{
  show: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}>()

defineEmits(['confirm', 'cancel'])

const isMobile = useIsMobile()

const { modalPt, bottomSheetPt } = useOverlayPt()
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 2rem);
}
</style>
