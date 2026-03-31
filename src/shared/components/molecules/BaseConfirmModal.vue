<template>
  <BaseModal :show="show" @update:show="$emit('cancel')">
    <BaseCard
      class="w-[95%] max-w-[400px] mx-auto shadow-[0_30px_70px_rgba(0,0,0,0.6)] border border-white/5 !bg-surface-main overflow-hidden flex flex-col relative"
      padding="none"
    >
      <div class="p-8 text-center flex flex-col items-center">
        <!-- Icon/Warning -->
        <div 
          class="w-16 h-16 rounded-full bg-error-main/10 flex items-center justify-center text-error-main mb-6 border border-error-main/20 shadow-inner"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
        <p class="text-sm font-medium text-text-secondary leading-relaxed opacity-70">
          {{ message || 'Esta ação não poderá ser desfeita e os dados serão removidos permanentemente.' }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex border-t border-white/5">
        <button
          type="button"
          class="flex-1 py-5 font-black uppercase text-[0.7rem] tracking-widest text-text-secondary hover:bg-white/5 transition-all border-r border-white/5"
          @click="$emit('cancel')"
        >
          {{ cancelText || 'Cancelar' }}
        </button>
        <button
          type="button"
          class="flex-1 py-5 font-black uppercase text-[0.7rem] tracking-[0.15em] text-error-main hover:bg-error-main/10 transition-all flex items-center justify-center gap-2 group"
          @click="$emit('confirm')"
        >
          {{ confirmText || 'Excluir' }}
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-0.5 transition-transform">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </BaseCard>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import BaseCard from '../atoms/BaseCard.vue'

defineProps<{
  show: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}>()

defineEmits(['confirm', 'cancel'])
</script>
