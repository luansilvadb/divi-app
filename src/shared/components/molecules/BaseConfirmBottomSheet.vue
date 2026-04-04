<template>
  <Drawer
    :visible="show"
    @update:visible="$emit('cancel')"
    position="bottom"
    class="!bg-transparent !border-none !shadow-none !h-auto"
    :pt="{
      mask: { class: 'backdrop-blur-sm bg-black/40 z-[90]' },
      root: { class: 'z-[100]' },
      header: { class: 'p-0 border-none hidden' },
      content: { class: 'p-0 !bg-transparent' }
    }"
  >
    <div
      class="bg-surface-main dark:bg-surface-main rounded-t-[2rem] p-8 text-center flex flex-col items-center shadow-[0_-10px_40px_rgba(0,0,0,0.4)]"
    >
      <!-- Drag Handle for Visual Cue -->
      <div class="w-12 h-1.5 bg-white/10 rounded-full mb-8 shrink-0"></div>

      <!-- Icon/Warning -->
      <div
        class="w-16 h-16 rounded-full bg-error-main/10 flex items-center justify-center text-error-main mb-6 border border-error-main/20 shadow-inner"
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

      <h3 class="text-xl font-black text-text-primary tracking-tight mb-2">
        {{ title || 'Tem certeza?' }}
      </h3>
      <p class="text-sm font-medium text-text-secondary leading-relaxed opacity-70 mb-8">
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
  </Drawer>
</template>

<script setup lang="ts">
import Drawer from 'primevue/drawer'
import BaseButton from '../atoms/BaseButton.vue'

defineProps<{
  show: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}>()

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 2rem);
}
</style>
